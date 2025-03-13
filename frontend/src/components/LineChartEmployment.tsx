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

// Register required Chart.js components
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

// Define interface for employment data
interface EmploymentData {
  month: string;
  highSchool: number;
  college: number;
  university: number;
  postGraduate: number;
}

interface LineChartState {
  employmentData: EmploymentData[];
  loading: boolean;
  error: string | null;
  chartKey: number;
  showByEducation: boolean;
  description: string;
  selectedProvince: number | null;
}

interface LineChartProps {
  showByEducation?: boolean;
}

class LineChartEmployment extends Component<LineChartProps, LineChartState> {
  public state: LineChartState = {
    employmentData: [],
    loading: true,
    error: null,
    chartKey: Date.now(),
    showByEducation: this.props.showByEducation || true,
    description: "This line chart illustrates employment trends by education level across different provinces in Canada. The visualization helps identify how education attainment correlates with employment rates over time. Toggle between views to compare employment rates by education level or by province.",
    selectedProvince: null
  };

  public componentDidMount(): void {
    this.fetchData();
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

  private toggleView = (): void => {
    this.setState(prevState => ({
      showByEducation: !prevState.showByEducation,
      chartKey: Date.now()
    }));
  };

  private handleProvinceChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const provinceId = parseInt(event.target.value, 10);
    this.setState({
      selectedProvince: isNaN(provinceId) ? null : provinceId,
      chartKey: Date.now()
    });
  };

  private fetchData = async (): Promise<void> => {
    try {
      // Since we don't have real employment data API yet, use simulated data
      // When the real API is available, replace this with actual fetch call
      // const response = await fetch('/api/labourMarketData');
      // if (!response.ok) {
      //   throw new Error(`HTTP error! Status: ${response.status}`);
      // }
      // const employmentData = await response.json();
      
      // Generate simulated data
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      
      const simulatedData: EmploymentData[] = months.map((month, index) => ({
        month,
        highSchool: 50 + Math.random() * 20 + (index / 2), // Slight upward trend
        college: 65 + Math.random() * 15 + (index / 3),
        university: 75 + Math.random() * 10 + (index / 2.5),
        postGraduate: 85 + Math.random() * 8 + (index / 3.5)
      }));
      
      console.log('Simulated employment data:', simulatedData);
      
      this.setState({
        employmentData: simulatedData,
        loading: false,
        error: null,
        chartKey: Date.now()
      });
    } catch (err) {
      console.error('Error in fetchData for employment chart:', err);
      this.setState({
        error: err instanceof Error ? err.message : "Unexpected error",
        loading: false
      });
    }
  };

  private getLineChartData = (): any => {
    const { employmentData, showByEducation } = this.state;
    
    // Colors for different data series
    const colors = {
      highSchool: { bg: 'rgba(255, 99, 132, 0.2)', border: 'rgba(255, 99, 132, 1)' },
      college: { bg: 'rgba(54, 162, 235, 0.2)', border: 'rgba(54, 162, 235, 1)' },
      university: { bg: 'rgba(255, 206, 86, 0.2)', border: 'rgba(255, 206, 86, 1)' },
      postGraduate: { bg: 'rgba(75, 192, 192, 0.2)', border: 'rgba(75, 192, 192, 1)' },
      ontario: { bg: 'rgba(153, 102, 255, 0.2)', border: 'rgba(153, 102, 255, 1)' },
      quebec: { bg: 'rgba(255, 159, 64, 0.2)', border: 'rgba(255, 159, 64, 1)' },
      bc: { bg: 'rgba(199, 199, 199, 0.2)', border: 'rgba(199, 199, 199, 1)' },
      alberta: { bg: 'rgba(83, 102, 255, 0.2)', border: 'rgba(83, 102, 255, 1)' }
    };
    
    if (showByEducation) {
      return {
        labels: employmentData.map(data => data.month),
        datasets: [
          {
            label: 'High School',
            data: employmentData.map(data => data.highSchool),
            backgroundColor: colors.highSchool.bg,
            borderColor: colors.highSchool.border,
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointRadius: 3,
          },
          {
            label: 'College',
            data: employmentData.map(data => data.college),
            backgroundColor: colors.college.bg,
            borderColor: colors.college.border,
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointRadius: 3,
          },
          {
            label: 'University',
            data: employmentData.map(data => data.university),
            backgroundColor: colors.university.bg,
            borderColor: colors.university.border,
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointRadius: 3,
          },
          {
            label: 'Post Graduate',
            data: employmentData.map(data => data.postGraduate),
            backgroundColor: colors.postGraduate.bg,
            borderColor: colors.postGraduate.border,
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointRadius: 3,
          }
        ]
      };
    } else {
      // If not showing by education, simulate provincial data instead
      // This would be replaced with actual data from the API
      return {
        labels: employmentData.map(data => data.month),
        datasets: [
          {
            label: 'Ontario',
            data: employmentData.map(() => 70 + Math.random() * 15),
            backgroundColor: colors.ontario.bg,
            borderColor: colors.ontario.border,
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointRadius: 3,
          },
          {
            label: 'Quebec',
            data: employmentData.map(() => 65 + Math.random() * 15),
            backgroundColor: colors.quebec.bg,
            borderColor: colors.quebec.border,
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointRadius: 3,
          },
          {
            label: 'British Columbia',
            data: employmentData.map(() => 68 + Math.random() * 15),
            backgroundColor: colors.bc.bg,
            borderColor: colors.bc.border,
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointRadius: 3,
          },
          {
            label: 'Alberta',
            data: employmentData.map(() => 67 + Math.random() * 15),
            backgroundColor: colors.alberta.bg,
            borderColor: colors.alberta.border,
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointRadius: 3,
          }
        ]
      };
    }
  };

  private getLineOptions = (): any => {
    const { showByEducation } = this.state;
    const chartTitle = showByEducation ? 
      'Employment Rate by Education Level' : 
      'Employment Rate by Province';
    
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
            text: 'Month (2023)',
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
        
        {!showByEducation && (
          <div className="mb-4">
            <label htmlFor="province-select" className="block text-gray-700 font-semibold mb-2">
              Filter by Province:
            </label>
            <select
              id="province-select"
              className="p-2 border border-gray-300 rounded"
              onChange={this.handleProvinceChange}
              value={this.state.selectedProvince || ''}
            >
              <option value="">All Provinces</option>
              <option value="1">Ontario</option>
              <option value="2">Quebec</option>
              <option value="3">British Columbia</option>
              <option value="4">Alberta</option>
            </select>
          </div>
        )}
        
        <div style={{ height: '400px', width: '100%', maxWidth: '900px', margin: '0 auto' }}>
          <Line 
            key={chartKey}
            data={this.getLineChartData()} 
            options={this.getLineOptions()}
            id="employment-chart-container"
          />
        </div>

        {/* Description Box */}
        <div className="mt-4">
          <label htmlFor="chart-description" className="block text-gray-700 font-semibold mb-2">
            Data Summary:
          </label>
          <textarea
            id="chart-description"
            className="w-full p-2 border-2 border-[#1ed1d6] rounded-lg resize-none text-[rgba(0,65,187,0.8)] sans-serif-text"
            rows={5}
            style={{ minHeight: '150px'}}
            value={description}
            readOnly
          />
        </div>
      </div>
    );
  }
}

export default LineChartEmployment;