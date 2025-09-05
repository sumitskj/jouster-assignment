import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import TextAnalyzer from './components/TextAnalyzer';
import SearchAnalyses from './components/SearchAnalyses';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<TextAnalyzer />} />
          <Route path="/search" element={<SearchAnalyses />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
