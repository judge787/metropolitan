import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import ProductPitch from './components/ProductPitch';
import HousingChart from './components/DoubleBarChart';
import DoubleRadarChart from './components/DoubleRadarChart';
import LineChartEmployment from './components/LineChartEmployment';
import LabourForceStats from './components/LabourForceStats';
import DateTime from './components/DateTime';


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

  /*
  private readonly handleContactClick = (): void => {
    this.setState((prevState) => ({
      showContactInfo: !prevState.showContactInfo,
    }));
  };
  */
  private readonly handleToggleDarkMode = (): void => {
    this.setState((prevState) => ({
      darkMode: !prevState.darkMode,
    }));
  };
  private readonly handleToggleView = (): void => {
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
            <div className="max-w-xl flex flex-col md:flex-row items-center justify-between gap-4">
              <img src={this.state.darkMode ? "./logoMetroDark.png": "./logoMetro.webp"  }  alt="Logo" className="ml-4" style={{ height: '75px' }} />
              <nav className="ml-auto">
  <ul className="nav-links">
    <li><Link to="/" className={this.state.darkMode ? 'dark-mode' : ''}>Home</Link></li>
    <li><Link to="/types" className={this.state.darkMode ? 'dark-mode' : ''}>Types</Link></li>
    <li><Link to="/completions-starts" className={this.state.darkMode ? 'dark-mode' : ''}>Trends</Link></li>
    <li><Link to="/employment" className={this.state.darkMode ? 'dark-mode' : ''}>Employment</Link></li>
    <li><Link to="/labour-force-stats" className={this.state.darkMode ? 'dark-mode' : ''}>Labour</Link></li>
    <li><Link to="/contact" className={this.state.darkMode ? 'dark-mode' : ''}>Contact</Link></li>
    
    <div className="flex items-center gap-2">
      <button 
        onClick={this.handleToggleDarkMode} 
        className={`px-4 py-2 rounded text-white hover:bg-blue-600 transition ${this.state.darkMode ? 'bg-[#1e1421]' : 'bg-[#b5e3f7]'}`}
      >
        {this.state.darkMode ? '🔆' : '🌙'}
      </button>
      <DateTime darkMode={this.state.darkMode} />
    </div>
  </ul>
</nav>

            </div>
          </header>
            <Routes>
              <Route 
                path="/" 
                element={
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
                } 
              />
              <Route 
                path = "/types"
                element={
                  <section className="my-5">
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
                  <section className="my-5">
                    <div className="flex justify-center items-center mb-1">
                    <img 
                    src={
                      (() => {
                        if (this.state.darkMode) {
                          return this.state.showCompletions ? "./HCD.png" : "./HSD.png";
                        } else {
                          return this.state.showCompletions ? "./HC.png" : "./HS.png";
                        }
                      })()
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
                  <section className="my-15 min-h-screen flex flex-col items-center">
                    <img 
                      src={this.state.darkMode ? "./CUD.png" : "./CU.png"} 
                      alt="Contact Us" 
                      style={{ height: '160px' }} 
                      className="mb-6" 
                    />
                    <div className="contact-info w-full max-w-md rounded-lg p-6 text-center border-2 text-lg md:text-xl">
                      <div className="flex items-center gap-3 mb-4">
                        <img src= {this.state.darkMode ? "./mailDark.png" : "./mailLight.png"}  alt="Email Icon" className="h-8 w-8" />
                        <a 
                          href="mailto:info@metropolitanindex.com" 
                          className={`hover:underline ${this.state.darkMode ? 'text-white' : 'text-[#2b9bda]'}`}
                        >
                          info@metropolitanindex.com
                        </a>
                      </div>
                      <div className="flex items-center gap-3 mb-4">
                        <img src={this.state.darkMode ? "./phoneDark.png" : "./phoneLight.png"} alt="Phone Icon" className="h-8 w-8" />
                        <a
                          href="tel:+11234567890" 
                          className={`hover:underline ${this.state.darkMode ? 'text-white' : 'text-[#2b9bda]'}`}
                        >
                          (123) 456-7890
                        </a>
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                        <img src={this.state.darkMode ? "./instaDark.png" : "./instaLight.png"} alt="Instagram" className="h-8 w-8" />
                        <a
                          href="https://www.instagram.com/bts.bighitofficial/?hl=en" 
                          className={`hover:underline ${this.state.darkMode ? 'text-white' : 'text-[#2b9bda]'}`}
                        >
                          Follow Us For Updates
                        </a>
                      </div>
                      <div className="flex items-center gap-3 mb-4">
                        <img src={this.state.darkMode ? "./discordDark.png" : "./discord light.png"} alt="Discord" className="h-8 w-8" />
                        <a
                          href="https://discord.gg/qXeEcnJyYA" 
                          className={`hover:underline ${this.state.darkMode ? 'text-white' : 'text-[#2b9bda]'}`}
                        >
                          Join Our Discord
                        </a>
                      </div>
                      
                    </div>
                  </section>
                }
              >
              </Route>
              <Route 
                path="/employment" 
                element={
                  <section className="my-0">
                    <div className="flex justify-center items-center mb-1">
                      <img 
                        src={this.state.darkMode ?   "./employmentD.png" :"./employment.png"} alt="Employment" style={{ height: '275px' }}
                      
                      />
                    </div>
                    <div className="max-w-4xl mx-auto">
                      <LineChartEmployment />
                    </div>
                  </section>
                } 
              />
              <Route 
                path="/labour-force-stats" 
                element={
                  <section className="my-0">
                    <div className="flex justify-center items-center mb-1">
                      <img 
                        src={this.state.darkMode ?   "./LFD.png" :"./LF.png"} alt="Labour" style={{ height: '275px' }}
                      />
                    </div>
                    <div className="max-w-4xl mx-auto">
                      <LabourForceStats />
                    </div>
                  </section>
                } 
              />
            </Routes>
            <footer className={`w-full px-4 py-6 text-center ${this.state.darkMode ? 'bg-[#1e1421] text-white' : 'bg-[#d3f3f8] text-black'}`}>
              <p>&copy; 2025 Metropolitan Index. All Rights Reserved.</p>
              <div className="social-links">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="mx-2">Twitter</a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="mx-2">Facebook</a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="mx-2">LinkedIn</a>
              </div>
            </footer>
        </div>
        </main>
      </Router>
    );
  }
}

export default App;








