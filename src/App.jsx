// App.jsx (Add AOS init)
import React, { useEffect } from 'react';
import { RoutesComponent } from './routes/Routes';
import { ToastContainer } from 'react-toastify';
import AOS from 'aos';
import 'aos/dist/aos.css'; 

function App() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: false,
      mirror: true, 
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <RoutesComponent />
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </div>
  );
}

export default App;