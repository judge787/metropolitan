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
  description: string;
}

interface LineChartProps {}

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
    description: "This chart displays employment rates based on education level across different provinces. The employment rate is calculated as the percentage of people in the labour force who are employed."
  };

  public componentDidMount(): void {
    this.setState({ loading: false, chartKey: Date.now() });
  }

  public componentWillUnmount(): void {
    const chartInstance = ChartJS.getChart("employment-chart-container");
    if (chartInstance) {
      chartInstance.destroy();
    }
  }

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
    const simulatedData = this.getSimulatedData();
    const employmentRates = this.calculateEmploymentRates(simulatedData);
    
    const educationColors = {
      1: { bg: 'rgba(255, 99, 132, 0.2)', border: 'rgba(255, 99, 132, 1)' },
      2: { bg: 'rgba(54, 162, 235, 0.2)', border: 'rgba(54, 162, 235, 1)' },
      3: { bg: 'rgba(255, 206, 86, 0.2)', border: 'rgba(255, 206, 86, 1)' },
      4: { bg: 'rgba(75, 192, 192, 0.2)', border: 'rgba(75, 192, 192, 1)' }
    };
    
    const datasets = Object.entries(this.educationNames).map(([id, name]) => {
      const educationId = parseInt(id);
      
      const data = Object.keys(this.provinceNames).map(() => {
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
  };

  private getLineOptions = (): any => {
    const chartTitle = 'Employment Rate by Education Level Across Provinces';
    
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
            text: 'Provinces',
            font: {
              weight: 'bold'
            }
          }
        }
      }
    };
  };

  public render(): React.JSX.Element {
    const { loading, error, chartKey, description } = this.state;

    if (loading) {
      return <div className="text-center text-gray-600">Loading...</div>;
    }

    return (
      <div className="border-2 border-[#1ed1d6] rounded-lg shadow-md p-4">
        {error && <div className="error-banner bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
        
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
          <div 
            className="w-full p-2 border-2 border-[#1ed1d6] rounded-lg text-[rgba(0,65,187,0.8)]" 
            style={{ fontFamily: 'Sans-Serif' }}
          >
            {description}
          </div>
        </div>
      </div>
    );
  }
}

export default LineChartEmployment;