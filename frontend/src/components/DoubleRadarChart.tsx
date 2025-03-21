import React, { Component } from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';

// Register required Chart.js components for radar charts
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface RadarChartProps {
  showCompletions?: boolean;
  darkMode: boolean; // Add darkMode prop
}

// Define interface for city housing data
interface CityHousingData {
  singlesStarts: number;
  semisStarts: number;
  rowStarts: number;
  apartmentStarts: number;
  singlesComplete: number;
  semisComplete: number;
  rowComplete: number;
  apartmentComplete: number;
}

interface RadarChartState {
  cityData: Record<string, CityHousingData>;
  loading: boolean;
  error: string | null;
  chartKey: number;
  showCompletions: boolean;
  description: string;
}


class DoubleRadarChart extends Component<RadarChartProps, RadarChartState> {
  public state: RadarChartState = {
    cityData: {},
    loading: true,
    error: null,
    chartKey: Date.now(),
    showCompletions: this.props.showCompletions || false,
    description: "This radar chart visualizes housing data across major Canadian metropolitan areas. Each axis represents a different housing type: singles, semis, townhomes, and apartments. The radar shape illustrates the distribution pattern of housing across these categories, making it easy to identify which cities favor certain housing types. Toggle between housing starts and completions to compare how construction priorities match with finished housing projects."
  };

  public componentDidMount(): void {
    this.fetchData();
  }

  public componentDidUpdate(prevProps: RadarChartProps): void {
    if (prevProps.showCompletions !== this.props.showCompletions && this.props.showCompletions !== undefined) {
      this.setState({
        showCompletions: this.props.showCompletions,
        chartKey: Date.now()
      });
    }
  }

  public componentWillUnmount(): void {
    // Explicitly destroy chart instance
    const chartInstance = ChartJS.getChart("radar-chart-container");
    if (chartInstance) {
      chartInstance.destroy();
    }
  }

  private readonly toggleView = (): void => {
    this.setState(prevState => ({
      showCompletions: !prevState.showCompletions,
      chartKey: Date.now()
    }));
  };

  private readonly fetchData = async (): Promise<void> => {
    try {
      // Fetch all housing data
      const response = await fetch('/api/housingStats'); 
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const allData = await response.json();
      console.log('Raw data for radar charts:', allData);
      
      // Initialize city data structure with default values
      const cities = ["Vancouver", "Toronto", "Montreal", "Edmonton", "Ottawa-Gatineau"];
      const cityData: Record<string, CityHousingData> = {};
      
      cities.forEach(city => {
        cityData[city] = {
          singlesStarts: 0,
          semisStarts: 0,
          rowStarts: 0,
          apartmentStarts: 0,
          singlesComplete: 0,
          semisComplete: 0,
          rowComplete: 0,
          apartmentComplete: 0
        };
      });
      
      // Process real data - notice the property name adjustments to match backend model
      allData.forEach((item: any) => {
        const city = item.censusArea;
        if (cities.includes(city)) {
          // Add starts data - note: backend uses 'singleStarts' (singular) but we use 'singlesStarts' (plural)
          cityData[city].singlesStarts += item.singleStarts || 0;
          cityData[city].semisStarts += item.semisStarts || 0;
          cityData[city].rowStarts += item.rowStarts || 0;
          cityData[city].apartmentStarts += item.apartmentStarts || 0;
          
          // Add completions data
          cityData[city].singlesComplete += item.singlesComplete || 0;
          cityData[city].semisComplete += item.semisComplete || 0;
          cityData[city].rowComplete += item.rowComplete || 0;
          cityData[city].apartmentComplete += item.apartmentComplete || 0;
        }
      });
      
      console.log('Processed city data for radar chart:', cityData);
      
      this.setState({
        cityData,
        loading: false,
        error: null,
        chartKey: Date.now()
      });
    } catch (err) {
      console.error('Error in fetchData for radar chart:', err);
      this.setState({
        error: err instanceof Error ? err.message : "Unexpected error",
        loading: false
      });
    }
  };

