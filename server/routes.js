const { Pool, types } = require('pg');
const config = require('./config.json')


types.setTypeParser(20, val => parseInt(val, 10)); 

const connection = new Pool({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db,
  ssl: {
    rejectUnauthorized: false,
  },
});
connection.connect((err) => err && console.log(err));

/******************
 * JOB ROUTES *
 ******************/

//  Route 1: GET /search_jobs - Search jobs by title
const search_jobs = async function(req, res) {
  console.log('=== SEARCH_JOBS CALLED ===');
  console.log('Query params:', req.query);
  
  const searchTerm = req.query.searchTerm ?? '';
  console.log('Search term:', searchTerm);

  if (searchTerm.trim() === '') {
    console.log('Empty search term, returning empty array');
    res.json([]);
    return;
  }

  console.log('About to query database...');
  
  connection.query(`
    SELECT * 
    FROM postings 
    WHERE LOWER(title) LIKE $1
    LIMIT 8
  `, [`%${searchTerm.toLowerCase()}%`], (err, data) => {
    if (err) {
      console.log('=== DATABASE ERROR ===');
      console.log(err);
      res.status(500).json({ error: err.message });
    } else {
      console.log('=== QUERY SUCCESS ===');
      console.log('Rows found:', data.rows.length);
      res.json(data.rows);
    }
  });
};



/********************************
 * INDUSTRY ANALYTICS ROUTE
 ********************************/

//  Route 2: GET /industry_analytics - Get top 3 industries by location (top 20 locations by job count)
async function industry_analytics(req, res) {
  console.log('Industry analytics endpoint called');
  
  const query = `
    WITH TopLocations AS (
        SELECT 
            p.location,
            COUNT(*) AS total_jobs
        FROM postings p
        WHERE p.location IS NOT NULL
        GROUP BY p.location
        ORDER BY total_jobs DESC
        LIMIT 20
    ),
    LocationIndustryCounts AS (
        SELECT
            p.location,
            i.industry_name,
            COUNT(*) AS posting_count
        FROM postings p
        JOIN job_industries ji ON p.job_id = ji.job_id
        JOIN industries i ON ji.industry_id = i.industry_id
        WHERE p.location IN (SELECT location FROM TopLocations)
        GROUP BY p.location, i.industry_name
    ),
    RankedIndustries AS (
        SELECT
            location,
            industry_name,
            posting_count,
            RANK() OVER (
                PARTITION BY location
                ORDER BY posting_count DESC
            ) AS industry_rank
        FROM LocationIndustryCounts
    )
    SELECT
        location,
        industry_name,
        posting_count,
        industry_rank
    FROM RankedIndustries
    WHERE industry_rank <= 3
    ORDER BY location, industry_rank
  `;

  connection.query(query, (err, data) => {
    if (err) {
      console.error(' Error in industry_analytics:', err);
      console.error('SQL Message:', err.sqlMessage);
      return res.status(500).json({ 
        error: 'Database error', 
        details: err.message 
      });
    }
    
    // PostgreSQL returns a Result object with a 'rows' property
    // MySQL returns the array directly
    let results;
    
    if (data && data.rows) {
      // PostgreSQL format
      results = data.rows;
      console.log(`Industry analytics query returned ${results.length} rows (PostgreSQL)`);
    } else if (Array.isArray(data)) {
      // MySQL format
      results = data;
      console.log(`Industry analytics query returned ${results.length} rows (MySQL)`);
    } else {
      console.log('Unexpected data format:', typeof data);
      results = [];
    }
    
    // Log first result for verification
    if (results.length > 0) {
      console.log(' First result:', JSON.stringify(results[0], null, 2));
      console.log(' Total locations:', [...new Set(results.map(d => d.location))].length);
      console.log(' Sample locations:', [...new Set(results.map(d => d.location))].slice(0, 5));
    } else {
      console.log(' No results returned');
    }
    
    res.json(results);
  });
}


