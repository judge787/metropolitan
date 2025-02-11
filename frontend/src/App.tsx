import React, { useState } from 'react';
import './App.css';
import ProductPitch from './components/ProductPitch';

const App: React.FC = () => {
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleContactClick = () => {
    setShowContactInfo(!showContactInfo);
    setIsClicked(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      {/* Header Section - Full width */}
      <div className="w-full px-6 py-8 bg-gradient-to-r from-blue-600 to-purple-700 shadow-lg">
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center md:text-left leading-tight">
            Metropolitan Housing and Employment Growth Index
          </h1>
          <button 
            onClick={handleContactClick} 
            className={`px-6 py-3 rounded-xl shadow-lg transform transition-all duration-300 ease-in-out
              ${isClicked ? 'bg-white text-purple-700 scale-95' : 'bg-white/90 text-blue-700 hover:bg-white'} 
              hover:scale-105 hover:shadow-xl flex items-center gap-2`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            Contact Us
          </button>
        </div>
      </div>

      {/* Main Content - Full width */}
      <div className="w-full">
        {showContactInfo && (
          <div className="w-full mt-4 px-6 animate-fade-in">
            <div className="max-w-6xl mx-auto bg-white rounded-lg p-6 shadow-md border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Information
              </h2>
              <div className="space-y-2 text-gray-600">
                <p className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  Email: info@metropolitanindex.com
                </p>
                <p className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  Phone: (123) 456-7890
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Product Pitch Section - Full width with constrained content */}
        <div className="w-full px-6 py-12">
          <div className="max-w-6xl mx-auto">
            <ProductPitch />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;