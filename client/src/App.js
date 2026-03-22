import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material'
import { indigo, amber } from '@mui/material/colors'
import { createTheme } from "@mui/material/styles";

import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import AlbumsPage from './pages/Analytics';
import SongsPage from './pages/AdvancedAnalyticsPage';
import AlbumInfoPage from './pages/AlbumInfoPage'
import JobDetailPage from './pages/JobDetailPage';
import IndustryAnalytics from './pages/IndustryAnalytics';
import CompanySalaryAnalytics from './pages/CompanySalaryAnalytics';
import SkillSimilarity from './pages/SkillSimilarity';
import SkillsSalaryAnalysis from './pages/SkillsSalaryAnalysis';
import HighPayLowBalance from './pages/HighPayLowBalance';
import IndustryJobCounts from './pages/IndustryJobCounts';

// createTheme enables you to customize the look and feel of your app past the default
// in this case, we only change the color scheme
export const theme = createTheme({
  palette: {
    primary: indigo,
    secondary: amber,
  },
});

// App is the root component of our application and as children contain all our pages
// We use React Router's BrowserRouter and Routes components to define the pages for
// our application, with each Route component representing a page and the common
// NavBar component allowing us to navigate between pages (with hyperlinks)
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/albums" element={<AlbumsPage />} />
          <Route path="/albums/:album_id" element={<AlbumInfoPage />} />
          <Route path="/songs" element={<SongsPage />} />
          <Route path="/jobs/:jobId" element={<JobDetailPage />} />
           <Route path="/analytics" element={<IndustryAnalytics />} />
           <Route path="/salary-analytics" element={<CompanySalaryAnalytics />} />
             <Route path="/skill-similarity" element={<SkillSimilarity />} />
             <Route path="/skills-salary" element={<SkillsSalaryAnalysis />} />
             <Route path="/high-pay-low-balance" element={<HighPayLowBalance />} />
              <Route path="/industry-job-counts" element={<IndustryJobCounts />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}