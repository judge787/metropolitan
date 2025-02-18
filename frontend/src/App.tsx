import React, { useState } from 'react';
import './App.css';
import ProductPitch from './components/ProductPitch';
import HousingStartChart from './components/HousingStartChart';

const App: React.FC = () => {
  const [showContactInfo, setShowContactInfo] = useState(false);

  const handleContactClick = () => {
    setShowContactInfo(!showContactInfo);
  };

  return (
    <div className="min-h-screen w-screen bg-gray-100 overflow-x-hidden">
      <header className="w-full px-6 py-8 bg-gradient-to-r from-teal-500 to-blue-600 shadow-lg">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-4xl font-bold text-white text-center md:text-left leading-tight">
            Metropolitan Housing and Employment Growth Index
          </h1>
          <button
            onClick={handleContactClick}
            aria-expanded={showContactInfo}
            aria-controls="contact-info"
            className="px-6 py-3 rounded-xl shadow-lg bg-white text-blue-700 hover:bg-blue-100 transition duration-300 ease-in-out"
          >
            Contact Us
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto w-full px-4">
        {showContactInfo && (
          <div id="contact-info" className="mt-4">
            <div className="w-full bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Information</h2>
              <p className = "text-black">Email: <a href="mailto:info@metropolitanindex.com" className="text-black hover:underline">info@metropolitanindex.com</a></p>
              <p className = "text-black">Phone: <a href="tel:+11234567890" className="text-blue-600 hover:underline">(123) 456-7890</a></p>
            </div>
          </div>
        )}

        <section className="my-12">
          <ProductPitch />
        </section>

        <section className="my-12">
          <HousingStartChart />
        </section>
      </main>
    </div>
  );
};

export default App;
