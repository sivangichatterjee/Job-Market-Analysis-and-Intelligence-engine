import { useEffect, useState } from 'react';
import { Container, CircularProgress, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const config = require('../config.json');

export default function CompanySalaryAnalytics() {
  const navigate = useNavigate();
  const [analyticsData, setAnalyticsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `http://${config.server_host}:${config.server_port}/company_salary_analytics`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch salary analytics data');
      }
      
      const data = await response.json();
      console.log('Salary analytics data:', data);
      setAnalyticsData(data);
    } catch (err) {
      console.error('Error fetching salary analytics:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatSalary = (salary) => {
    if (!salary) return 'N/A';
    return `$${Math.round(salary).toLocaleString()}`;
  };

  const getPositionStyle = (index) => {
    if (index === 0) return { bg: '#FFD700', icon: '🥇', color: '#000' };
    if (index === 1) return { bg: '#C0C0C0', icon: '🥈', color: '#000' };
    if (index === 2) return { bg: '#CD7F32', icon: '🥉', color: '#fff' };
    return { bg: '#e8e8e8', icon: `#${index + 1}`, color: '#666' };
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{ textAlign: 'center' }}>
          <CircularProgress size={60} />
          <p style={{ marginTop: '20px', color: '#666', fontSize: '18px' }}>
            Loading salary analytics...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <Container style={{ paddingTop: '48px' }}>
          <div style={{
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '12px',
            padding: '32px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <h2 style={{ color: '#856404', marginBottom: '12px' }}>Error Loading Data</h2>
            <p style={{ color: '#856404' }}>{error}</p>
            <Button 
              variant="contained" 
              onClick={fetchAnalyticsData}
              style={{ marginTop: '20px' }}
            >
              Try Again
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Container style={{ paddingTop: '48px', paddingBottom: '80px', maxWidth: '1400px' }}>
        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
           <Button
        onClick={() => navigate('/songs')}
        sx={{ mb: 3 }}
        variant="outlined"
      >
        ← Back to Advanced Analytics
      </Button>
          
          <h1 style={{ 
            fontSize: '48px', 
            marginBottom: '16px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-1px'
          }}>
            Top Companies Paying Above Industry Average
          </h1>
        </div>

        {/* Company Rankings */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid #e8e8e8'
        }}>
          <h2 style={{ 
            fontSize: '28px',
            fontWeight: '700',
            color: '#1a1a1a',
            marginBottom: '28px',
            paddingBottom: '20px',
            borderBottom: '2px solid #f0f0f0'
          }}>
            🏆 Top 20 Companies by Salary Premium
          </h2>

          <div style={{ display: 'grid', gap: '16px' }}>
            {analyticsData.map((company, index) => {
              const positionStyle = getPositionStyle(index);
              const premiumPercentage = company.avg_industry_salary > 0 
                ? ((company.salary_above_industry_avg / company.avg_industry_salary) * 100).toFixed(1)
                : 0;

              return (
                <div 
                  key={index}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr auto',
                    alignItems: 'center',
                    gap: '20px',
                    padding: '24px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '12px',
                    border: '1px solid #e8e8e8',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateX(4px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Rank Badge */}
                  <div style={{
                    backgroundColor: positionStyle.bg,
                    color: positionStyle.color,
                    width: '56px',
                    height: '56px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: index < 3 ? '28px' : '20px',
                    fontWeight: '800',
                    flexShrink: 0
                  }}>
                    {positionStyle.icon}
                  </div>

                  {/* Company Info */}
                  <div>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#1a1a1a',
                      marginBottom: '8px'
                    }}>
                      {company.name || 'Unknown Company'}
                    </h3>
                    <div style={{ 
                      display: 'flex', 
                      gap: '16px', 
                      flexWrap: 'wrap',
                      fontSize: '14px',
                      color: '#666'
                    }}>
                      <span>
                        🏭 <strong>{company.industry_name || 'N/A'}</strong>
                      </span>
                      <span>
                        💵 Avg Salary: <strong style={{ color: '#1976d2' }}>{formatSalary(company.avg_company_salary)}</strong>
                      </span>
                      <span>
                        📊 Industry Avg: <strong>{formatSalary(company.avg_industry_salary)}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Salary Premium */}
                  <div style={{
                    textAlign: 'right',
                    paddingLeft: '24px',
                    borderLeft: '2px solid #e0e0e0'
                  }}>
                    <div style={{
                      fontSize: '28px',
                      fontWeight: '800',
                      color: '#22c55e',
                      marginBottom: '4px'
                    }}>
                      +{formatSalary(company.salary_above_industry_avg)}
                    </div>
                    <div style={{
                      fontSize: '16px',
                      color: '#22c55e',
                      fontWeight: '600',
                      marginBottom: '4px'
                    }}>
                      +{premiumPercentage}%
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#666',
                      fontWeight: '500'
                    }}>
                      Above Industry
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Note */}
        <div style={{
          marginTop: '64px',
          padding: '24px',
          backgroundColor: '#e3f2fd',
          borderRadius: '12px',
          border: '1px solid #90caf9'
        }}>
          <p style={{ 
            color: '#0d47a1',
            fontSize: '14px',
            margin: 0,
            textAlign: 'center',
            lineHeight: '1.6'
          }}>
            💡 <strong>Insight:</strong> These companies pay significantly more than the average salary in their respective industries. 
            A higher salary premium indicates companies that highly value and compensate their talent, making them attractive employers for job seekers.
          </p>
        </div>
      </Container>
    </div>
  );
}