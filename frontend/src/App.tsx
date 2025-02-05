import React from 'react';
import './styles/App.css';
import ProductPitch from './components/ProductPitch';

const App: React.FC = () => {
  return (
    <div>
      <h1 className='text-lg'>joblen</h1>
      <ProductPitch />
    </div>
  );
};

export default App;