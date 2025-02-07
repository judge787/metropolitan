import React from 'react';
import './App.css';
import ProductPitch from './components/ProductPitch';

const App: React.FC = () => {
  return (
    <div>
      <h1 className='text-lg pb-20'>Welcome to Metropolitan</h1>
      <ProductPitch />
    </div>
  );
};

export default App;