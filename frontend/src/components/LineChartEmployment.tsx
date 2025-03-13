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

interface LineChartState {
  loading: boolean;
  error: string | null;
  chartKey: number;
  showByEducation: boolean;
  description: string;
}

interface LineChartProps {
  showByEducation?: boolean;
}

class LineChartEmployment extends Component<LineChartProps, LineChartState> {
  private provinceNames: Record<number, string> = {
    1: 'Ontario',
    2: 'Quebec',
    3: 'British Columbia',
    4: 'Alberta',
    5: 'Manitoba',
    6: 'Saskatchewan',
    7: 'Nova Scotia',
    8: 'New Brunswick',
    9: 'Newfoundland and Labrador',
    10: 'Prince Edward Island'
  };

  private educationNames: Record<number, string> = {
    1: 'High School',
    2: 'College',
    3: 'University',
    4: 'Post Graduate'
  };

  private labourStatuses: Record<number, string> = {
    1: 'Employed',
    2: 'Unemployed',
    3: 'Not in Labour Force'
  };

  public state: LineChartState = {
    loading: true,
    error: null,
    chartKey: Date.now(),
    showByEducation: this.props.showByEducation || true,
    description: "This chart displays employment rates based on education level across different provinces. The employment rate is calculated as the percentage of people in the labour force who are employed. Toggle between viewing by education level or by province to see different perspectives on employment trends."
  };

  public componentDidMount(): void {
    this.setState({ loading: false, chartKey: Date.now() });
  }

  public componentDidUpdate(prevProps: LineChartProps): void {
    if (prevProps.showByEducation !== this.props.showByEducation && 
        this.props.showByEducation !== undefined) {
      this.setState({
        showByEducation: this.props.showByEducation,
        chartKey: Date.now()
      });
    }
  }

  public componentWillUnmount(): void {
    const chartInstance = ChartJS.getChart("employment-chart-container");
    if (chartInstance) {
      chartInstance.destroy();
    }
  }

  private toggleView = (): void => {
    this.setState(prevState => ({
      showByEducation: !prevState.showByEducation,
      chartKey: Date.now()
    }));
  };

  private getSimulatedData() {
    const simulatedData = [];
    
    for (let province = 1; province <= 10; province++) {
      for (let educationLevel = 1; educationLevel <= 4; educationLevel++) {
        const totalPeople = 1000 + Math.floor(Math.random() * 5000);
        const employedCount = Math.floor(totalPeople * (0.5 + (educationLevel * 0.08) + Math.random() * 0.1));
        const unemployedCount = totalPeople - employedCount;
        
        simulatedData.push({
          province,
          educationLevel,
          labourForceStatus: 1,
          count: employedCount
        });
        
        simulatedData.push({
          province,
          educationLevel,
          labourForceStatus: 2,
          count: unemployedCount
        });
        
        simulatedData.push({
          province,
          educationLevel,
          labourForceStatus: 3,
          count: Math.floor(totalPeople * 0.3)
        });
      }
    }
    
    return simulatedData;
  }
  
  private calculateEmploymentRates(data) {
    const employmentRatesByProvince = {};
    const employmentRatesByEducation = {};
    
    Object.keys(this.provinceNames).forEach(provinceId => {
      employmentRatesByProvince[provinceId] = 0;
    });
    
    Object.keys(this.educationNames).forEach(educationId => {
      employmentRatesByEducation[educationId] = 0;
    });
    
    const provinceGroups = {};
    const educationGroups = {};
    
    data.forEach(entry => {
      const { province, educationLevel, labourForceStatus, count } = entry;
      
      if (!provinceGroups[province]) {
        provinceGroups[province] = { employed: 0, labourForce: 0 };
      }
      
      if (labourForceStatus === 1) {
        provinceGroups[province].employed += count;
        provinceGroups[province].labourForce += count;
      } else if (labourForceStatus === 2) {
        provinceGroups[province].labourForce += count;
      }
      
      if (!educationGroups[educationLevel]) {
        educationGroups[educationLevel] = { employed: 0, labourForce: 0 };
      }
      
      if (labourForceStatus === 1) {
        educationGroups[educationLevel].employed += count;
        educationGroups[educationLevel].labourForce += count;
      } else if (labourForceStatus === 2) {
        educationGroups[educationLevel].labourForce += count;
      }
    });
    
    Object.keys(provinceGroups).forEach(provinceId => {
      const group = provinceGroups[provinceId];
      employmentRatesByProvince[provinceId] = 
        group.labourForce > 0 ? (group.employed / group.labourForce) * 100 : 0;
    });
    
    Object.keys(educationGroups).forEach(educationId => {
      const group = educationGroups[educationId];
      employmentRatesByEducation[educationId] = 
        group.labourForce > 0 ? (group.employed / group.labourForce) * 100 : 0;
    });
    
    return { byProvince: employmentRatesByProvince, byEducation: employmentRatesByEducation };
  }

