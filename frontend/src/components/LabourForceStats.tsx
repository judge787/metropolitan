import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// DateTime Component for Live Time and Date Display
const DateTime: React.FC = () => {
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md text-center">
      <p className="text-lg font-semibold text-gray-700">
        Time: {currentTime.toLocaleTimeString()}
      </p>
      <p className="text-lg font-semibold text-gray-700">
        Date: {currentTime.toLocaleDateString()}
      </p>
    </div>
  );
};

// Interface for labor force data
interface LaborForceData {
  period: string;
  employmentRate: number;
  unemploymentRate: number;
  participationRate: number;
}

// Interface for housing data
interface HousingStartsData {
  period: string;
  totalStarts: number;
  singleStarts: number;
  multiUnitStarts: number;
}

// Correlation data combining both datasets
interface CorrelationData {
  laborForceData: LaborForceData[];
  housingStartsData: HousingStartsData[];
  timePeriodsLabels: string[];
}

interface LabourForceStatsState {
  correlationData: CorrelationData;
  loading: boolean;
  error: string | null;
  chartKey: number;
  selectedMetric: 'employment' | 'unemployment' | 'participation';
  selectedHousingType: 'total' | 'single' | 'multiUnit';
  selectedTimePeriod: 'quarterly' | 'annual';
  description: string;
}

interface LabourForceStatsProps {
  // Any props can be added here if needed
}

class LabourForceStats extends Component<LabourForceStatsProps, LabourForceStatsState> {
  public state: LabourForceStatsState = {
    correlationData: {
      laborForceData: [],
      housingStartsData: [],
      timePeriodsLabels: []
    },
    loading: true,
    error: null,
    chartKey: Date.now(),
    selectedMetric: 'employment',
    selectedHousingType: 'total',
    selectedTimePeriod: 'quarterly',
    description: "This chart visualizes the correlation between labor force statistics and housing starts in Toronto. It helps city planners understand whether changes in the labor market align with new housing developments. A strong positive correlation may indicate that housing construction responds to labor market demands, while a negative correlation or lack of alignment may suggest potential planning challenges or opportunities for improvement."
  };

  public componentDidMount(): void {
    this.fetchData();
  }

  public componentWillUnmount(): void {
    const chartInstance = ChartJS.getChart("labour-housing-chart");
    if (chartInstance) {
      chartInstance.destroy();
    }
  }

  private readonly fetchData = async (): Promise<void> => {
    try {
      // For now, we'll use simulated data
      // In a real application, these would be separate API calls
      // const laborForceResponse = await fetch('/api/laborForceStats/toronto');
      // const housingStartsResponse = await fetch('/api/housingStats/toronto');

      // Simulate loading time
      await new Promise(resolve => setTimeout(resolve, 1000));

      const simulatedData = this.getSimulatedData();
      
      this.setState({
        correlationData: simulatedData,
        loading: false,
        chartKey: Date.now()
      });
    } catch (err) {
      console.error('Error fetching correlation data:', err);
      this.setState({
        error: err instanceof Error ? err.message : "Unexpected error",
        loading: false
      });
    }
  };

