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

interface RadarChartProps {
  showCompletions?: boolean;
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

  private toggleView = (): void => {
    this.setState(prevState => ({
      showCompletions: !prevState.showCompletions,
      chartKey: Date.now()
    }));
  };

  private fetchData = async (): Promise<void> => {
    try {
      // Comment out API call since the service is down
      // const response = await fetch('/api/housingStats'); 
      // if (!response.ok) {
      //   throw new Error(`HTTP error! Status: ${response.status}`);
      // }
      // const allData = await response.json();
      // console.log('Raw data for radar charts:', allData);
      
      // Initialize city data structure with default values
      const cities = ["Vancouver", "Toronto", "Montreal", "Edmonton", "Ottawa-Gatineau"];
      const cityData: Record<string, CityHousingData> = {};
      
      // Use simulated values instead of API data
      cityData["Vancouver"] = {
        singlesStarts: 1200,
        semisStarts: 850,
        rowStarts: 1700,
        apartmentStarts: 4500,
        singlesComplete: 1100,
        semisComplete: 820,
        rowComplete: 1600,
        apartmentComplete: 4200
      };
      
      cityData["Toronto"] = {
        singlesStarts: 2000,
        semisStarts: 1800,
        rowStarts: 3200,
        apartmentStarts: 9800,
        singlesComplete: 1950,
        semisComplete: 1750,
        rowComplete: 3100,
        apartmentComplete: 9500
      };
      
      cityData["Montreal"] = {
        singlesStarts: 1100,
        semisStarts: 950,
        rowStarts: 1300,
        apartmentStarts: 6200,
        singlesComplete: 1050,
        semisComplete: 900,
        rowComplete: 1250,
        apartmentComplete: 5900
      };
      
      cityData["Edmonton"] = {
        singlesStarts: 1500,
        semisStarts: 650,
        rowStarts: 1400,
        apartmentStarts: 2800,
        singlesComplete: 1450,
        semisComplete: 600,
        rowComplete: 1350,
        apartmentComplete: 2600
      };
      
      cityData["Ottawa-Gatineau"] = {
        singlesStarts: 900,
        semisStarts: 700,
        rowStarts: 1100,
        apartmentStarts: 3500,
        singlesComplete: 850,
        semisComplete: 680,
        rowComplete: 1050,
        apartmentComplete: 3300
      };
      
      console.log('Using simulated data for radar chart:', cityData);
      
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

  private getRadarChartData = (): any => {
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

  private getRadarOptions = (): any => {
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

    if (loading) {
      return <div className="text-center text-gray-600">Loading...</div>;
    }

    return (
      <div className="bg-white rounded-lg shadow-md p-4">
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
            options={this.getRadarOptions()}
            id="radar-chart-container"
          />
        </div>

        {/* Description Box */}
        <div className="mt-4">
          <label htmlFor="chart-description" className="block text-gray-700 font-semibold mb-2">
            Data Summary:
          </label>
          <textarea
            id="chart-description"
            className="w-full p-2 border border-gray-300 rounded-lg resize-none text-black"
            rows={5}
            style={{ minHeight: '150px' }}
            value={description}
            readOnly
          />
        </div>
      </div>
    );
  }
}

export default DoubleRadarChart;