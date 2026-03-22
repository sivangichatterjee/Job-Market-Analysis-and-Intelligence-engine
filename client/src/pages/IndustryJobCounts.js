import { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  CircularProgress, 
  Box,
  Paper,
  Alert,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';

const config = require('../config.json');

export default function IndustryJobCounts() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/industry_job_counts`)
      .then(res => res.json())
      .then(resJson => {
        console.log('Received data:', resJson);
        setData(resJson);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching data:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Color palette for bars
  const COLORS = [
    '#1976d2', '#2196f3', '#42a5f5', '#64b5f6', '#90caf9',
    '#e3f2fd', '#303f9f', '#3f51b5', '#5c6bc0', '#7986cb',
    '#9fa8da', '#c5cae9', '#4527a0', '#512da8', '#5e35b1'
  ];

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Alert severity="error">Error loading data: {error}</Alert>
      </Container>
    );
  }

  // Take top 20 industries for better visualization
  const topData = data.slice(0, 20);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Button
        onClick={() => navigate('/albums')}
        sx={{ mb: 3 }}
        variant="outlined"
      >
        ← Back to Analytics
      </Button>

      <Typography variant="h3" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Industry Job Distribution
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Total number of job postings by industry (Top 20)
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Job Count by Industry
        </Typography>
        
        <ResponsiveContainer width="100%" height={600}>
          <BarChart
            data={topData}
            margin={{ top: 20, right: 30, left: 20, bottom: 150 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="industry" 
              angle={-45} 
              textAnchor="end"
              height={150}
              interval={0}
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              label={{ value: 'Number of Jobs', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
              formatter={(value) => [value.toLocaleString(), 'Jobs']}
            />
            <Legend />
            <Bar 
              dataKey="job_count" 
              name="Job Count"
              radius={[8, 8, 0, 0]}
            >
              {topData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Statistics
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Total Industries
            </Typography>
            <Typography variant="h5">
              {data.length}
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="body2" color="text.secondary">
              Total Jobs
            </Typography>
            <Typography variant="h5">
              {data.reduce((sum, item) => sum + parseInt(item.job_count), 0).toLocaleString()}
            </Typography>
          </Box>
          
          {data.length > 0 && (
            <>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Top Industry
                </Typography>
                <Typography variant="h6">
                  {data[0].industry}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {parseInt(data[0].job_count).toLocaleString()} jobs
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Average Jobs per Industry
                </Typography>
                <Typography variant="h5">
                  {Math.round(data.reduce((sum, item) => sum + parseInt(item.job_count), 0) / data.length).toLocaleString()}
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </Paper>
    </Container>
  );
}