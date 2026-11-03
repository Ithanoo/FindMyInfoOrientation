import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout/Layout';
import HomePage from './components/Layout/HomePage';
import AboutPage from './components/Layout/AboutPage';
import QuizView from './components/Quiz/QuizView';
import ResultsPage from './components/Quiz/ResultsPage';
import CareerDetail from './components/UI/CareerDetail';
import SchoolsView from './components/UI/SchoolsView';

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/quiz" element={<QuizView />} />
            <Route path="/quiz/results" element={<ResultsPage />} />
            <Route path="/career/:id" element={<CareerDetail />} />
            <Route path="/schools" element={<SchoolsView />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;