  private readonly getRadarChartData = (): any => {
    const { cityData, showCompletions } = this.state;
    const cities = Object.keys(cityData);
    
    // Define colors for each city
    const cityColors = {
      "Vancouver": { bg: 'rgba(54, 162, 235, 0.2)', border: 'rgba(54, 162, 235, 1)' },
      "Toronto": { bg: 'rgba(255, 99, 132, 0.2)', border: 'rgba(255, 99, 132, 1)' },
      "Montreal": { bg: 'rgba(255, 206, 86, 0.2)', border: 'rgba(255, 206, 86, 1)' },
      "Edmonton": { bg: 'rgba(75, 192, 192, 0.2)', border: 'rgba(75, 192, 192, 1)' },
      "Ottawa-Gatineau": { bg: 'rgba(153, 102, 255, 0.2)', border: 'rgba(153, 102, 255, 1)' }
    };
    
    // Create datasets for each city
    const datasets = cities.map(city => {
      const data = showCompletions 
        ? [
            cityData[city].singlesComplete || 0,
            cityData[city].semisComplete || 0,
            cityData[city].rowComplete || 0,
            cityData[city].apartmentComplete || 0
          ]
        : [
            cityData[city].singlesStarts || 0,
            cityData[city].semisStarts || 0,
            cityData[city].rowStarts || 0,
            cityData[city].apartmentStarts || 0
          ];
          
      const color = cityColors[city as keyof typeof cityColors] || 
        { bg: 'rgba(201, 203, 207, 0.2)', border: 'rgba(201, 203, 207, 1)' };
      
      return {
        label: city,
        data: data,
        backgroundColor: color.bg,
        borderColor: color.border,
        borderWidth: 2,
        pointBackgroundColor: color.border,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: color.border
      };
    });
    
    return {
      labels: ['Singles', 'Semis', 'Townhomes', 'Apartments'],
      datasets: datasets
    };
  };

  private readonly getRadarOptions = (): any => {
    const { showCompletions } = this.state;
    const chartTitle = showCompletions ? 'Housing Completions by Type' : 'Housing Starts by Type';
    
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: chartTitle,
          font: {
            size: 20,
            family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
            weight: 'bold',
          },
        },
        legend: {
          position: 'top',
          labels: {
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context: any) {
              return `${context.dataset.label}: ${context.raw}`;
            }
          }
        }
      },
      scales: {
        r: {
          beginAtZero: true,
          ticks: {
            color: '#666',
            backdropColor: 'transparent'
          },
          pointLabels: {
            color: '#333',
            font: {
              size: 12,
              weight: 'bold'
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          },
          angleLines: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        }
      }
    };
  };

  public render(): React.JSX.Element {
    const { loading, error, chartKey, description, showCompletions } = this.state;
    const { darkMode} = this.props;

    if (loading) {
      return <div className="text-center text-gray-600">Loading...</div>;
    }

    return (
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Radar Chart Container */}
        <div className="flex-1 border-2 border-[#1ed1d6] rounded-lg shadow-md p-4">
          {error && <div className="error-banner bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}

          <div className="mb-4">
            <button 
              onClick={this.toggleView}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
            >
              {showCompletions ? "Show Housing Starts" : "Show Housing Completions"}
            </button>
          </div>

          <div style={{ height: '500px', width: '100%' }}>
            <Radar 
              key={chartKey}
              data={this.getRadarChartData()} 
              options={{ responsive: true, maintainAspectRatio: false }}
              id="radar-chart-container"
            />
          </div>

        {/* Description Box */}
        <div className="mt-4">
            <label htmlFor="chart-description" className= "block text-blue-700 font-semibold mb-2 text-xl">
              Data Summary
            </label>
            <textarea
              id="chart-description"
              className={`w-full p-2 border-2 border-[#1ed1d6] rounded-lg resize-none ${darkMode ? 'text-white' : 'text-blue-700'}`}
              rows={5}
              value={description}
              readOnly
            />
          </div>
        </div>


      </div>
    );
  }
}

export default DoubleRadarChart;