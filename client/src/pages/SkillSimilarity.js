import { useEffect, useState } from 'react';
import { Container, CircularProgress, Button } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';

const config = require('../config.json');

export default function SkillSimilarity() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [similarityData, setSimilarityData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const company1 = searchParams.get('company1');
  const company2 = searchParams.get('company2');

  useEffect(() => {
    if (company1 && company2) {
      fetchSimilarityData();
    } else {
      setError('Missing company parameters');
      setIsLoading(false);
    }
  }, [company1, company2]);

  const fetchSimilarityData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const url = `http://${config.server_host}:${config.server_port}/skill_similarity?company1=${encodeURIComponent(company1)}&company2=${encodeURIComponent(company2)}`;
      console.log('Fetching from URL:', url);
      
      const response = await fetch(url);
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch similarity data: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Similarity data received:', data);
      setSimilarityData(data);
    } catch (err) {
      console.error('Error fetching similarity:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getSimilarityColor = (similarity) => {
    if (similarity >= 0.7) return '#22c55e';
    if (similarity >= 0.4) return '#f59e0b';
    return '#ef4444';
  };

  const getSimilarityLabel = (similarity) => {
    if (similarity >= 0.7) return 'High Similarity';
    if (similarity >= 0.4) return 'Medium Similarity';
    return 'Low Similarity';
  };

  const getPercentage = (similarity) => {
    return (similarity * 100).toFixed(1);
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
            Calculating skill similarity...
          </p>
          <p style={{ color: '#999', fontSize: '14px' }}>
            Comparing {company1} and {company2}
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
            <p style={{ color: '#856404', fontSize: '14px', marginTop: '16px' }}>
              Company 1: {company1}<br/>
              Company 2: {company2}
            </p>
            <div style={{ marginTop: '20px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Button 
                variant="contained" 
                onClick={fetchSimilarityData}
              >
                Try Again
              </Button>
               <Button
        onClick={() => navigate('/songs')}
        sx={{ mb: 3 }}
        variant="outlined"
      >
        ← Back to Advanced Analytics
      </Button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (!similarityData) {
    return null;
  }

  const similarity = parseFloat(similarityData.jaccard_similarity) || 0;
  const similarityColor = getSimilarityColor(similarity);
  const similarityLabel = getSimilarityLabel(similarity);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Container style={{ paddingTop: '48px', paddingBottom: '80px', maxWidth: '1200px' }}>
        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <Button 
            onClick={() => navigate('/songs')}
            style={{
              marginBottom: '24px',
              color: '#1976d2',
              textTransform: 'none',
              fontSize: '16px',
              fontWeight: '600'
            }}
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
            Skills Similarity Analysis
          </h1>
        </div>

        {/* Companies Comparison Header */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid #e8e8e8',
          marginBottom: '32px',
          textAlign: 'center'
        }}>
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
            flexWrap: 'wrap',
            marginBottom: '24px'
          }}>
            <div style={{
              padding: '16px 32px',
              backgroundColor: '#e3f2fd',
              borderRadius: '12px',
              border: '2px solid #1976d2'
            }}>
              <h3 style={{ 
                fontSize: '24px',
                fontWeight: '700',
                color: '#1976d2',
                margin: 0
              }}>
                {company1}
              </h3>
            </div>

            <div style={{ fontSize: '32px' }}>
              🔗
            </div>

            <div style={{
              padding: '16px 32px',
              backgroundColor: '#e3f2fd',
              borderRadius: '12px',
              border: '2px solid #1976d2'
            }}>
              <h3 style={{ 
                fontSize: '24px',
                fontWeight: '700',
                color: '#1976d2',
                margin: 0
              }}>
                {company2}
              </h3>
            </div>
          </div>
        </div>

        {/* Similarity Score */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '48px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid #e8e8e8',
          marginBottom: '32px',
          textAlign: 'center'
        }}>
          <h2 style={{ 
            fontSize: '24px',
            fontWeight: '700',
            color: '#1a1a1a',
            marginBottom: '32px'
          }}>
            Jaccard Similarity Score
          </h2>

          <div style={{
            display: 'inline-block',
            position: 'relative',
            width: '200px',
            height: '200px',
            marginBottom: '24px'
          }}>
            <svg width="200" height="200" style={{ transform: 'rotate(-90deg)' }}>
              {/* Background circle */}
              <circle
                cx="100"
                cy="100"
                r="80"
                stroke="#e8e8e8"
                strokeWidth="20"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="100"
                cy="100"
                r="80"
                stroke={similarityColor}
                strokeWidth="20"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 80 * similarity} ${2 * Math.PI * 80}`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 1s ease' }}
              />
            </svg>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '48px',
              fontWeight: '800',
              color: similarityColor
            }}>
              {getPercentage(similarity)}%
            </div>
          </div>

          <div style={{
            display: 'inline-block',
            padding: '12px 32px',
            backgroundColor: `${similarityColor}20`,
            borderRadius: '24px',
            border: `2px solid ${similarityColor}`
          }}>
            <span style={{
              fontSize: '20px',
              fontWeight: '700',
              color: similarityColor
            }}>
              {similarityLabel}
            </span>
          </div>
        </div>

        {/* Detailed Statistics */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid #e8e8e8',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🤝</div>
            <h3 style={{ 
              fontSize: '36px',
              fontWeight: '800',
              color: '#1976d2',
              marginBottom: '8px'
            }}>
              {similarityData.intersection_count}
            </h3>
            <p style={{ color: '#666', fontSize: '15px', fontWeight: '500' }}>
              Shared Skills
            </p>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid #e8e8e8',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📊</div>
            <h3 style={{ 
              fontSize: '36px',
              fontWeight: '800',
              color: '#1976d2',
              marginBottom: '8px'
            }}>
              {similarityData.union_count}
            </h3>
            <p style={{ color: '#666', fontSize: '15px', fontWeight: '500' }}>
              Total Unique Skills
            </p>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid #e8e8e8',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎯</div>
            <h3 style={{ 
              fontSize: '36px',
              fontWeight: '800',
              color: '#1976d2',
              marginBottom: '8px'
            }}>
              {similarity.toFixed(3)}
            </h3>
            <p style={{ color: '#666', fontSize: '15px', fontWeight: '500' }}>
              Jaccard Index
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div style={{
          backgroundColor: '#e3f2fd',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #90caf9'
        }}>
          <p style={{ 
            color: '#0d47a1',
            fontSize: '14px',
            margin: 0,
            textAlign: 'center',
            lineHeight: '1.6'
          }}>
            💡 <strong>About Jaccard Similarity:</strong> This metric measures the similarity between two sets by dividing the number of shared elements 
            by the total number of unique elements. A score of 1.0 means identical skill requirements, while 0.0 means no overlap.
          </p>
        </div>
      </Container>
    </div>
  );
}