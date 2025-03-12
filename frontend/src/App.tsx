import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import ProductPitch from './components/ProductPitch';
import HousingChart from './components/DoubleBarChart';
import DoubleRadarChart from './components/DoubleRadarChart';

interface AppState {
  showContactInfo: boolean;
  showCompletions: boolean; // Added state to track which data to display
}

class App extends Component<{}, AppState> {
  public state: AppState = {
    showContactInfo: false,
    showCompletions: false, // Default to showing housing starts
  };

  private handleContactClick = (): void => {
    this.setState((prevState) => ({
      showContactInfo: !prevState.showContactInfo,
    }));
  };

  private handleToggleView = (): void => {
    this.setState((prevState) => ({
      showCompletions: !prevState.showCompletions,
    }));
  };

  public render(): React.JSX.Element {
    return (
      <Router>
        <div className="min-h-screen w-screen bg-gray-100 overflow-x-hidden">
          <header className="w-full px-6 py-8 bg-[#d3f3f8] shadow-lg">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              <img src="./logoMetro.webp" alt="Logo" style={{ height: '75px' }} />
              <nav>
                <ul className="nav-links">
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/types">Types</Link></li>
                  <li><Link to="/completions-starts">Completions / Starts</Link></li>
                  <li><Link to="/contact">Contact Us</Link></li>
                </ul>
              </nav>
            </div>
          </header>

          <main className="max-w-6xl mx-auto w-full px-4">
            <Routes>
              <Route 
                path="/" 
                element={
                  <>
                    <section className="my-0">
                      <div className="flex justify-center items-center mb-1">
                        <img src="./title.webp" alt="Title" style={{ height: '350px' }} />
                      </div>
                      <ProductPitch />
                    </section>
                  </>
                } 
              />
              <Route 
                path = "/types"
                element={
                  <section className="my-12">
                    <h2 className= "text-2xl font-bold text-gray-800 mb-6">Housing Types by City</h2>
                    <DoubleRadarChart />
                  </section>
                }></Route>
              <Route 
                path="/completions-starts" 
                element={
                  <section className="my-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Housing Starts and Completions by City</h2>
                    <HousingChart />
                  </section>
                } 
              />
            </Routes>
          </main>
        </div>
      </Router>
    );
  }
}

export default App;