//  Route 3: GET /company_salary_analytics - Get top 20 companies paying above industry average
async function company_salary_analytics(req, res) {
  console.log(' Company salary analytics endpoint called');
  
  const query = `
    WITH IndustryAvgSalary AS (
       SELECT
           ji.industry_id,
           AVG(s.med_salary) AS avg_industry_salary
       FROM
           salaries s
       JOIN
           postings p ON s.job_id = p.job_id
       JOIN
           job_industries ji ON p.job_id = ji.job_id
       WHERE
           s.med_salary IS NOT NULL
       GROUP BY
           ji.industry_id
    ),
    CompanyAvgSalary AS (
       SELECT
           p.company_id,
           AVG(s.med_salary) AS avg_company_salary
       FROM
           salaries s
       JOIN
           postings p ON s.job_id = p.job_id
       WHERE
           s.med_salary IS NOT NULL
       GROUP BY
           p.company_id
    )
    SELECT
       c.name,
       i.industry_name,
       cas.avg_company_salary,
       COALESCE(ias.avg_industry_salary, 0) AS avg_industry_salary,
       (cas.avg_company_salary - COALESCE(ias.avg_industry_salary, 0)) AS salary_above_industry_avg
    FROM
       CompanyAvgSalary cas
    LEFT JOIN
       companies c ON cas.company_id = c.company_id
    LEFT JOIN
       company_industries ci ON c.company_id = ci.company_id
    LEFT JOIN
       industries i ON LOWER(TRIM(ci.industry)) = LOWER(TRIM(i.industry_name))
    LEFT JOIN
       IndustryAvgSalary ias ON i.industry_id = ias.industry_id
    WHERE
       cas.avg_company_salary IS NOT NULL
    ORDER BY
       salary_above_industry_avg DESC
    LIMIT 20
  `;

  connection.query(query, (err, data) => {
    if (err) {
      console.error(' Error in company_salary_analytics:', err);
      console.error('SQL Message:', err.sqlMessage);
      return res.status(500).json({ 
        error: 'Database error', 
        details: err.message 
      });
    }
    
    let results;
    
    if (data && data.rows) {
      results = data.rows;
      console.log(` Company salary analytics query returned ${results.length} rows (PostgreSQL)`);
    } else if (Array.isArray(data)) {
      results = data;
      console.log(` Company salary analytics query returned ${results.length} rows (MySQL)`);
    } else {
      console.log(' Unexpected data format:', typeof data);
      results = [];
    }
    
    if (results.length > 0) {
      console.log(' First result:', JSON.stringify(results[0], null, 2));
    } else {
      console.log(' No results returned');
    }
    
    res.json(results);
  });
}

//  Route 4: GET /skill_similarity - Get Jaccard similarity between two companies
async function skill_similarity(req, res) {
  console.log(' Skill similarity endpoint called');
  
  const company1 = req.query.company1;
  const company2 = req.query.company2;

  if (!company1 || !company2) {
    return res.status(400).json({ 
      error: 'Missing parameters',
      details: 'Both company1 and company2 are required' 
    });
  }

  console.log(`Comparing: ${company1} vs ${company2}`);
  
  // PostgreSQL version of the query
  const query = `
    WITH
    CompanyOneSkills AS (
       SELECT DISTINCT js.skill_abr
       FROM job_skills js
       JOIN postings p ON js.job_id = p.job_id
       JOIN companies c ON p.company_id = c.company_id
       WHERE LOWER(TRIM(c.name)) = LOWER(TRIM($1))
    ),
    CompanyTwoSkills AS (
       SELECT DISTINCT js.skill_abr
       FROM job_skills js
       JOIN postings p ON js.job_id = p.job_id
       JOIN companies c ON p.company_id = c.company_id
       WHERE LOWER(TRIM(c.name)) = LOWER(TRIM($2))
    ),
    Intersection AS (
       SELECT skill_abr FROM CompanyOneSkills
       INTERSECT
       SELECT skill_abr FROM CompanyTwoSkills
    ),
    UnionSet AS (
       SELECT skill_abr FROM CompanyOneSkills
       UNION
       SELECT skill_abr FROM CompanyTwoSkills
    )
    SELECT
       (SELECT COUNT(*) FROM Intersection) AS intersection_count,
       (SELECT COUNT(*) FROM UnionSet) AS union_count,
       CASE 
           WHEN (SELECT COUNT(*) FROM UnionSet) = 0 THEN 0
           ELSE (SELECT COUNT(*) FROM Intersection)::numeric / 
                (SELECT COUNT(*) FROM UnionSet)::numeric
       END AS jaccard_similarity
  `;

  connection.query(query, [company1, company2], (err, data) => {
    if (err) {
      console.error(' Error in skill_similarity:', err);
      console.error('SQL Message:', err.sqlMessage);
      console.error('SQL State:', err.sqlState);
      console.error('Error Code:', err.code);
      return res.status(500).json({ 
        error: 'Database error', 
        details: err.message,
        sqlMessage: err.sqlMessage
      });
    }
    
    let results;
    
    if (data && data.rows && data.rows.length > 0) {
      results = data.rows[0];
      console.log(` Skill similarity query returned result (PostgreSQL)`);
    } else if (Array.isArray(data) && data.length > 0) {
      results = data[0];
      console.log(` Skill similarity query returned result (MySQL)`);
    } else {
      console.log(' No data returned, using defaults');
      results = { intersection_count: 0, union_count: 0, jaccard_similarity: 0 };
    }
    
    console.log(' Result:', JSON.stringify(results, null, 2));
    
    // Ensure numeric values
    results.intersection_count = parseInt(results.intersection_count) || 0;
    results.union_count = parseInt(results.union_count) || 0;
    results.jaccard_similarity = parseFloat(results.jaccard_similarity) || 0;
    
    // Add company names to the result
    results.company1 = company1;
    results.company2 = company2;
    
    res.json(results);
  });
}

