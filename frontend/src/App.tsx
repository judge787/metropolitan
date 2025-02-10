import React, { useState } from 'react';
import './styles/App.css';
import ProductPitch from './components/ProductPitch';

const App: React.FC = () => {
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleContactClick = () => {
    setShowContactInfo(!showContactInfo);
    setIsClicked(true);
  };

  return (
    <div>
      <div className="App-header">
        <div className="logo-container">
          <img src="/logo192.png" alt="Logo" className="App-logo" />
          <h1 className="text-lg">Metropolitan Housing and Employment Growth Index</h1>
        </div>
        <button 
          onClick={handleContactClick} 
          className={`px-4 py-2 rounded-md shadow-md 
            ${isClicked ? 'bg-purple-700 text-white' : 'bg-white text-blue-700'} 
            hover:bg-purple-300 hover:text-white transition-all cursor-pointer`}
        >
          Contact Us
        </button>
      </div>

      {showContactInfo && (
        <div className="contact-info">
          <h2 className="text-2xl font-bold">Contact Information</h2>
          <p>Email: info@metropolitanindex.com</p>
          <p>Phone: (123) 456-7890</p>
        </div>
      )}

      <ProductPitch />
    </div>
  );
};

export default App;
