import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import About from './pages/About';
import Fitness from './pages/Fitness';
import Nutrition from './pages/Nutrition';
import { AuthProvider } from './contexts/AuthContext';
import PostureCheck from './components/PostureCheck';
import Tracker from './pages/Tracker';
import Community from './pages/Community';
import BMICalculator from './pages/BMICalculator';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/posture-check" element={<PostureCheck />} />
              <Route path="/about" element={<About />} />
              <Route path="/fitness" element={<Fitness />} />
              <Route path="/nutrition" element={<Nutrition />} />
              <Route path="/tracker" element={<Tracker />} />
              <Route path="/community" element={<Community />} />
              // Inside your Routes component, add this new route:
              <Route path="/bmi-calculator" element={<BMICalculator />} />
            </Routes>
          </main>
          <Footer />
          <ChatBot />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
