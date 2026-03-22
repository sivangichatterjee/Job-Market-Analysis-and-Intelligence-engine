import { useEffect, useState } from 'react';
import { Container, Button, CircularProgress } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const config = require('../config.json');

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Date formatting function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Clear search and scroll to top when navigating to homepage
  useEffect(() => {
    setHasSearched(false);
    setSearchTerm('');
    setSearchResults([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  // Fetch featured jobs on component mount
  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/featured_jobs`)
      .then(res => res.json())
      .then(resJson => {
        console.log('Featured jobs:', resJson);
        setFeaturedJobs(resJson);
      })
      .catch(err => {
        console.error('Error fetching featured jobs:', err);
        // Set sample data as fallback
        setFeaturedJobs([
          {
            id: 1,
            title: 'Senior Software Engineer',
            company: 'TechCorp Inc.',
            location: 'San Francisco, CA',
            type: 'Full-time',
            salary: '$120k - $180k',
          },
          {
            id: 2,
            title: 'Product Manager',
            company: 'InnovateLabs',
            location: 'New York, NY',
            type: 'Full-time',
            salary: '$130k - $160k',
          },
          {
            id: 3,
            title: 'UX Designer',
            company: 'DesignHub',
            location: 'Remote',
            type: 'Contract',
            salary: '$90k - $120k',
          },
          {
            id: 4,
            title: 'Data Scientist',
            company: 'DataDrive Analytics',
            location: 'Boston, MA',
            type: 'Full-time',
            salary: '$110k - $150k',
          }
        ]);
      });
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      alert('Please enter a job title to search');
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    
    try {
      const params = new URLSearchParams();
      params.append('searchTerm', searchTerm);

      const response = await fetch(
        `http://${config.server_host}:${config.server_port}/search_jobs?${params}`
      );
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const results = await response.json();
      console.log('Search results:', results);
      setSearchResults(results);
    } catch (err) {
      console.error('Error searching jobs:', err);
      alert('Error searching jobs. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleApply = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Container style={{ paddingTop: '48px', marginBottom: '60px', maxWidth: '1400px' }}>
        {/* Hero Header */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '64px',
          padding: '40px 20px'
        }}>
          <h1 style={{ 
            fontSize: '56px', 
            marginBottom: '20px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #8B9DC3 0%, #DDA5B5 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-1px'
          }}>
            Find Your Dream Career
          </h1>
          <p style={{ 
            fontSize: '22px', 
            color: '#666',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Discover thousands of opportunities from top companies. Your next career move starts here.
          </p>
        </div>

        {/* Enhanced Search Section */}
        <div style={{ 
          backgroundColor: '#ffffff', 
          padding: '48px', 
          borderRadius: '16px',
          marginBottom: '64px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid #e8e8e8'
        }}>
          <h2 style={{ 
            marginBottom: '24px',
            fontSize: '28px',
            fontWeight: '700',
            color: '#1a1a1a'
          }}>
            Search Jobs by Title
          </h2>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Enter job title (e.g., Software Engineer, Designer...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              style={{
                flex: 1,
                minWidth: '300px',
                padding: '16px 20px',
                fontSize: '16px',
                border: '2px solid #e8e8e8',
                borderRadius: '10px',
                outline: 'none',
                transition: 'border-color 0.2s',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => e.target.style.borderColor = '#BAE1FF'}
              onBlur={(e) => e.target.style.borderColor = '#e8e8e8'}
            />
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              onClick={handleSearch}
              disabled={isSearching}
              style={{ 
                padding: '14px 40px',
                fontSize: '16px',
                fontWeight: '600',
                borderRadius: '10px',
                textTransform: 'none',
                backgroundColor: '#BAE1FF',
                color: '#1a1a1a',
                boxShadow: '0 4px 12px rgba(186, 225, 255, 0.3)'
              }}
            >
              {isSearching ? <CircularProgress size={24} style={{ color: '#1a1a1a' }} /> : '🔍 Search Jobs'}
            </Button>
            {hasSearched && (
              <Button 
                variant="outlined" 
                onClick={() => {
                  setHasSearched(false);
                  setSearchTerm('');
                  setSearchResults([]);
                }}
                style={{ 
                  padding: '14px 32px',
                  fontSize: '16px',
                  fontWeight: '600',
                  borderRadius: '10px',
                  textTransform: 'none',
                  borderWidth: '2px',
                  borderColor: '#FFDFBA',
                  color: '#FF9A76',
                  backgroundColor: '#FFF5E1'
                }}
              >
                Clear Search
              </Button>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginBottom: '64px'
        }}>
          {[
            { value: '1,250+', label: 'Active Jobs', icon: '💼' },
            { value: '500+', label: 'Companies', icon: '🏢' },
            { value: '10k+', label: 'Success Stories', icon: '⭐' },
            { value: '150+', label: 'New This Week', icon: '🔥' }
          ].map((stat, index) => (
            <div key={index} style={{ 
              backgroundColor: '#ffffff', 
              padding: '32px', 
              borderRadius: '16px',
              textAlign: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              border: '1px solid #e8e8e8',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)';
            }}
            >
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>{stat.icon}</div>
              <h3 style={{ 
                fontSize: '36px', 
                color: '#9c27b0', 
                marginBottom: '8px',
                fontWeight: '800'
              }}>
                {stat.value}
              </h3>
              <p style={{ color: '#666', fontSize: '15px', fontWeight: '500' }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Search Results Table */}
        {hasSearched && (
          <div style={{ marginBottom: '64px' }}>
            <h2 style={{ 
              marginBottom: '28px',
              fontSize: '32px',
              fontWeight: '700',
              color: '#1a1a1a'
            }}>
              Search Results ({searchResults.length} {searchResults.length === 1 ? 'job' : 'jobs'} found)
            </h2>
            
            {searchResults.length === 0 ? (
              <div style={{
                backgroundColor: '#ffffff',
                padding: '60px',
                borderRadius: '16px',
                textAlign: 'center',
                border: '2px dashed #e0e0e0'
              }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
                <p style={{ color: '#666', fontSize: '18px', marginBottom: '8px' }}>
                  No jobs found matching "{searchTerm}"
                </p>
                <p style={{ color: '#999', fontSize: '15px' }}>
                  Try adjusting your search term or browse our featured jobs below
                </p>
              </div>
            ) : (
              <div style={{ 
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid #e8e8e8'
              }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse'
                }}>
                  <thead>
                    <tr style={{ 
                      background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)',
                      color: 'white'
                    }}>
                      <th style={{ 
                        padding: '20px 24px', 
                        textAlign: 'left', 
                        fontWeight: '600',
                        fontSize: '15px',
                        letterSpacing: '0.5px'
                      }}>
                        💼 JOB TITLE
                      </th>
                      <th style={{ 
                        padding: '20px 24px', 
                        textAlign: 'left', 
                        fontWeight: '600',
                        fontSize: '15px',
                        letterSpacing: '0.5px'
                      }}>
                        🏢 COMPANY
                      </th>
                      <th style={{ 
                        padding: '20px 24px', 
                        textAlign: 'left', 
                        fontWeight: '600',
                        fontSize: '15px',
                        letterSpacing: '0.5px'
                      }}>
                        📍 LOCATION
                      </th>
                      <th style={{ 
                        padding: '20px 24px', 
                        textAlign: 'left', 
                        fontWeight: '600',
                        fontSize: '15px',
                        letterSpacing: '0.5px'
                      }}>
                        🏠 WORK TYPE
                      </th>
                      <th style={{ 
                        padding: '20px 24px', 
                        textAlign: 'left', 
                        fontWeight: '600',
                        fontSize: '15px',
                        letterSpacing: '0.5px'
                      }}>
                        📅 POSTED ON
                      </th>
                      <th style={{ 
                        padding: '20px 24px', 
                        textAlign: 'left', 
                        fontWeight: '600',
                        fontSize: '15px',
                        letterSpacing: '0.5px'
                      }}>
                        🔗 LINK TO POSTING
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.map((job, index) => (
                      <tr 
                        key={job.id || index}
                        style={{
                          borderBottom: index === searchResults.length - 1 ? 'none' : '1px solid #f0f0f0',
                          backgroundColor: '#ffffff',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                      >
                        <td style={{ 
                          padding: '20px 24px', 
                          fontWeight: '600',
                          fontSize: '15px',
                          color: '#1a1a1a'
                        }}>
                          {job.title}
                        </td>
                        <td style={{ 
                          padding: '20px 24px', 
                          color: '#9c27b0', 
                          fontSize: '15px', 
                          fontWeight: '600'
                        }}>
                          {job.company_name}
                        </td>
                        <td style={{ 
                          padding: '20px 24px', 
                          color: '#666',
                          fontSize: '15px'
                        }}>
                          {job.location}
                        </td>
                        <td style={{ 
                          padding: '20px 24px', 
                          color: '#666', 
                          fontSize: '15px'
                        }}>
                          {job.formatted_work_type || 'N/A'}
                        </td>
                        <td style={{ 
                          padding: '20px 24px', 
                          color: '#666', 
                          fontSize: '15px'
                        }}>
                          {formatDate(job.original_listed_time)}
                        </td>
                        <td style={{ 
                          padding: '20px 24px', 
                          color: '#666', 
                          fontSize: '15px'
                        }}>
                          {job.job_posting_url ? (
                            <a 
                              href={job.job_posting_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              style={{
                                color: '#9c27b0',
                                textDecoration: 'none',
                                fontWeight: '600',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                              onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
                              onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
                            >
                              View
                            </a>
                          ) : (
                            <span style={{ color: '#999' }}>N/A</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Featured Jobs */}
        {!hasSearched && (
          <div>
            <h2 style={{ 
              marginBottom: '32px',
              fontSize: '32px',
              fontWeight: '700',
              color: '#1a1a1a'
            }}>
              ⭐ Featured Opportunities
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '24px'
            }}>
              {featuredJobs.map((job) => (
                <div 
                  key={job.id}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e8e8e8',
                    borderRadius: '16px',
                    padding: '28px',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
                  }}
                >
                  <h3 style={{ 
                    marginBottom: '8px',
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#1a1a1a'
                  }}>
                    {job.title}
                  </h3>
                  <p style={{ 
                    color: '#9c27b0', 
                    marginBottom: '20px',
                    fontSize: '15px',
                    fontWeight: '600'
                  }}>
                    {job.company}
                  </p>
                  
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '8px',
                      color: '#666',
                      fontSize: '14px'
                    }}>
                      <span>📍</span>
                      <span>{job.location}</span>
                    </div>
                    <div style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '8px',
                      color: '#666',
                      fontSize: '14px'
                    }}>
                      <span>💼</span>
                      <span>{job.type}</span>
                    </div>
                    <div style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#666',
                      fontSize: '14px'
                    }}>
                      <span>💰</span>
                      <span style={{ fontWeight: '600', color: '#1a1a1a' }}>{job.salary}</span>
                    </div>
                  </div>

                  <Button 
                    variant="contained" 
                    fullWidth
                    onClick={() => handleApply(job.id)}
                    style={{
                      borderRadius: '10px',
                      padding: '12px',
                      textTransform: 'none',
                      fontWeight: '600',
                      fontSize: '15px',
                      boxShadow: 'none',
                      backgroundColor: '#A3E6B8',
                      color: '#1a1a1a'
                    }}
                  >
                    Apply Now →
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Footer */}
        <div style={{ 
          marginTop: '96px', 
          paddingTop: '48px', 
          borderTop: '2px solid #e8e8e8',
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '32px'
          }}>
            <div>
              <p style={{ 
                color: '#666', 
                margin: '0 0 8px 0',
                fontSize: '15px',
                fontWeight: '500'
              }}>
                © 2025 CareerConnect. Built to connect talent with opportunity.
              </p>
              <p style={{ color: '#999', margin: '0', fontSize: '13px' }}>
                Empowering careers, one connection at a time.
              </p>
            </div>
            
            {/* Social Media */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <span style={{ 
                color: '#666', 
                marginRight: '8px',
                fontWeight: '600',
                fontSize: '15px'
              }}>
                Connect with us:
              </span>
              <a 
                href="https://www.linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  width: '44px',
                  height: '44px',
                  backgroundColor: '#0077b5',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 119, 181, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                in
              </a>
              <a 
                href="mailto:info@careerconnect.com"
                style={{ 
                  width: '44px',
                  height: '44px',
                  backgroundColor: '#EA4335',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '20px',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(234, 67, 53, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                ✉
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  width: '44px',
                  height: '44px',
                  backgroundColor: '#1877F2',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '22px',
                  fontWeight: 'bold',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(24, 119, 242, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                f
              </a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}