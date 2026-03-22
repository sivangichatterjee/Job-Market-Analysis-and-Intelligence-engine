import { useEffect, useState } from 'react';
import { Container, CircularProgress, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const config = require('../config.json');

export default function IndustryAnalytics() {
  const navigate = useNavigate();
  const [analyticsData, setAnalyticsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState('all');

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `http://${config.server_host}:${config.server_port}/industry_analytics`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }
      
      const data = await response.json();
      console.log('Analytics data:', data);
      setAnalyticsData(data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Group data by location
  const groupedData = analyticsData.reduce((acc, item) => {
    if (!acc[item.location]) {
      acc[item.location] = [];
    }
    acc[item.location].push(item);
    return acc;
  }, {});

  // Get unique locations for filter
  const locations = ['all', ...Object.keys(groupedData).sort()];

  // Filter data based on selected location
  const filteredLocations = selectedLocation === 'all' 
    ? Object.keys(groupedData).sort()
    : [selectedLocation];

  // Get rank badge styling
  const getRankBadge = (rank) => {
    const styles = {
      1: { bg: '#FFD700', color: '#000', icon: '🥇' },
      2: { bg: '#C0C0C0', color: '#000', icon: '🥈' },
      3: { bg: '#CD7F32', color: '#fff', icon: '🥉' }
    };
    return styles[rank] || styles[3];
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
            Loading industry analytics...
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
            📊 Industry Analytics by Location
          </h1>
          <p style={{ 
            fontSize: '18px', 
            color: '#666',
            maxWidth: '800px',
            lineHeight: '1.6'
          }}>
            Explore the top 3 industries with the most job postings in each location. 
            Discover hiring trends and opportunities across different markets.
          </p>
        </div>

        {/* Summary Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div style={{ 
            backgroundColor: '#ffffff', 
            padding: '24px', 
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            border: '1px solid #e8e8e8'
          }}>
            <h3 style={{ 
              fontSize: '32px', 
              color: '#1976d2', 
              marginBottom: '8px',
              fontWeight: '800'
            }}>
              {Object.keys(groupedData).length}
            </h3>
            <p style={{ color: '#666', fontSize: '14px', fontWeight: '500' }}>
              Locations Analyzed
            </p>
          </div>
          
          <div style={{ 
            backgroundColor: '#ffffff', 
            padding: '24px', 
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            border: '1px solid #e8e8e8'
          }}>
            <h3 style={{ 
              fontSize: '32px', 
              color: '#1976d2', 
              marginBottom: '8px',
              fontWeight: '800'
            }}>
              {analyticsData.length}
            </h3>
            <p style={{ color: '#666', fontSize: '14px', fontWeight: '500' }}>
              Industry Rankings
            </p>
          </div>
          
          <div style={{ 
            backgroundColor: '#ffffff', 
            padding: '24px', 
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            border: '1px solid #e8e8e8'
          }}>
            <h3 style={{ 
              fontSize: '32px', 
              color: '#1976d2', 
              marginBottom: '8px',
              fontWeight: '800'
            }}>
              {analyticsData.reduce((sum, item) => sum + item.posting_count, 0).toLocaleString()}
            </h3>
            <p style={{ color: '#666', fontSize: '14px', fontWeight: '500' }}>
              Total Job Postings
            </p>
          </div>
        </div>

        {/* Location Filter */}
        <div style={{ 
          backgroundColor: '#ffffff', 
          padding: '24px', 
          borderRadius: '12px',
          marginBottom: '32px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          border: '1px solid #e8e8e8'
        }}>
          <label style={{ 
            display: 'block',
            marginBottom: '12px',
            fontWeight: '600',
            fontSize: '16px',
            color: '#1a1a1a'
          }}>
            Filter by Location:
          </label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            style={{
              padding: '12px 16px',
              fontSize: '15px',
              border: '2px solid #e8e8e8',
              borderRadius: '8px',
              outline: 'none',
              cursor: 'pointer',
              minWidth: '300px',
              backgroundColor: '#ffffff',
              fontFamily: 'inherit'
            }}
          >
            {locations.map(loc => (
              <option key={loc} value={loc}>
                {loc === 'all' ? '🌍 All Locations' : `📍 ${loc}`}
              </option>
            ))}
          </select>
        </div>

        {/* Analytics Cards */}
        <div style={{ 
          display: 'grid', 
          gap: '32px'
        }}>
          {filteredLocations.map(location => (
            <div 
              key={location}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '32px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid #e8e8e8'
              }}
            >
              {/* Location Header */}
              <div style={{ 
                marginBottom: '28px',
                paddingBottom: '20px',
                borderBottom: '2px solid #f0f0f0'
              }}>
                <h2 style={{ 
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#1a1a1a',
                  marginBottom: '8px'
                }}>
                  📍 {location}
                </h2>
                <p style={{ 
                  color: '#666',
                  fontSize: '15px'
                }}>
                  Top {groupedData[location].length} industries by job postings
                </p>
              </div>

              {/* Industry Rankings */}
              <div style={{ 
                display: 'grid',
                gap: '16px'
              }}>
                {groupedData[location].map((item, index) => {
                  const rankStyle = getRankBadge(item.industry_rank);
                  
                  return (
                    <div 
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '20px 24px',
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
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        flex: 1
                      }}>
                        <div style={{
                          backgroundColor: rankStyle.bg,
                          color: rankStyle.color,
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '24px',
                          fontWeight: '800',
                          flexShrink: 0
                        }}>
                          {rankStyle.icon}
                        </div>

                        {/* Industry Name */}
                        <div style={{ flex: 1 }}>
                          <h3 style={{
                            fontSize: '18px',
                            fontWeight: '700',
                            color: '#1a1a1a',
                            marginBottom: '4px'
                          }}>
                            {item.industry_name}
                          </h3>
                          <p style={{
                            fontSize: '14px',
                            color: '#666',
                            margin: 0
                          }}>
                            Rank #{item.industry_rank} in {location}
                          </p>
                        </div>
                      </div>

                      {/* Posting Count */}
                      <div style={{
                        textAlign: 'right',
                        paddingLeft: '24px'
                      }}>
                        <div style={{
                          fontSize: '28px',
                          fontWeight: '800',
                          color: '#1976d2',
                          marginBottom: '4px'
                        }}>
                          {item.posting_count.toLocaleString()}
                        </div>
                        <div style={{
                          fontSize: '13px',
                          color: '#666',
                          fontWeight: '500'
                        }}>
                          Job Postings
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
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
    💡 <strong>Insight:</strong> This analysis focuses on the top 20 locations with the highest job posting counts, 
    showing the top 3 industries in each location to help you identify the most active hiring markets and industry trends.
  </p>
</div>
      </Container>
    </div>
  );
}
