import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Paper, 
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Link,
  Grid,
  Divider,
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const config = require('../config.json');

export default function Analytics() {
  const navigate = useNavigate();
  
  // Company postings search state
  const [postingsCompanyName, setPostingsCompanyName] = useState('');
  const [postings, setPostings] = useState([]);
  const [postingsLoading, setPostingsLoading] = useState(false);
  const [postingsSearched, setPostingsSearched] = useState(false);
  const [postingsError, setPostingsError] = useState(null);
  
  // Company ratings search state
  const [ratingsCompanyName, setRatingsCompanyName] = useState('');
  const [companyRatings, setCompanyRatings] = useState(null);
  const [ratingsLoading, setRatingsLoading] = useState(false);
  const [ratingsSearched, setRatingsSearched] = useState(false);
  const [ratingsError, setRatingsError] = useState(null);
  
  // Company benefits search state
  const [benefitsCompanyName, setBenefitsCompanyName] = useState('');
  const [benefits, setBenefits] = useState([]);
  const [benefitsLoading, setBenefitsLoading] = useState(false);
  const [benefitsSearched, setBenefitsSearched] = useState(false);
  const [benefitsError, setBenefitsError] = useState(null);
  
  // Top rated companies state
  const [topRatedCompanies, setTopRatedCompanies] = useState([]);
  const [topRatedLoading, setTopRatedLoading] = useState(true);
  const [topRatedError, setTopRatedError] = useState(null);

  // Fetch top rated companies on component mount
  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/top_rated_companies`)
      .then(res => res.json())
      .then(data => {
        console.log('Top rated companies:', data);
        setTopRatedCompanies(data);
        setTopRatedLoading(false);
      })
      .catch(err => {
        console.error('Error fetching top rated companies:', err);
        setTopRatedError(err.message);
        setTopRatedLoading(false);
      });
  }, []);

  // Handle company postings search
  const handlePostingsSearch = () => {
    if (!postingsCompanyName.trim()) {
      return;
    }

    setPostingsLoading(true);
    setPostingsError(null);
    setPostingsSearched(false);

    fetch(`http://${config.server_host}:${config.server_port}/search_company_postings?company=${encodeURIComponent(postingsCompanyName)}`)
      .then(res => res.json())
      .then(data => {
        console.log('Company postings:', data);
        setPostings(data);
        setPostingsSearched(true);
        setPostingsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching company postings:', err);
        setPostingsError(err.message);
        setPostingsLoading(false);
        setPostingsSearched(true);
      });
  };

  // Handle company ratings search
  const handleRatingsSearch = () => {
    if (!ratingsCompanyName.trim()) {
      return;
    }

    setRatingsLoading(true);
    setRatingsError(null);
    setRatingsSearched(false);

    fetch(`http://${config.server_host}:${config.server_port}/company_ratings?company=${encodeURIComponent(ratingsCompanyName)}`)
      .then(res => res.json())
      .then(data => {
        console.log('Company ratings:', data);
        setCompanyRatings(data);
        setRatingsSearched(true);
        setRatingsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching company ratings:', err);
        setRatingsError(err.message);
        setRatingsLoading(false);
        setRatingsSearched(true);
      });
  };

  // Handle company benefits search
  const handleBenefitsSearch = () => {
    if (!benefitsCompanyName.trim()) {
      return;
    }

    setBenefitsLoading(true);
    setBenefitsError(null);
    setBenefitsSearched(false);

    fetch(`http://${config.server_host}:${config.server_port}/company_benefits?company=${encodeURIComponent(benefitsCompanyName)}`)
      .then(res => res.json())
      .then(data => {
        console.log('Company benefits:', data);
        setBenefits(data);
        setBenefitsSearched(true);
        setBenefitsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching company benefits:', err);
        setBenefitsError(err.message);
        setBenefitsLoading(false);
        setBenefitsSearched(true);
      });
  };

  const handlePostingsKeyPress = (e) => {
    if (e.key === 'Enter') {
      handlePostingsSearch();
    }
  };

  const handleRatingsKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleRatingsSearch();
    }
  };

  const handleBenefitsKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleBenefitsSearch();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
     
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Search for company information or explore analytics
      </Typography>

      {/* Company Postings Search Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
          Search Company Job Postings
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Find all open job positions for any company
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            fullWidth
            label="Company Name"
            variant="outlined"
            value={postingsCompanyName}
            onChange={(e) => setPostingsCompanyName(e.target.value)}
            onKeyPress={handlePostingsKeyPress}
            placeholder="Type company name (e.g., Capgemini, Google, Amazon)"
            helperText="Press Enter or click Search"
          />
          <Button
            variant="contained"
            onClick={handlePostingsSearch}
            disabled={postingsLoading || !postingsCompanyName.trim()}
            sx={{ minWidth: 120, height: 56 }}
          >
            {postingsLoading ? <CircularProgress size={24} /> : 'Search'}
          </Button>
        </Box>

        {postingsError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Error: {postingsError}
          </Alert>
        )}

        {postingsSearched && !postingsLoading && postings.length === 0 && (
          <Alert severity="info">
            Sorry, no open postings for this company.
          </Alert>
        )}

        {postings.length > 0 && (
          <>
            <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 2 }}>
              Job Postings ({postings.length})
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Company</strong></TableCell>
                    <TableCell><strong>Job Title</strong></TableCell>
                    <TableCell><strong>Location</strong></TableCell>
                    <TableCell><strong>Posted Date</strong></TableCell>
                    <TableCell><strong>Expiry</strong></TableCell>
                    <TableCell><strong>Link</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {postings.map((posting, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{posting.name}</TableCell>
                      <TableCell>{posting.title}</TableCell>
                      <TableCell>{posting.location || 'N/A'}</TableCell>
                      <TableCell>{formatDate(posting.original_listed_time)}</TableCell>
                      <TableCell>{formatDate(posting.expiry)}</TableCell>
                      <TableCell>
                        {posting.job_posting_url ? (
                          <Link href={posting.job_posting_url} target="_blank" rel="noopener">
                            View Job
                          </Link>
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Paper>

      {/* Company Ratings Search Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
          Search Company Ratings & Reviews
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          View average employee ratings and total review count for any company
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            fullWidth
            label="Company Name"
            variant="outlined"
            value={ratingsCompanyName}
            onChange={(e) => setRatingsCompanyName(e.target.value)}
            onKeyPress={handleRatingsKeyPress}
            placeholder="Type company name (e.g., New York Post, Parkland Health)"
            helperText="Press Enter or click Search"
          />
          <Button
            variant="contained"
            onClick={handleRatingsSearch}
            disabled={ratingsLoading || !ratingsCompanyName.trim()}
            sx={{ minWidth: 120, height: 56 }}
          >
            {ratingsLoading ? <CircularProgress size={24} /> : 'Search'}
          </Button>
        </Box>

        {ratingsError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Error: {ratingsError}
          </Alert>
        )}

        {ratingsSearched && !ratingsLoading && !companyRatings && (
          <Alert severity="info">
            No employee reviews found for this company.
          </Alert>
        )}

        {ratingsSearched && !ratingsLoading && companyRatings && (
          <Paper elevation={2} sx={{ p: 3, backgroundColor: '#f5f5f5' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#0288d1' }}>
              Company Ratings
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Company Name
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {companyRatings.name}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Average Rating
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 600, color: '#ffa726' }}>
                      {parseFloat(companyRatings.average_rating).toFixed(2)}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      / 5.0
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#ffa726' }}>
                    {'⭐'.repeat(Math.round(parseFloat(companyRatings.average_rating)))}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Reviews
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {parseInt(companyRatings.total_reviews).toLocaleString()}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        )}
      </Paper>

      {/* Company Benefits Search Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
          Search Company Benefits
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Discover what benefits a company offers across their job postings
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            fullWidth
            label="Company Name"
            variant="outlined"
            value={benefitsCompanyName}
            onChange={(e) => setBenefitsCompanyName(e.target.value)}
            onKeyPress={handleBenefitsKeyPress}
            placeholder="Type company name (e.g., Google, Microsoft, Amazon)"
            helperText="Press Enter or click Search"
          />
          <Button
            variant="contained"
            onClick={handleBenefitsSearch}
            disabled={benefitsLoading || !benefitsCompanyName.trim()}
            sx={{ minWidth: 120, height: 56 }}
          >
            {benefitsLoading ? <CircularProgress size={24} /> : 'Search'}
          </Button>
        </Box>

        {benefitsError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Error: {benefitsError}
          </Alert>
        )}

        {benefitsSearched && !benefitsLoading && benefits.length === 0 && (
          <Alert severity="info">
            No benefits data found for this company.
          </Alert>
        )}

        {benefits.length > 0 && (
          <>
            <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 2 }}>
              Benefits Offered ({benefits.length} types)
            </Typography>
            <Grid container spacing={2}>
              {benefits.map((benefit, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4
                      }
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, textAlign: 'center', color: '#0288d1' }}>
                      {benefit.benefit_type}
                    </Typography>
                    <Chip
                      label={`${parseInt(benefit.postings_offering)} postings`}
                      color="primary"
                      size="small"
                    />
                  </Paper>
                </Grid>
              ))}
            </Grid>
            
            {/* Summary Stats */}
            <Paper elevation={1} sx={{ p: 2, mt: 3, backgroundColor: '#f5f5f5' }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Total benefit types:</strong> {benefits.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Total postings offering benefits:</strong> {benefits.reduce((sum, b) => sum + parseInt(b.postings_offering), 0).toLocaleString()}
              </Typography>
            </Paper>
          </>
        )}
      </Paper>

      {/* Industry Job Counts Button */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transition: 'all 0.3s',
          cursor: 'pointer',
          mb: 4,
          '&:hover': {
            elevation: 8,
            transform: 'translateY(-4px)',
            boxShadow: 6
          }
        }}
        onClick={() => navigate('/industry-job-counts')}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mb: 3,
            width: 80,
            height: 80,
            backgroundColor: '#0288d1',
            borderRadius: 2,
            color: 'white',
            fontSize: 32,
            fontWeight: 'bold'
          }}
        >
          📊
        </Box>
        
        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 600 }}>
          Industry Job Counts
        </Typography>
        
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
          Total job postings distribution by industry
        </Typography>
        
        <Button
          variant="contained"
          size="large"
          sx={{
            backgroundColor: '#0288d1',
            px: 4,
            py: 1.5,
            '&:hover': {
              backgroundColor: '#0288d1',
              filter: 'brightness(0.9)'
            }
          }}
        >
          View Analysis
        </Button>
      </Paper>

      {/* Top Rated Companies Section */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
          Top 10 Companies with Good Ratings (4+ Stars)
        </Typography>

        {topRatedLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        )}

        {topRatedError && (
          <Alert severity="error">
            Error loading top rated companies: {topRatedError}
          </Alert>
        )}

        {!topRatedLoading && !topRatedError && topRatedCompanies.length > 0 && (
          <Grid container spacing={2}>
            {topRatedCompanies.map((company, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    backgroundColor: index < 3 ? '#f0f7ff' : 'white',
                    border: index < 3 ? '2px solid #0288d1' : 'none',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 3
                    }
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#0288d1' }}>
                    #{index + 1}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, my: 1 }}>
                    {company.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {parseInt(company.good_review_count).toLocaleString()} good reviews
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" sx={{ color: '#ffa726' }}>
                      ⭐⭐⭐⭐+
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}

        {!topRatedLoading && !topRatedError && topRatedCompanies.length === 0 && (
          <Alert severity="info">
            No top rated companies found.
          </Alert>
        )}
      </Paper>
    </Container>
  );
}