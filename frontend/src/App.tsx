import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import ProductPitch from './components/ProductPitch';
import HousingChart from './components/DoubleBarChart';
import DoubleRadarChart from './components/DoubleRadarChart';
interface AppState {
  showContactInfo: boolean;
  showCompletions: boolean; // Added state to track which data to display
  darkMode: boolean; // New state for dark mode
}

class App extends Component<{}, AppState> {
  public state: AppState = {
    showContactInfo: false,
    showCompletions: false, // Default to showing housing starts
    darkMode: false, // Default to light mode
  };

  private handleContactClick = (): void => {
    this.setState((prevState) => ({
      showContactInfo: !prevState.showContactInfo,
    }));
  };
  private handleToggleDarkMode = (): void => {
    this.setState((prevState) => ({
      darkMode: !prevState.darkMode,
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
<main className={`min-h-screen w-screen overflow-x-hidden ${this.state.darkMode ? 'dark-mode' : ''}`}>
  <div className={`w-full px-0 ${this.state.darkMode ? 'main-content' : ''}`}>
    <header className={`w-full px-0 py-8 shadow-lg ${this.state.darkMode ? 'bg-[#3d3045]' : 'bg-[#d3f3f8]'}`}>
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              <img src={this.state.darkMode ? "./logoMetroDark.png": "./logoMetro.webp"  }  alt="Logo" style={{ height: '75px' }} />
              <nav>
                <ul className="nav-links">
                  <li><Link to="/" className={this.state.darkMode ? 'dark-mode' : ''}>Home</Link></li>
                  <li><Link to="/types" className={this.state.darkMode ? 'dark-mode' : ''}>Types</Link></li>
                  <li><Link to="/completions-starts" className={this.state.darkMode ? 'dark-mode' : ''}>Trends</Link></li>
                  <li><Link to="/contact" className={this.state.darkMode ? 'dark-mode' : ''}>Contact Us</Link></li>
                  <li>
                  <button 
                    onClick={this.handleToggleDarkMode} 
                    className={`px-4 py-2 rounded text-white hover:bg-blue-600 transition ${this.state.darkMode ? 'bg-[#1e1421]' : 'bg-[#b5e3f7]'}`}
                  >
                    {this.state.darkMode ? '🔆' : '🌙'}
                  </button>
                  </li>
                </ul>
              </nav>
            </div>
          </header>
            <Routes>
              <Route 
                path="/" 
                element={
                  <>
                    <section className="my-0">
                      <div className="flex justify-center items-center mb-1">
                      <img 
                        src={this.state.darkMode ? './darkmodeTitle.png' : './title.png'} 
                        alt="Title" 
                        style={{ height: '300px', width: '50%' }} 
                      />
                      </div>
                      <ProductPitch darkMode={this.state.darkMode} />
                    </section>
                  </>
                } 
              />
              <Route 
                path = "/types"
                element={
                  <section className="my-11">
                    <div className="flex justify-center items-center mb-1">
                    <img src={this.state.darkMode ? "./HTD.png" : "./HT.png"} alt="TitleHousing" style={{ height: '250px' }} />
                    </div>
                    <div className = "max-w-4xl mx-auto">
                    <DoubleRadarChart />
                    </div>
                  </section>
                }></Route>
              <Route 
                path="/completions-starts" 
                element={
                  <section className="my-12">
                    <div className="flex justify-center items-center mb-1">
                    <img 
                    src={
                      this.state.darkMode 
                        ? (this.state.showCompletions ? "./HCD.png" : "./HSD.png") 
                        : (this.state.showCompletions ? "./HC.png" : "./HS.png")
                    } alt="Housing" 
                    style={this.state.showCompletions ? { height: '300px' } : { height: '250px'}} />
                    </div>
                    <div className = "max-w-4xl mx-auto">
                    <HousingChart 
                      showCompletions={this.state.showCompletions} // Pass the state for showCompletions
                      onToggleView={this.handleToggleView} />
                      </div>
                  </section>
                } 
              />
              <Route 
                path="/contact"
                element={
                  <section className="my-14">
                    <div className="flex justify-center items-center mb-1">
                      <img src={this.state.darkMode ? "./CUD.png" : "./CU.png"}  alt="ContactUS" style={{ height: '250px' }} />
                    </div>
                    <div className={`contact-info w-full rounded-lg p-6 shadow-md ${this.state.darkMode ? 'bg-gray-800 text-white' : 'bg-[#d3f3f8] text-black'}`}>
                      <h2 className={`font-semibold mb-2 text-3xl ${this.state.darkMode ? 'text-blue-400' : 'text-[rgba(0,65,187,0.8)]'}`}>
                        Contact Information
                      </h2>
                      <p>Email: <a href="mailto:info@metropolitanindex.com" className={`hover:underline ${this.state.darkMode ? 'text-blue-300' : 'text-black'}`}>info@metropolitanindex.com</a></p>
                      <p>Phone: <a href="tel:+11234567890" className={`hover:underline ${this.state.darkMode ? 'text-blue-300' : 'text-blue-600'}`}>(123) 456-7890</a></p>
                    </div>
                  </section>
                }
              >
              </Route>
            </Routes>
        </div>
        </main>
      </Router>
    );
  }
}

export default App;