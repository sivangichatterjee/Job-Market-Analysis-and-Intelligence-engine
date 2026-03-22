import { useEffect, useState } from 'react';
import { Container, CircularProgress, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const config = require('../config.json');

export default function HighPayLowBalance() {
  const navigate = useNavigate();
  const [companiesData, setCompaniesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCompaniesData();
  }, []);

  const fetchCompaniesData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching from:', `http://${config.server_host}:${config.server_port}/high_pay_low_balance`);
      
      const response = await fetch(
        `http://${config.server_host}:${config.server_port}/high_pay_low_balance`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('High pay low balance data:', data);
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received from server');
      }
      
      setCompaniesData(data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatSalary = (salary) => {
    if (!salary) return 'N/A';
    return `$${Math.round(salary).toLocaleString()}`;
  };

  const formatRating = (rating) => {
    if (!rating) return 'N/A';
    return parseFloat(rating).toFixed(2);
  };

  const getWLBColor = (rating) => {
    if (rating >= 4.0) return '#22c55e';
    if (rating >= 3.5) return '#84cc16';
    if (rating >= 3.0) return '#eab308';
    if (rating >= 2.5) return '#f59e0b';
    return '#ef4444';
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
            Loading company analysis...
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
            <p style={{ color: '#856404', marginBottom: '8px' }}>{error}</p>
            <p style={{ color: '#856404', fontSize: '14px', marginBottom: '20px' }}>
              Make sure your backend server is running at {config.server_host}:{config.server_port}
            </p>
            <Button 
              variant="contained" 
              onClick={fetchCompaniesData}
              style={{ marginTop: '20px' }}
            >
              Try Again
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  if (companiesData.length === 0) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <Container style={{ paddingTop: '48px' }}>
          <div style={{
            backgroundColor: '#e3f2fd',
            border: '1px solid #90caf9',
            borderRadius: '12px',
            padding: '32px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
            <h2 style={{ color: '#0d47a1', marginBottom: '12px' }}>No Data Available</h2>
            <p style={{ color: '#0d47a1' }}>
              No companies found matching the criteria (top 20% pay, bottom 20% work-life balance).
            </p>
          </div>
        </Container>
      </div>
    );
  }

  const maxSalary = Math.max(...companiesData.map(c => c.avg_salary));

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
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-1px'
          }}>
            High Pay, Low Work-Life Balance
          </h1>
          <p style={{ 
            fontSize: '18px', 
            color: '#666',
            maxWidth: '900px',
            lineHeight: '1.6'
          }}>
            Companies in the top 20% for salary but bottom 20% for work-life balance. 
            These organizations offer premium compensation but may demand significant time commitment.
          </p>
        </div>

       

        {/* Companies List */}
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
            💰 {companiesData.length} Companies with High Pay & Low Balance
          </h2>

          <div style={{ display: 'grid', gap: '20px' }}>
            {companiesData.map((company, index) => {
              const wlbColor = getWLBColor(company.avg_wlb);
              const salaryBarWidth = (company.avg_salary / maxSalary) * 100;

              return (
                <div 
                  key={index}
                  style={{
                    backgroundColor: '#f8f9fa',
                    borderRadius: '12px',
                    border: '1px solid #e8e8e8',
                    padding: '24px',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Company Header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '20px',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        backgroundColor: '#1976d2',
                        color: '#fff',
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        fontWeight: '800',
                        flexShrink: 0
                      }}>
                        {index + 1}
                      </div>

                      <h3 style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: '#1a1a1a',
                        margin: 0
                      }}>
                        {company.name}
                      </h3>
                    </div>

                    <div style={{
                      backgroundColor: wlbColor,
                      color: '#fff',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      ⚖️ WLB: {formatRating(company.avg_wlb)} / 5.0
                    </div>
                  </div>

                  {/* Salary Bar */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px'
                    }}>
                      <span style={{ fontSize: '14px', color: '#666', fontWeight: '600' }}>
                        Average Salary
                      </span>
                      <span style={{ fontSize: '20px', color: '#1976d2', fontWeight: '800' }}>
                        {formatSalary(company.avg_salary)}
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '24px',
                      backgroundColor: '#e8e8e8',
                      borderRadius: '12px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${salaryBarWidth}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #1976d2 0%, #1565c0 100%)',
                        borderRadius: '12px',
                        transition: 'width 0.6s ease-out'
                      }}></div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '12px',
                    backgroundColor: '#fff',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid #e8e8e8'
                  }}>
                    <div>
                      <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>
                        💵 Salary Range
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a' }}>
                        Top 20%
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>
                        ⚖️ Work-Life Balance
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: '700', color: wlbColor }}>
                        Bottom 20%
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>
                        ⭐ WLB Rating
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: '700', color: wlbColor }}>
                        {formatRating(company.avg_wlb)} / 5.0
                      </div>
                    </div>
                  </div>

                 
                  </div>
            
              );
            })}
          </div>
        </div>

        {/* Info Box */}
        <div style={{
          marginTop: '32px',
          padding: '24px',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e8e8e8'
        }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '700', 
            marginBottom: '16px',
            color: '#1a1a1a'
          }}>
            📊 Understanding This Analysis
          </h3>
          <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.8' }}>
            <p style={{ margin: '0 0 12px 0' }}>
              <strong>Methodology:</strong> Companies are ranked into quintiles (5 groups) based on average salary and work-life balance ratings.
            </p>
            <p style={{ margin: '0 0 12px 0' }}>
              <strong>Pay Quintile 5:</strong> Top 20% highest-paying companies based on median salaries from job postings.
            </p>
            <p style={{ margin: '0 0 12px 0' }}>
              <strong>WLB Quintile 1:</strong> Bottom 20% for work-life balance based on employee reviews.
            </p>
            <p style={{ margin: 0 }}>
              <strong>Data Sources:</strong> Salary data from job postings; work-life balance ratings from employee reviews.
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div style={{
          marginTop: '32px',
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
            💡 <strong>Career Tip:</strong> High compensation doesn't always mean better quality of life. 
            Consider your personal values, career goals, and lifestyle preferences when evaluating opportunities. 
            Some professionals thrive in high-intensity environments, while others prioritize balance.
          </p>
        </div>
      </Container>
    </div>
  );
}