//  Route 5: GET /skills_salary_analysis - Get top skills by salary uplift score
async function skills_salary_analysis(req, res) {
  console.log(' Skills salary analysis endpoint called');
  
  const query = `
    WITH SalaryBrackets AS (
        SELECT
            p.job_id,
            s.med_salary,
            PERCENT_RANK() OVER (ORDER BY s.med_salary ASC) AS salary_percentile
        FROM postings p
        JOIN salaries s ON p.job_id = s.job_id
        WHERE s.med_salary IS NOT NULL
    ),
    SkillSalary AS (
        SELECT
            sk.skill_name,
            sb.med_salary,
            sb.salary_percentile
        FROM SalaryBrackets sb
        JOIN job_skills js ON sb.job_id = js.job_id
        JOIN skills sk ON js.skill_abr = sk.skill_abr
    )
    SELECT
        skill_name,
        ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY med_salary)::numeric, 0) AS median_salary,
        ROUND(AVG(med_salary)::numeric, 0) AS avg_salary,
        ROUND(
            (COUNT(*) FILTER (WHERE salary_percentile <= 0.10)::numeric / COUNT(*)) * 100,
            1
        ) AS pct_low,
        ROUND(
            (COUNT(*) FILTER (WHERE salary_percentile >= 0.90)::numeric / COUNT(*)) * 100,
            1
        ) AS pct_high,
        ROUND(
            (
                COUNT(*) FILTER (WHERE salary_percentile >= 0.90)::numeric -
                COUNT(*) FILTER (WHERE salary_percentile <= 0.10)::numeric
            ) * 100.0 / COUNT(*),
            1
        ) AS uplift_score
    FROM SkillSalary
    GROUP BY skill_name
    HAVING COUNT(*) > 100
    ORDER BY uplift_score DESC
    LIMIT 15
  `;

  connection.query(query, (err, data) => {
    if (err) {
      console.error(' Error in skills_salary_analysis:', err);
      console.error('Error message:', err.message);
      console.error('Error code:', err.code);
      if (err.detail) console.error('Error detail:', err.detail);
      if (err.hint) console.error('Error hint:', err.hint);
      if (err.position) console.error('Error position:', err.position);
      return res.status(500).json({ 
        error: 'Database error', 
        details: err.message,
        code: err.code
      });
    }
    
    let results;
    
    if (data && data.rows) {
      results = data.rows;
      console.log(` Skills salary analysis query returned ${results.length} rows`);
    } else {
      console.log(' Unexpected data format:', typeof data);
      results = [];
    }
    
    if (results.length > 0) {
      console.log(' First result:', JSON.stringify(results[0], null, 2));
    } else {
      console.log(' No results returned');
    }
    
    res.json(results);
  });
}