  private getLineChartData = (): any => {
    const { showByEducation } = this.state;
    const simulatedData = this.getSimulatedData();
    const employmentRates = this.calculateEmploymentRates(simulatedData);
    
    const educationColors = {
      1: { bg: 'rgba(255, 99, 132, 0.2)', border: 'rgba(255, 99, 132, 1)' },
      2: { bg: 'rgba(54, 162, 235, 0.2)', border: 'rgba(54, 162, 235, 1)' },
      3: { bg: 'rgba(255, 206, 86, 0.2)', border: 'rgba(255, 206, 86, 1)' },
      4: { bg: 'rgba(75, 192, 192, 0.2)', border: 'rgba(75, 192, 192, 1)' }
    };
    
    const provinceColors = {
      1: { bg: 'rgba(153, 102, 255, 0.2)', border: 'rgba(153, 102, 255, 1)' },
      2: { bg: 'rgba(255, 159, 64, 0.2)', border: 'rgba(255, 159, 64, 1)' },
      3: { bg: 'rgba(199, 199, 199, 0.2)', border: 'rgba(199, 199, 199, 1)' },
      4: { bg: 'rgba(83, 102, 255, 0.2)', border: 'rgba(83, 102, 255, 1)' },
      5: { bg: 'rgba(220, 20, 60, 0.2)', border: 'rgba(220, 20, 60, 1)' },
      6: { bg: 'rgba(0, 128, 0, 0.2)', border: 'rgba(0, 128, 0, 1)' },
      7: { bg: 'rgba(255, 0, 255, 0.2)', border: 'rgba(255, 0, 255, 1)' },
      8: { bg: 'rgba(0, 0, 128, 0.2)', border: 'rgba(0, 0, 128, 1)' },
      9: { bg: 'rgba(128, 0, 0, 0.2)', border: 'rgba(128, 0, 0, 1)' },
      10: { bg: 'rgba(0, 128, 128, 0.2)', border: 'rgba(0, 128, 128, 1)' }
    };
    
    if (showByEducation) {
      const datasets = Object.entries(this.educationNames).map(([id, name]) => {
        const educationId = parseInt(id);
        
        const data = Object.keys(this.provinceNames).map(provinceId => {
          return employmentRates.byEducation[educationId] + (Math.random() * 6 - 3);
        });
        
        return {
          label: name,
          data,
          backgroundColor: educationColors[educationId].bg,
          borderColor: educationColors[educationId].border,
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointRadius: 3,
        };
      });
      
      return {
        labels: Object.values(this.provinceNames),
        datasets
      };
    } else {
      const datasets = Object.entries(this.provinceNames).map(([id, name]) => {
        const provinceId = parseInt(id);
        
        const data = Object.keys(this.educationNames).map(educationId => {
          return employmentRates.byProvince[provinceId] + (Math.random() * 6 - 3);
        });
        
        return {
          label: name,
          data,
          backgroundColor: provinceColors[provinceId].bg,
          borderColor: provinceColors[provinceId].border,
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointRadius: 3,
        };
      });
      
      return {
        labels: Object.values(this.educationNames),
        datasets
      };
    }
  };

  private getLineOptions = (): any => {
    const { showByEducation } = this.state;
    const chartTitle = showByEducation ? 
      'Employment Rate by Education Level Across Provinces' : 
      'Employment Rate by Province Across Education Levels';
    
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
              return `${context.dataset.label}: ${context.raw.toFixed(1)}%`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          min: 40,
          max: 100,
          title: {
            display: true,
            text: 'Employment Rate (%)',
            font: {
              weight: 'bold'
            }
          },
          ticks: {
            callback: function(value: any) {
              return value + '%';
            }
          }
        },
        x: {
          title: {
            display: true,
            text: showByEducation ? 'Provinces' : 'Education Levels',
            font: {
              weight: 'bold'
            }
          }
        }
      }
    };
  };

  public render(): React.JSX.Element {
    const { loading, error, chartKey, description, showByEducation } = this.state;

    if (loading) {
      return <div className="text-center text-gray-600">Loading...</div>;
    }

    return (
      <div className="border-2 border-[#1ed1d6] rounded-lg shadow-md p-4">
        {error && <div className="error-banner bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
        <div className="mb-4">
          <button 
            onClick={this.toggleView}
            className="px-4 py-2 bg-[rgba(0,65,187,1)] text-white rounded hover:bg-blue-700 transition duration-200"
          >
            {showByEducation ? "Show By Province" : "Show By Education Level"}
          </button>
        </div>
        
        <div style={{ height: '400px', width: '100%', maxWidth: '900px', margin: '0 auto' }}>
          <Line 
            key={chartKey}
            data={this.getLineChartData()} 
            options={this.getLineOptions()}
            id="employment-chart-container"
          />
        </div>

        <div className="mt-4">
          <label htmlFor="chart-description" className="block text-[rgba(0,65,187,0.8)] font-semibold mb-2 text-3xl" style={{ fontFamily: 'Others' }}>
            Data Summary
          </label>
          <textarea
            id="chart-description"
            className="w-full p-2 border-2 border-[#1ed1d6] rounded-lg resize-none text-[rgba(0,65,187,0.8)]" 
            style={{ fontFamily: 'Sans-Serif', minHeight: '150px'}}
            rows={5}
            value={description}
            readOnly
          />
        </div>
      </div>
    );
  }
}

export default LineChartEmployment;