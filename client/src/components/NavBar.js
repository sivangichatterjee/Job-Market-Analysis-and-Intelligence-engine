import { AppBar, Container, Toolbar, Typography } from '@mui/material'
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

// The hyperlinks in the NavBar contain a lot of repeated formatting code so a
// helper component NavText local to the file is defined to prevent repeated code.
function NavText({ href, text, isMain }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = location.pathname === href;

  const handleClick = (e) => {
    // If we're already on this page, refresh it
    if (location.pathname === href) {
      e.preventDefault();
      window.location.href = href;
    }
  };

  return (
    <Typography
      variant={isMain ? 'h5' : 'h7'}
      noWrap
      style={{
        marginRight: isMain ? '50px' : '20px',
        fontFamily: isMain ? "'Poppins', sans-serif" : "'Inter', sans-serif",
        fontWeight: isMain ? 800 : 600,
        letterSpacing: isMain ? '0.05rem' : '0.02rem',
        position: 'relative',
        padding: isMain ? '0' : '8px 16px',
        borderRadius: '8px',
        transition: 'all 0.3s ease',
        backgroundColor: isActive && !isMain ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
      }}
      onMouseEnter={(e) => {
        if (!isMain && !isActive) {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isMain && !isActive) {
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
    >
      <NavLink
        to={href}
        onClick={handleClick}
        style={{
          color: 'inherit',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        {isMain && <span style={{ fontSize: '28px' }}>🚀</span>}
        {text}
      </NavLink>
    </Typography>
  )
}

// Here, we define the NavBar. Note that we heavily leverage MUI components
// to make the component look nice. Feel free to try changing the formatting
// props to how it changes the look of the component.
export default function NavBar() {
  return (
    <AppBar 
      position='static'
      style={{
        background: 'linear-gradient(90deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        borderBottom: '2px solid rgba(148, 163, 184, 0.2)'
      }}
    >
      <Container maxWidth='xl'>
        <Toolbar 
          disableGutters
          style={{
            minHeight: '72px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <NavText href='/' text='CareerHub' isMain />
          <div style={{ 
            display: 'flex', 
            gap: '12px',
            marginLeft: 'auto'
          }}>
            <NavText href='/albums' text='📊 Analytics' />
            <NavText href='/songs' text='🔬 Advanced Analytics' />
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
}