//  Route 6: GET /high_pay_low_balance - Get companies with high pay but low work-life balance
async function high_pay_low_balance(req, res) {
  console.log(' High pay low balance endpoint called');
  
  const query = `
    WITH CompanyPay AS (
        SELECT
            c.name,
            c.company_id,
            AVG(s.med_salary) as avg_salary,
            NTILE(5) OVER (ORDER BY AVG(s.med_salary) ASC) as pay_quintile
        FROM companies c
        JOIN postings p ON c.company_id = p.company_id
        JOIN salaries s ON p.job_id = s.job_id
        WHERE s.med_salary IS NOT NULL
        GROUP BY c.name, c.company_id
    ),
    CompanyCulture AS (
        SELECT
            company,
            AVG(work_balance_stars) as avg_wlb,
            NTILE(5) OVER (ORDER BY AVG(work_balance_stars) ASC) as wlb_quintile
        FROM employee_reviews
        GROUP BY company
    )
    SELECT
        cp.name,
        ROUND(cp.avg_salary::numeric, 0) as avg_salary,
        ROUND(cc.avg_wlb::numeric, 2) as avg_wlb
    FROM CompanyPay cp
    JOIN CompanyCulture cc ON LOWER(TRIM(cp.name)) = LOWER(TRIM(cc.company))
    WHERE
        cp.pay_quintile = 5
        AND cc.wlb_quintile = 1
    ORDER BY
        cp.avg_salary DESC

  `;

  connection.query(query, (err, data) => {
    if (err) {
      console.error(' Error in high_pay_low_balance:', err);
      console.error('Error message:', err.message);
      console.error('Error code:', err.code);
      if (err.detail) console.error('Error detail:', err.detail);
      if (err.hint) console.error('Error hint:', err.hint);
      return res.status(500).json({ 
        error: 'Database error', 
        details: err.message,
        code: err.code
      });
    }
    
    let results;
    
    if (data && data.rows) {
      results = data.rows;
      console.log(` High pay low balance query returned ${results.length} rows`);
    } else {
      console.log(' Unexpected data format:', typeof data);
      results = [];
    }
    
    if (results.length > 0) {
      console.log(' First result:', JSON.stringify(results[0], null, 2));
    } else {
      console.log(' No results returned');
    }
    
    res.json(results);
  });
}

//  Route 7: GET /industry_job_counts - Get job count by industry from company_industries
async function industry_job_counts(req, res) {
  console.log(' Industry job counts endpoint called');
  
  const query = `
    SELECT
        ci.industry,
        COUNT(p.job_id) AS job_count
    FROM
        company_industries ci
    JOIN
        companies c ON ci.company_id = c.company_id
    JOIN
        postings p ON c.company_id = p.company_id
    GROUP BY
        ci.industry
    ORDER BY
        job_count DESC
  `;

  connection.query(query, (err, data) => {
    if (err) {
      console.error(' Error in industry_job_counts:', err);
      console.error('Error message:', err.message);
      console.error('Error code:', err.code);
      return res.status(500).json({ 
        error: 'Database error', 
        details: err.message,
        code: err.code
      });
    }
    
    let results;
    
    if (data && data.rows) {
      results = data.rows;
      console.log(` Industry job counts query returned ${results.length} rows`);
    } else {
      console.log(' Unexpected data format:', typeof data);
      results = [];
    }
    
    if (results.length > 0) {
      console.log(' First result:', JSON.stringify(results[0], null, 2));
      console.log(' Total industries:', results.length);
    } else {
      console.log(' No results returned');
    }
    
    res.json(results);
  });
}

//  Route 8: GET /search_company_postings - Search postings by company name
async function search_company_postings(req, res) {
  console.log(' Company postings search endpoint called');
  
  const companyName = req.query.company;

  if (!companyName) {
    return res.status(400).json({ 
      error: 'Missing parameter',
      details: 'company name is required' 
    });
  }

  console.log(`Searching for company: ${companyName}`);
  
  const query = `
    SELECT
      c.name,
      p.title,
      p.location,
      p.job_posting_url,
      p.original_listed_time,
      p.expiry
    FROM
      postings p
    JOIN
      companies c ON p.company_id = c.company_id
    WHERE
      LOWER(TRIM(c.name)) = LOWER(TRIM($1))
    ORDER BY
      p.original_listed_time DESC
      LIMIT 10
  `;

  connection.query(query, [companyName], (err, data) => {
    if (err) {
      console.error(' Error in search_company_postings:', err);
      console.error('SQL Message:', err.sqlMessage);
      return res.status(500).json({ 
        error: 'Database error', 
        details: err.message
      });
    }
    
    let results;
    
    if (data && data.rows) {
      results = data.rows;
      console.log(` Company postings search returned ${results.length} rows`);
    } else if (Array.isArray(data)) {
      results = data;
      console.log(` Company postings search returned ${results.length} rows`);
    } else {
      console.log(' Unexpected data format:', typeof data);
      results = [];
    }
    
    if (results.length > 0) {
      console.log(' First result:', JSON.stringify(results[0], null, 2));
    } else {
      console.log(' No results returned for company:', companyName);
    }
    
    res.json(results);
  });
}

