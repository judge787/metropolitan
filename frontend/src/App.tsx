import React, { Component } from 'react';
import './App.css';
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

  private readonly handleContactClick = (): void => {
    this.setState((prevState) => ({
      showContactInfo: !prevState.showContactInfo,
    }));
  };

  private readonly handleToggleView = (): void => {
    this.setState((prevState) => ({
      showCompletions: !prevState.showCompletions,
    }));
  };

  public render(): React.JSX.Element {
    const { showContactInfo, showCompletions } = this.state;

    return (
      <div className="min-h-screen w-screen bg-gray-100 overflow-x-hidden">
        <header className="w-full px-6 py-8 bg-[#d3f3f8] shadow-lg">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <img src="./logoMetro.webp" alt="Logo" style={{ height: '75px' }} />
          <nav>
          <ul className="nav-links">
                <li><a href="#">Home</a></li>
                <li><a href="#">Types</a></li>
                <li><a href="#">Completions</a></li>
                <li><a href="#">Starts</a></li>
                <li><a href="#">Contact Us</a></li>

            </ul>
          </nav>
          </div>
        </header>

        <main className="max-w-6xl mx-auto w-full px-4">
          {showContactInfo && (
            <div id="contact-info" className="mt-4">
              <div className="w-full bg-white rounded-lg p-6 shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Information</h2>
                <p className="text-black">Email: <a href="mailto:info@metropolitanindex.com" className="text-black hover:underline">info@metropolitanindex.com</a></p>
                <p className="text-black">Phone: <a href="tel:+11234567890" className="text-blue-600 hover:underline">(123) 456-7890</a></p>
              </div>
            </div>
          )}

          <section className="my-0">
          <div className="flex justify-center items-center mb-1">
            <img src="./title.webp" alt="Title" style={{ height: '350px' }} />
          </div>

            <ProductPitch />
          </section>

          <section className="my-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Housing Starts and Completions by City</h2>
            <HousingChart 
              showCompletions={showCompletions}
              onToggleView={this.handleToggleView}
            />
          </section>
          
          <section className="my-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Housing Types Distribution by City</h2>
            <DoubleRadarChart />
          </section>
        </main>
      </div>
    );
  }
}

export default App;