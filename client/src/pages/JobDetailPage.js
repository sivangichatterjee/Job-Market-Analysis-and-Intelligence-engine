import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button } from '@mui/material';

const config = require('../config.json');

export default function JobDetailPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch job details from API
    fetch(`http://${config.server_host}:${config.server_port}/jobs/${jobId}`)
      .then(res => res.json())
      .then(resJson => {
        setJob(resJson);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching job details:', err);
        // Fallback data if API fails
        const sampleJobs = {
          1: {
            id: 1,
            title: 'Senior Software Engineer',
            company: 'TechCorp Inc.',
            location: 'San Francisco, CA',
            type: 'Full-time',
            salary: '$120k - $180k',
            description: 'We are seeking an experienced Senior Software Engineer to join our dynamic team. You will be responsible for designing, developing, and maintaining high-quality software solutions.',
            responsibilities: [
              'Design and develop scalable software applications',
              'Collaborate with cross-functional teams to define and ship new features',
              'Write clean, maintainable code following best practices',
              'Mentor junior developers and conduct code reviews',
              'Participate in architectural decisions and technical planning'
            ],
            requirements: [
              '5+ years of experience in software development',
              'Strong proficiency in JavaScript, Python, or Java',
              'Experience with modern frameworks (React, Node.js, Django)',
              'Knowledge of database design and SQL',
              'Excellent problem-solving and communication skills',
              'Bachelor\'s degree in Computer Science or related field'
            ],
            benefits: [
              'Competitive salary and equity package',
              'Comprehensive health, dental, and vision insurance',
              '401(k) matching',
              'Flexible work schedule and remote options',
              'Professional development budget',
              'Unlimited PTO'
            ],
            postedDate: '2024-11-09',
            applicationDeadline: '2024-12-31'
          },
          2: {
            id: 2,
            title: 'Product Manager',
            company: 'InnovateLabs',
            location: 'New York, NY',
            type: 'Full-time',
            salary: '$130k - $160k',
            description: 'Join our product team to drive the vision and strategy for our flagship products. You\'ll work closely with engineering, design, and business teams to deliver exceptional user experiences.',
            responsibilities: [
              'Define product vision and roadmap',
              'Gather and prioritize product requirements',
              'Work with engineering teams to deliver products on schedule',
              'Analyze market trends and competitor products',
              'Communicate product plans to stakeholders'
            ],
            requirements: [
              '3+ years of product management experience',
              'Strong analytical and problem-solving skills',
              'Experience with agile development methodologies',
              'Excellent communication and presentation skills',
              'Technical background preferred',
              'MBA or equivalent experience'
            ],
            benefits: [
              'Competitive compensation package',
              'Health and wellness benefits',
              '401(k) with company match',
              'Hybrid work environment',
              'Career growth opportunities',
              'Annual bonus potential'
            ],
            postedDate: '2024-11-10',
            applicationDeadline: '2024-12-15'
          },
          3: {
            id: 3,
            title: 'UX Designer',
            company: 'DesignHub',
            location: 'Remote',
            type: 'Contract',
            salary: '$90k - $120k',
            description: 'We\'re looking for a talented UX Designer to create intuitive and beautiful user experiences. You\'ll be responsible for the entire design process from research to final implementation.',
            responsibilities: [
              'Conduct user research and usability testing',
              'Create wireframes, prototypes, and high-fidelity designs',
              'Collaborate with product and engineering teams',
              'Develop and maintain design systems',
              'Present design concepts to stakeholders'
            ],
            requirements: [
              '3+ years of UX design experience',
              'Proficiency in Figma, Sketch, or Adobe XD',
              'Strong portfolio demonstrating UX process',
              'Understanding of front-end development principles',
              'Excellent visual design skills',
              'Strong communication and collaboration abilities'
            ],
            benefits: [
              'Competitive contract rate',
              'Fully remote position',
              'Flexible working hours',
              'Access to design tools and resources',
              'Collaborative team environment',
              'Potential for full-time conversion'
            ],
            postedDate: '2024-11-08',
            applicationDeadline: '2024-12-20'
          },
          4: {
            id: 4,
            title: 'Data Scientist',
            company: 'DataDrive Analytics',
            location: 'Boston, MA',
            type: 'Full-time',
            salary: '$110k - $150k',
            description: 'Join our data science team to develop machine learning models and derive insights from complex datasets. You\'ll work on cutting-edge projects that drive business decisions.',
            responsibilities: [
              'Build and deploy machine learning models',
              'Analyze large datasets to identify trends and patterns',
              'Collaborate with business teams to define analytics requirements',
              'Create data visualizations and reports',
              'Optimize existing models and algorithms'
            ],
            requirements: [
              'Master\'s or PhD in Data Science, Statistics, or related field',
              '3+ years of experience in data science or analytics',
              'Proficiency in Python, R, and SQL',
              'Experience with ML frameworks (TensorFlow, PyTorch, scikit-learn)',
              'Strong statistical analysis skills',
              'Excellent problem-solving abilities'
            ],
            benefits: [
              'Competitive salary and bonuses',
              'Comprehensive benefits package',
              'Remote work flexibility',
              'Conference and training budget',
              'State-of-the-art computing resources',
              'Collaborative research environment'
            ],
            postedDate: '2024-11-04',
            applicationDeadline: '2024-12-10'
          }
        };
        setJob(sampleJobs[jobId]);
        setLoading(false);
      });
  }, [jobId]);

  const handleApply = () => {
    // Navigate to application page or open application modal
    alert(`Application form for ${job.title} would open here!`);
    // You can navigate to an application page: navigate(`/jobs/${jobId}/apply`);
  };

  const handleBack = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <Container style={{ marginTop: '40px', textAlign: 'center' }}>
        <p>Loading job details...</p>
      </Container>
    );
  }

  if (!job) {
    return (
      <Container style={{ marginTop: '40px', textAlign: 'center' }}>
        <h2>Job not found</h2>
        <Button variant="contained" onClick={handleBack}>
          Back to Home
        </Button>
      </Container>
    );
  }

  return (
    <Container style={{ marginTop: '40px', marginBottom: '40px' }}>
      {/* Back Button */}
      <Button 
        onClick={handleBack}
        style={{ marginBottom: '24px' }}
      >
        ← Back to Jobs
      </Button>

      {/* Job Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', marginBottom: '8px' }}>{job.title}</h1>
        <h2 style={{ fontSize: '24px', color: '#666', fontWeight: 'normal', marginBottom: '16px' }}>
          {job.company}
        </h2>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '24px' }}>
          <span>📍 {job.location}</span>
          <span>💼 {job.type}</span>
          <span>💰 {job.salary}</span>
        </div>
        <Button 
          variant="contained" 
          color="primary"
          size="large"
          onClick={handleApply}
          style={{ padding: '12px 48px' }}
        >
          Apply Now
        </Button>
      </div>

      {/* Job Description */}
      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '32px', 
        borderRadius: '8px',
        marginBottom: '32px'
      }}>
        <h3 style={{ marginBottom: '16px' }}>About the Role</h3>
        <p style={{ lineHeight: '1.6', color: '#333' }}>{job.description}</p>
      </div>

      {/* Responsibilities */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px' }}>Responsibilities</h3>
        <ul style={{ lineHeight: '1.8', color: '#333' }}>
          {job.responsibilities.map((item, index) => (
            <li key={index} style={{ marginBottom: '8px' }}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Requirements */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px' }}>Requirements</h3>
        <ul style={{ lineHeight: '1.8', color: '#333' }}>
          {job.requirements.map((item, index) => (
            <li key={index} style={{ marginBottom: '8px' }}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Benefits */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px' }}>Benefits</h3>
        <ul style={{ lineHeight: '1.8', color: '#333' }}>
          {job.benefits.map((item, index) => (
            <li key={index} style={{ marginBottom: '8px' }}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Additional Info */}
      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '24px', 
        borderRadius: '8px',
        marginBottom: '32px'
      }}>
        <p style={{ marginBottom: '8px' }}>
          <strong>Posted:</strong> {new Date(job.postedDate).toLocaleDateString()}
        </p>
        <p>
          <strong>Application Deadline:</strong> {new Date(job.applicationDeadline).toLocaleDateString()}
        </p>
      </div>

      {/* Apply Button */}
      <div style={{ textAlign: 'center' }}>
        <Button 
          variant="contained" 
          color="primary"
          size="large"
          onClick={handleApply}
          style={{ padding: '12px 48px' }}
        >
          Apply for this Position
        </Button>
      </div>
    </Container>
  );
}