//  Route 9: GET /top_rated_companies - Get top 10 companies with good ratings
async function top_rated_companies(req, res) {
  console.log(' Top rated companies endpoint called');
  
  const query = `
    SELECT
      c.name,
      COUNT(er.id) AS good_review_count
    FROM
      companies c
    JOIN
      employee_reviews er ON c.company_id = er.company_id
    WHERE
      er.overall_ratings >= 4
    GROUP BY
      c.name
    ORDER BY
      good_review_count DESC
    LIMIT 10
  `;

  connection.query(query, (err, data) => {
    if (err) {
      console.error(' Error in top_rated_companies:', err);
      console.error('Error message:', err.message);
      return res.status(500).json({ 
        error: 'Database error', 
        details: err.message
      });
    }
    
    let results;
    
    if (data && data.rows) {
      results = data.rows;
      console.log(` Top rated companies query returned ${results.length} rows`);
    } else if (Array.isArray(data)) {
      results = data;
      console.log(` Top rated companies query returned ${results.length} rows`);
    } else {
      console.log(' Unexpected data format:', typeof data);
      results = [];
    }
    
    if (results.length > 0) {
      console.log(' First result:', JSON.stringify(results[0], null, 2));
    } else {
      console.log(' No results returned');
    }
    
    res.json(results);
  });
}

//  Route 10: GET /company_ratings - Get average rating and review count for a specific company
async function company_ratings(req, res) {
  console.log(' Company ratings endpoint called');
  
  const companyName = req.query.company;

  if (!companyName) {
    return res.status(400).json({ 
      error: 'Missing parameter',
      details: 'company name is required' 
    });
  }

  console.log(`Getting ratings for company: ${companyName}`);
  
  const query = `
    SELECT
      c.name,
      AVG(er.overall_ratings) AS average_rating,
      COUNT(er.id) AS total_reviews
    FROM
      companies c
    JOIN
      employee_reviews er ON c.company_id = er.company_id
    WHERE
      LOWER(TRIM(c.name)) = LOWER(TRIM($1))
    GROUP BY
      c.name
  `;

  connection.query(query, [companyName], (err, data) => {
    if (err) {
      console.error(' Error in company_ratings:', err);
      console.error('SQL Message:', err.sqlMessage);
      return res.status(500).json({ 
        error: 'Database error', 
        details: err.message
      });
    }
    
    let results;
    
    if (data && data.rows) {
      results = data.rows;
      console.log(` Company ratings query returned ${results.length} rows`);
    } else if (Array.isArray(data)) {
      results = data;
      console.log(` Company ratings query returned ${results.length} rows`);
    } else {
      console.log(' Unexpected data format:', typeof data);
      results = [];
    }
    
    if (results.length > 0) {
      console.log(' Result:', JSON.stringify(results[0], null, 2));
    } else {
      console.log(' No results returned for company:', companyName);
    }
    
    res.json(results.length > 0 ? results[0] : null);
  });
}

//  Route 11: GET /company_benefits - Get benefit types offered by a company
async function company_benefits(req, res) {
  console.log(' Company benefits endpoint called');
  
  const companyName = req.query.company;

  if (!companyName) {
    return res.status(400).json({ 
      error: 'Missing parameter',
      details: 'company name is required' 
    });
  }

  console.log(`Getting benefits for company: ${companyName}`);
  
  const query = `
    SELECT
      b.type AS benefit_type,
      COUNT(*) AS postings_offering
    FROM
      benefits b
    JOIN
      postings p ON b.job_id = p.job_id
    JOIN
      companies c ON p.company_id = c.company_id
    WHERE
      LOWER(TRIM(c.name)) = LOWER(TRIM($1))
    GROUP BY
      b.type
    ORDER BY
      postings_offering DESC
  `;

  connection.query(query, [companyName], (err, data) => {
    if (err) {
      console.error(' Error in company_benefits:', err);
      console.error('SQL Message:', err.sqlMessage);
      return res.status(500).json({ 
        error: 'Database error', 
        details: err.message
      });
    }
    
    let results;
    
    if (data && data.rows) {
      results = data.rows;
      console.log(` Company benefits query returned ${results.length} rows`);
    } else if (Array.isArray(data)) {
      results = data;
      console.log(` Company benefits query returned ${results.length} rows`);
    } else {
      console.log(' Unexpected data format:', typeof data);
      results = [];
    }
    
    if (results.length > 0) {
      console.log(' First result:', JSON.stringify(results[0], null, 2));
    } else {
      console.log(' No results returned for company:', companyName);
    }
    
    res.json(results);
  });
}

module.exports = {
  search_jobs,
  industry_analytics,
  company_salary_analytics,
  skill_similarity,
  skills_salary_analysis,
  high_pay_low_balance,
  industry_job_counts,
  search_company_postings,
    top_rated_companies,
    company_ratings,
    company_benefits
}