  private getSimulatedData(): CorrelationData {
    // Generate 20 quarters (5 years) of simulated data
    const quarters = 20;
    const laborForceData: LaborForceData[] = [];
    const housingStartsData: HousingStartsData[] = [];
    const timePeriodsLabels: string[] = [];

    // Starting values
    let employmentRate = 65 + Math.random() * 5; // 65-70%
    let unemploymentRate = 5 + Math.random() * 3; // 5-8%
    let participationRate = 75 + Math.random() * 5; // 75-80%
    
    let totalStarts = 4000 + Math.random() * 1000; // 4000-5000
    let singleStarts = 1000 + Math.random() * 500; // 1000-1500
    let multiUnitStarts = 3000 + Math.random() * 500; // 3000-3500

    // Year and quarter trackers
    let currentYear = 2019;
    let currentQuarter = 1;

    // Create simulated data with some correlation between employment and housing starts
    for (let i = 0; i < quarters; i++) {
      // Create time period label (e.g., "Q1 2019")
      const periodLabel = `Q${currentQuarter} ${currentYear}`;
      timePeriodsLabels.push(periodLabel);
      
      // Add some random variation to employment rate
      const employmentChange = (Math.random() * 2 - 1) * 1.5; // -1.5 to +1.5
      employmentRate += employmentChange;
      employmentRate = Math.min(Math.max(employmentRate, 60), 75); // Keep between 60-75%
      
      // Unemployment generally moves opposite to employment
      unemploymentRate -= employmentChange * 0.7;
      unemploymentRate = Math.min(Math.max(unemploymentRate, 3), 10); // Keep between 3-10%
      
      // Participation rate changes less drastically
      participationRate += (Math.random() * 1.5 - 0.75); // -0.75 to +0.75
      participationRate = Math.min(Math.max(participationRate, 73), 82); // Keep between 73-82%
      
      // Create housing starts with some correlation to employment rate
      // Higher employment → more housing starts with some delay and noise
      const employmentEffect = (employmentRate - 65) * 50; // Base effect of employment on housing
      const randomNoise = (Math.random() * 2 - 1) * 800; // Random variation
      
      totalStarts = 4000 + employmentEffect + randomNoise;
      totalStarts = Math.max(totalStarts, 2500); // Minimum 2500 starts
      
      singleStarts = totalStarts * (0.2 + Math.random() * 0.1); // 20-30% of total
      multiUnitStarts = totalStarts - singleStarts;
      
      // Push data to arrays
      laborForceData.push({
        period: periodLabel,
        employmentRate,
        unemploymentRate,
        participationRate
      });
      
      housingStartsData.push({
        period: periodLabel,
        totalStarts,
        singleStarts,
        multiUnitStarts
      });
      
      // Increment quarter and year
      currentQuarter++;
      if (currentQuarter > 4) {
        currentQuarter = 1;
        currentYear++;
      }
    }
    
    return {
      laborForceData,
      housingStartsData,
      timePeriodsLabels
    };
  }

