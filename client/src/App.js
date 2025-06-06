import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import About from './pages/About';
import Jobs from './pages/Jobs';
import Application from './pages/Application';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import CursorAnimation from './components/CursorAnimation';
import FinisherHeader from './components/FinisherHeader';

function App() {
  return (
    <div className="app">
      <FinisherHeader />
      <CursorAnimation />
      <div className="grid h-screen place-content-center bg-black">
        <Navigation />
      </div>
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/apply/:jobId" element={<Application />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;