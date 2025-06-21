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
import GooeyNav from './components/GooeyNav';

function App() {
  const items = [
    { label: "Home", href: "/" },
    { label: "Jobs", href: "/jobs" },
    { label: "About", href: "/about" },
  ];
  return (
    <div className="app">
      <FinisherHeader />
      <CursorAnimation />
      <div className="grid h-screen place-content-center bg-black">
        <Navigation />
      </div>
      {/* <div className="grid h-screen place-content-center bg-black">
        <GooeyNav
          items={items}
          particleCount={15}
          particleDistances={[90, 10]}
          particleR={100}
          initialActiveIndex={0}
          animationTime={600}
          timeVariance={300}
          colors={[1, 2, 3, 1, 2, 3, 1, 4]}
        />
      </div> */}
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