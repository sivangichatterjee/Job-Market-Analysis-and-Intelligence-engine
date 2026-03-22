import { useEffect, useState } from 'react';
import { Container, CircularProgress, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const config = require('../config.json');

export default function SkillsSalaryAnalysis() {
  const navigate = useNavigate();
  const [skillsData, setSkillsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSkillsData();
  }, []);

  const fetchSkillsData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching from:', `http://${config.server_host}:${config.server_port}/skills_salary_analysis`);
      
      const response = await fetch(
        `http://${config.server_host}:${config.server_port}/skills_salary_analysis`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch skills salary data: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Skills salary data:', data);
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received from server');
      }
      
      setSkillsData(data);
    } catch (err) {
      console.error('Error fetching skills salary:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatSalary = (salary) => {
    if (!salary) return 'N/A';
    return `$${Math.round(salary).toLocaleString()}`;
  };

  const getUpliftColor = (score) => {
    if (score >= 50) return '#22c55e';
    if (score >= 30) return '#84cc16';
    if (score >= 10) return '#eab308';
    if (score >= 0) return '#f59e0b';
    return '#ef4444';
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
            Loading skills salary analysis...
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
              onClick={fetchSkillsData}
              style={{ marginTop: '20px' }}
            >
              Try Again
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  if (skillsData.length === 0) {
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
              No skills salary data was found in the database.
            </p>
          </div>
        </Container>
      </div>
    );
  }

  const maxUplift = Math.max(...skillsData.map(s => s.uplift_score));

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
            Top Skills by Salary Uplift
          </h1>
          <p style={{ 
            fontSize: '18px', 
            color: '#666',
            maxWidth: '900px',
            lineHeight: '1.6'
          }}>
            Discover which skills are most strongly associated with high-paying roles. 
            The uplift score shows how much more often a skill appears in top-paying positions versus low-paying ones.
          </p>
        </div>

        {/* Skills Rankings with Bar Chart */}
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
            📈 Top {skillsData.length} Skills by Salary Uplift Score
          </h2>

          <div style={{ display: 'grid', gap: '20px' }}>
            {skillsData.map((skill, index) => {
              const positionStyle = getPositionStyle(index);
              const upliftColor = getUpliftColor(skill.uplift_score);
              const barWidth = (skill.uplift_score / maxUplift) * 100;

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
                  {/* Top Row: Rank + Skill Name + Uplift Score */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    marginBottom: '16px'
                  }}>
                    {/* Rank Badge */}
                    <div style={{
                      backgroundColor: positionStyle.bg,
                      color: positionStyle.color,
                      width: '48px',
                      height: '48px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: index < 3 ? '24px' : '18px',
                      fontWeight: '800',
                      flexShrink: 0
                    }}>
                      {positionStyle.icon}
                    </div>

                    {/* Skill Name */}
                    <h3 style={{
                      fontSize: '22px',
                      fontWeight: '700',
                      color: '#1a1a1a',
                      margin: 0,
                      flex: 1
                    }}>
                      {skill.skill_name}
                    </h3>

                    {/* Uplift Score Badge */}
                    <div style={{
                      backgroundColor: upliftColor,
                      color: '#fff',
                      padding: '8px 20px',
                      borderRadius: '20px',
                      fontSize: '20px',
                      fontWeight: '800',
                      minWidth: '80px',
                      textAlign: 'center'
                    }}>
                      +{skill.uplift_score}
                    </div>
                  </div>

                  {/* Visual Bar Chart */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{
                      width: '100%',
                      height: '32px',
                      backgroundColor: '#e8e8e8',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      position: 'relative'
                    }}>
                      <div style={{
                        width: `${barWidth}%`,
                        height: '100%',
                        background: `linear-gradient(90deg, ${upliftColor} 0%, ${upliftColor}dd 100%)`,
                        borderRadius: '16px',
                        transition: 'width 0.6s ease-out',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        paddingRight: '12px'
                      }}>
                        <span style={{
                          color: '#fff',
                          fontWeight: '700',
                          fontSize: '14px',
                          textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                        }}>
                          {skill.uplift_score}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: '16px',
                    fontSize: '14px',
                    color: '#666'
                  }}>
                    <div style={{
                      backgroundColor: '#fff',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #e8e8e8'
                    }}>
                      <div style={{ fontSize: '11px', marginBottom: '4px', color: '#999' }}>
                        💵 Median Salary
                      </div>
                      <div style={{ fontWeight: '700', color: '#1976d2', fontSize: '16px' }}>
                        {formatSalary(skill.median_salary)}
                      </div>
                    </div>
                    <div style={{
                      backgroundColor: '#fff',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #e8e8e8'
                    }}>
                      <div style={{ fontSize: '11px', marginBottom: '4px', color: '#999' }}>
                        📊 Average Salary
                      </div>
                      <div style={{ fontWeight: '700', color: '#1a1a1a', fontSize: '16px' }}>
                        {formatSalary(skill.avg_salary)}
                      </div>
                    </div>
                    <div style={{
                      backgroundColor: '#fff',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #e8e8e8'
                    }}>
                      <div style={{ fontSize: '11px', marginBottom: '4px', color: '#999' }}>
                        📉 Low 10% Jobs
                      </div>
                      <div style={{ fontWeight: '700', color: '#ef4444', fontSize: '16px' }}>
                        {skill.pct_low}%
                      </div>
                    </div>
                    <div style={{
                      backgroundColor: '#fff',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #e8e8e8'
                    }}>
                      <div style={{ fontSize: '11px', marginBottom: '4px', color: '#999' }}>
                        📈 Top 10% Jobs
                      </div>
                      <div style={{ fontWeight: '700', color: '#22c55e', fontSize: '16px' }}>
                        {skill.pct_high}%
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
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
            📊 Understanding the Uplift Score
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '20px', backgroundColor: '#22c55e', borderRadius: '4px' }}></div>
              <span style={{ fontSize: '14px', color: '#666' }}>≥50: Very High Impact</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '20px', backgroundColor: '#84cc16', borderRadius: '4px' }}></div>
              <span style={{ fontSize: '14px', color: '#666' }}>30-49: High Impact</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '20px', backgroundColor: '#eab308', borderRadius: '4px' }}></div>
              <span style={{ fontSize: '14px', color: '#666' }}>10-29: Medium Impact</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '20px', backgroundColor: '#f59e0b', borderRadius: '4px' }}></div>
              <span style={{ fontSize: '14px', color: '#666' }}>0-9: Low Impact</span>
            </div>
          </div>
          <p style={{ 
            color: '#666',
            fontSize: '14px',
            margin: 0,
            lineHeight: '1.6'
          }}>
            The uplift score represents the difference between how often a skill appears in high-paying roles (top 10%) 
            versus low-paying roles (bottom 10%). A higher score indicates stronger association with premium salaries.
          </p>
        </div>

       
    

      </Container>
    </div>
  );
}