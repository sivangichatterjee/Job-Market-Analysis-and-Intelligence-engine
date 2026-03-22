import { useEffect, useState } from 'react';
import { Button, Container, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const config = require('../config.json');

export default function SongsPage() {
  const navigate = useNavigate();
  const [company1, setCompany1] = useState('');
  const [company2, setCompany2] = useState('');

  const companies = [
    'ey',
    'kpmg us',
    'philips',
    'verizon',
    'sap',
    'bank of america',
    'pfizer',
    'wells fargo',
    'barclays',
    'deutsche bank',
    'adobe',
    'american express',
    'infosys',
    'linkedin',
    'xerox',
    'boeing',
    'capital one',
    'google',
    'amazon',
    'boston scientific',
    'cognizant',
    'qualcomm',
    'western union',
    'bloomberg',
    'walmart',
    'publicis',
    'salesforce',
    'walgreens',
    'nvidia',
    'lenovo',
    'ibm',
    'oracle',
    'microsoft',
    'deloitte',
    'nokia',
    'siemens',
    'pwc',
    'ericsson',
    'cisco',
    'jpmorgan chase & co.'
  ];

  const handleSkillComparison = () => {
    if (!company1 || !company2) {
      alert('Please select both companies to compare');
      return;
    }

    if (company1 === company2) {
      alert('Please select two different companies');
      return;
    }

    navigate(`/skill-similarity?company1=${encodeURIComponent(company1)}&company2=${encodeURIComponent(company2)}`);
  };

  return (
    <Container style={{ paddingTop: '48px', paddingBottom: '60px', maxWidth: '1400px' }}>
      <div style={{ 
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        alignItems: 'center'
      }}>
        <Button 
          variant="contained"
          color="primary"
          onClick={() => navigate('/analytics')}
          style={{
            padding: '16px 40px',
            fontSize: '18px',
            fontWeight: '600',
            borderRadius: '12px',
            textTransform: 'none',
            boxShadow: '0 4px 16px rgba(25, 118, 210, 0.4)',
            minWidth: '500px'
          }}
        >
          📊 View Industry Analytics by Location
        </Button>

        <Button 
          variant="contained"
          color="secondary"
          onClick={() => navigate('/salary-analytics')}
          style={{
            padding: '16px 40px',
            fontSize: '18px',
            fontWeight: '600',
            borderRadius: '12px',
            textTransform: 'none',
            boxShadow: '0 4px 16px rgba(255, 193, 7, 0.4)',
            minWidth: '500px'
          }}
        >
          💰 Top Companies by Salary Premium
        </Button>

        {/* Company Skills Similarity Section */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid #e8e8e8',
          minWidth: '500px',
          marginTop: '20px'
        }}>
          <h3 style={{ 
            fontSize: '20px',
            fontWeight: '700',
            color: '#1a1a1a',
            marginBottom: '24px'
          }}>
            🔗 Company Skills Similarity Comparison
          </h3>

          <div style={{ 
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div>
              <label style={{ 
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
                fontSize: '14px',
                color: '#1a1a1a',
                textAlign: 'left'
              }}>
                Company 1:
              </label>
              <select
                value={company1}
                onChange={(e) => setCompany1(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  fontSize: '14px',
                  border: '2px solid #e8e8e8',
                  borderRadius: '8px',
                  outline: 'none',
                  cursor: 'pointer',
                  backgroundColor: '#ffffff',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#9c27b0'}
                onBlur={(e) => e.target.style.borderColor = '#e8e8e8'}
              >
                <option value="">-- Select Company 1 --</option>
                {companies.map((company, index) => (
                  <option key={index} value={company}>
                    {company.charAt(0).toUpperCase() + company.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ 
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
                fontSize: '14px',
                color: '#1a1a1a',
                textAlign: 'left'
              }}>
                Company 2:
              </label>
              <select
                value={company2}
                onChange={(e) => setCompany2(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  fontSize: '14px',
                  border: '2px solid #e8e8e8',
                  borderRadius: '8px',
                  outline: 'none',
                  cursor: 'pointer',
                  backgroundColor: '#ffffff',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#9c27b0'}
                onBlur={(e) => e.target.style.borderColor = '#e8e8e8'}
              >
                <option value="">-- Select Company 2 --</option>
                {companies.map((company, index) => (
                  <option key={index} value={company}>
                    {company.charAt(0).toUpperCase() + company.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Button 
            variant="contained"
            onClick={handleSkillComparison}
            disabled={!company1 || !company2}
            style={{
              padding: '14px 40px',
              fontSize: '16px',
              fontWeight: '600',
              borderRadius: '10px',
              textTransform: 'none',
              boxShadow: '0 4px 16px rgba(156, 39, 176, 0.4)',
              width: '100%',
              backgroundColor: '#9c27b0',
              color: '#ffffff'
            }}
            onMouseOver={(e) => {
              if (company1 && company2) {
                e.currentTarget.style.backgroundColor = '#7b1fa2';
              }
            }}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#9c27b0'}
          >
            Compare Skills
          </Button>
        </div>

        {/* Skills Salary Analysis Button */}
        <Button 
          variant="contained"
          onClick={() => navigate('/skills-salary')}
          style={{
            padding: '16px 40px',
            fontSize: '18px',
            fontWeight: '600',
            borderRadius: '12px',
            textTransform: 'none',
            boxShadow: '0 4px 16px rgba(76, 175, 80, 0.4)',
            minWidth: '500px',
            backgroundColor: '#4caf50',
            color: '#ffffff',
            marginTop: '0'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4caf50'}
        >
          📈 Skills Salary Analysis & Uplift Score
        </Button>

        {/* NEW: High Pay Low Balance Button */}
        <Button 
          variant="contained"
          onClick={() => navigate('/high-pay-low-balance')}
          style={{
            padding: '16px 40px',
            fontSize: '18px',
            fontWeight: '600',
            borderRadius: '12px',
            textTransform: 'none',
            boxShadow: '0 4px 16px rgba(239, 68, 68, 0.4)',
            minWidth: '500px',
            backgroundColor: '#ef4444',
            color: '#ffffff',
            marginTop: '0'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
        >
          ⚠️ High Pay, Low Work-Life Balance
        </Button>
      </div>
    </Container>
  );
}