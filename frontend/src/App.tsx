import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import ProductPitch from './components/ProductPitch';
import HousingChart from './components/DoubleBarChart';
import DoubleRadarChart from './components/DoubleRadarChart';
import LineChartEmployment from './components/LineChartEmployment';

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
                  <li><Link to="/completions-starts">Trends</Link></li>
                  <li><Link to="/contact">Contact Us</Link></li>
                  <li><Link to="/mode">Mode</Link></li>
                  <li><Link to="/employment">Employment</Link></li>
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
                  <section className="my-11">
                    <div className="flex justify-center items-center mb-1">
                    <img src="./HT.png" alt="TitleHousing" style={{ height: '250px' }} />
                    </div>
                    <DoubleRadarChart />
                  </section>
                }></Route>
              <Route 
                path="/completions-starts" 
                element={
                  <section className="my-12">
                    <div className="flex justify-center items-center mb-1">
                    <img 
                    src={this.state.showCompletions ? "./HC.png" : "./HS.png"} alt="Housing" 
                    style={this.state.showCompletions ? { height: '300px' } : { height: '250px'}} />
                    </div>
                    <HousingChart 
                      showCompletions={this.state.showCompletions} // Pass the state for showCompletions
                      onToggleView={this.handleToggleView} />
                  </section>
                } 
              />
              <Route 
              path = "/contact"
              element={
                <section className="my-14">
                    <div className="flex justify-center items-center mb-1">
                    <img src="./CU.png" alt="ContactUS" style={{ height: '250px' }} />
                    </div>
                    <div className="w-full bg-[#d3f3f8] rounded-lg p-6 shadow-md">
                    <h2 
                      className="text-[rgba(0,65,187,0.8)] font-semibold mb-2 text-3xl" 
                      style={{ fontFamily: 'Others' }}
                    >
                      Contact Information
                    </h2>

                    <p className="text-black">Email: <a href="mailto:info@metropolitanindex.com" className="text-black hover:underline">info@metropolitanindex.com</a></p>
                    <p className="text-black">Phone: <a href="tel:+11234567890" className="text-blue-600 hover:underline">(123) 456-7890</a></p>
                  </div>
                  </section>
              }
              >
              </Route>
              <Route 
                path="/employment" 
                element={
                  <section className="my-12">
                    <div className="flex justify-center items-center mb-1">
                      <img 
                        src="./employment.png" 
                        alt="Employment" 
                        style={{ height: '250px' }}
                      />
                    </div>
                    <LineChartEmployment />
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
