import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './components/Home.jsx';
import ToolPage from './components/ToolPage.jsx';
import './App.css';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/tools/:slug" element={<ToolPage />} />
      </Route>
    </Routes>
  );
}

export default App;