  private readonly handleMetricChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    this.setState({ 
      selectedMetric: event.target.value as 'employment' | 'unemployment' | 'participation',
      chartKey: Date.now() 
    });
  };

  private readonly handleHousingTypeChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    this.setState({ 
      selectedHousingType: event.target.value as 'total' | 'single' | 'multiUnit',
      chartKey: Date.now() 
    });
  };

  private readonly handleTimePeriodChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    this.setState({ 
      selectedTimePeriod: event.target.value as 'quarterly' | 'annual',
      chartKey: Date.now() 
    });
  };

  private readonly getChartData = (): any => {
    const { correlationData, selectedMetric, selectedHousingType } = this.state;
    const { laborForceData, housingStartsData, timePeriodsLabels } = correlationData;
    
    // Select the appropriate labor force metric
    const laborForceMetric = laborForceData.map(data => {
      switch(selectedMetric) {
        case 'employment':
          return data.employmentRate;
        case 'unemployment':
          return data.unemploymentRate;
        case 'participation':
          return data.participationRate;
        default:
          return data.employmentRate;
      }
    });
    
    // Select the appropriate housing metric
    const housingMetric = housingStartsData.map(data => {
      switch(selectedHousingType) {
        case 'total':
          return data.totalStarts;
        case 'single':
          return data.singleStarts;
        case 'multiUnit':
          return data.multiUnitStarts;
        default:
          return data.totalStarts;
      }
    });
    
    // Generate descriptive labels for the datasets
    const laborForceLabel = {
      'employment': 'Employment Rate (%)',
      'unemployment': 'Unemployment Rate (%)',
      'participation': 'Participation Rate (%)'
    }[selectedMetric];
    
    const housingLabel = {
      'total': 'Total Housing Starts',
      'single': 'Single-Unit Housing Starts',
      'multiUnit': 'Multi-Unit Housing Starts'
    }[selectedHousingType];
    
    return {
      labels: timePeriodsLabels,
      datasets: [
        {
          label: laborForceLabel,
          data: laborForceMetric,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          yAxisID: 'y',
          fill: false,
          tension: 0.4
        },
        {
          label: housingLabel,
          data: housingMetric,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          yAxisID: 'y1',
          fill: false,
          tension: 0.4
        }
      ]
    };
  };

  private readonly getChartOptions = (): any => {
    const { selectedMetric, selectedHousingType } = this.state;
    
    // Determine y-axis label based on selected metric
    const laborForceAxisLabel = {
      'employment': 'Employment Rate (%)',
      'unemployment': 'Unemployment Rate (%)',
      'participation': 'Participation Rate (%)'
    }[selectedMetric];
    
    // Determine secondary y-axis label based on selected housing type
    const housingAxisLabel = {
      'total': 'Total Housing Starts',
      'single': 'Single-Unit Housing Starts',
      'multiUnit': 'Multi-Unit Housing Starts'
    }[selectedHousingType];
    
    // Determine y-axis range based on selected metric
    const laborForceAxisRange = {
      'employment': { min: 60, max: 75 },
      'unemployment': { min: 3, max: 10 },
      'participation': { min: 73, max: 82 }
    }[selectedMetric];
    
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        title: {
          display: true,
          text: `Correlation Between ${laborForceAxisLabel} and ${housingAxisLabel} in Toronto`,
          font: {
            size: 18,
            weight: 'bold'
          }
        },
        tooltip: {
          callbacks: {
            label: function(context: any) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.datasetIndex === 0) {
                label += context.parsed.y.toFixed(1) + '%';
              } else {
                label += context.parsed.y.toFixed(0);
              }
              return label;
            }
          }
        }
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Time Period',
            font: {
              weight: 'bold'
            }
          }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          min: laborForceAxisRange.min,
          max: laborForceAxisRange.max,
          title: {
            display: true,
            text: laborForceAxisLabel,
            font: {
              weight: 'bold'
            }
          },
          ticks: {
            callback: (value: any) => `${value}%`
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          grid: {
            drawOnChartArea: false,
          },
          title: {
            display: true,
            text: housingAxisLabel,
            font: {
              weight: 'bold'
            }
          },
        },
      }
    };
  };

  public render(): React.JSX.Element {
    const { loading, error, chartKey, description, selectedMetric, selectedHousingType, selectedTimePeriod } = this.state;

    if (loading) {
      return <div className="text-center text-gray-600">Loading...</div>;
    }

    return (
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Chart Container */}
        <div className="flex-1 border-2 border-[#1ed1d6] rounded-lg shadow-md p-4">
          {error && <div className="error-banner bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}

          <div className="mb-4 flex flex-wrap gap-4 items-center justify-between">
            {/* Filter controls */}
            <div className="flex flex-wrap gap-4">
              <div>
                <label htmlFor="metric-select" className="block text-sm font-medium text-gray-700 mb-1">
                  Labor Force Metric:
                </label>
                <select
                  id="metric-select"
                  value={selectedMetric}
                  onChange={this.handleMetricChange}
                  className="p-2 border border-gray-300 rounded-lg bg-white text-black"
                >
                  <option value="employment">Employment Rate</option>
                  <option value="unemployment">Unemployment Rate</option>
                  <option value="participation">Participation Rate</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="housing-select" className="block text-sm font-medium text-gray-700 mb-1">
                  Housing Type:
                </label>
                <select
                  id="housing-select"
                  value={selectedHousingType}
                  onChange={this.handleHousingTypeChange}
                  className="p-2 border border-gray-300 rounded-lg bg-white text-black"
                >
                  <option value="total">Total Housing Starts</option>
                  <option value="single">Single-Unit Housing</option>
                  <option value="multiUnit">Multi-Unit Housing</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="period-select" className="block text-sm font-medium text-gray-700 mb-1">
                  Time Period:
                </label>
                <select
                  id="period-select"
                  value={selectedTimePeriod}
                  onChange={this.handleTimePeriodChange}
                  className="p-2 border border-gray-300 rounded-lg bg-white text-black"
                >
                  <option value="quarterly">Quarterly</option>
                  <option value="annual">Annual</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ height: '400px', width: '100%', maxWidth: '900px', margin: '0 auto' }}>
            <Line 
              key={chartKey}
              data={this.getChartData()} 
              options={this.getChartOptions()}
              id="labour-housing-chart"
            />
          </div>

          {/* Description Box */}
          <div className="mt-4">
            <label htmlFor="chart-description" className="block text-blue-700 font-semibold mb-2 text-xl">
              Data Summary
            </label>
            <div 
              className="w-full p-2 border-2 border-[#1ed1d6] rounded-lg text-blue-700" 
            >
              {description}
            </div>
          </div>
        </div>

        {/* DateTime Display */}
        <div className="w-full md:w-auto">
          <DateTime />
        </div>
      </div>
    );
  }
}

export default LabourForceStats;
