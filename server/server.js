const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js
app.get('/search_jobs', routes.search_jobs);
app.get('/industry_analytics', routes.industry_analytics);
app.get('/company_salary_analytics', routes.company_salary_analytics);
app.get('/skill_similarity', routes.skill_similarity);
app.get('/skills_salary_analysis', routes.skills_salary_analysis);
app.get('/high_pay_low_balance', routes.high_pay_low_balance);
app.get('/industry_job_counts', routes.industry_job_counts);
app.get('/search_company_postings', routes.search_company_postings); 
app.get('/top_rated_companies', routes.top_rated_companies);
app.get('/company_ratings', routes.company_ratings);
app.get('/company_benefits', routes.company_benefits);

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
