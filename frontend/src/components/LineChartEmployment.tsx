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

// Define interface for labour market data
interface LabourMarketRecord {
  id: number;
  province: number;
  education_level: number;
  labour_force_status: number;
}

interface LineChartState {
  loading: boolean;
  error: string | null;
  chartKey: number;
  labourData: LabourMarketRecord[];
}

interface LineChartProps {}

class LineChartEmployment extends Component<LineChartProps, LineChartState> {
  // Province mapping
  private provinceNames: Record<number, string> = {
    24: 'Quebec',
    35: 'Ontario',
    48: 'Alberta',
    59: 'British Columbia'
  };

  // Education level mapping
  private educationNames: Record<number, string> = {
    0: '0 to 8 years',
    1: 'Some high school',
    2: 'High school graduate',
    3: 'Some postsecondary',
    4: 'Postsecondary certificate or diploma',
    5: "Bachelor's degree",
    6: "Above bachelor's degree"
  };

  public state: LineChartState = {
    loading: true,
    error: null,
    chartKey: Date.now(),
    labourData: []
  };

  public componentDidMount(): void {
    this.fetchData();
  }

  public componentWillUnmount(): void {
    const chartInstance = ChartJS.getChart("employment-chart-container");
    if (chartInstance) {
      chartInstance.destroy();
    }
  }

  private readonly fetchData = async (): Promise<void> => {
    try {
      const response = await fetch('/api/labourMarket');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: LabourMarketRecord[] = await response.json();
      console.log('Raw labour market data:', data);

      // Filter data for the four provinces
      const filteredData = data.filter(record =>
        [24, 35, 48, 59].includes(record.province)
      );

      console.log('Filtered data:', filteredData);

      this.setState({
        labourData: filteredData,
        loading: false,
        error: null,
        chartKey: Date.now()
      });
    } catch (err) {
      console.error('Error fetching labour market data:', err);
      this.setState({
        error: err instanceof Error ? err.message : "Unexpected error",
        loading: false
      });
    }
  };

  private calculateEmploymentRates(data: LabourMarketRecord[]) {
    const provinceEducationCounts: Record<number, Record<number, { employed: number; labourForce: number }>> = {};

    // Initialize structure
    Object.keys(this.provinceNames).forEach(provinceId => {
      const province = parseInt(provinceId);
      provinceEducationCounts[province] = {};

      Object.keys(this.educationNames).forEach(educationId => {
        const education = parseInt(educationId);
        provinceEducationCounts[province][education] = { employed: 0, labourForce: 0 };
      });
    });

    // Process data
    data.forEach(record => {
      const { province, education_level, labour_force_status } = record;

      if (!provinceEducationCounts[province] || !provinceEducationCounts[province][education_level]) {
        return;
      }

      // Count labour force participants
      if ([1, 2, 3].includes(labour_force_status)) {
        provinceEducationCounts[province][education_level].labourForce += 1;

        // Count employed participants
        if ([1, 2].includes(labour_force_status)) {
          provinceEducationCounts[province][education_level].employed += 1;
        }
      }
    });

    // Calculate employment rates
    const employmentRates: Record<number, Record<number, number>> = {};
    Object.keys(provinceEducationCounts).forEach(provinceId => {
      const province = parseInt(provinceId);
      employmentRates[province] = {};

      Object.keys(provinceEducationCounts[province]).forEach(educationId => {
        const education = parseInt(educationId);
        const { employed, labourForce } = provinceEducationCounts[province][education];

        employmentRates[province][education] =
          labourForce > 0 ? (employed / labourForce) * 100 : 0;
      });
    });

    console.log('Calculated employment rates:', employmentRates);
    return employmentRates;
  }

  private getLineChartData = (): any => {
    const { labourData } = this.state;
    const employmentRates = this.calculateEmploymentRates(labourData);

    // Define colors for provinces
    const provinceColors = {
      24: { bg: 'rgba(54, 162, 235, 0.2)', border: 'rgba(54, 162, 235, 1)' }, // Quebec
      35: { bg: 'rgba(153, 102, 255, 0.2)', border: 'rgba(153, 102, 255, 1)' }, // Ontario
      48: { bg: 'rgba(0, 255, 247, 0.5)', border: 'rgba(0, 255, 247, 1)' }, // Alberta
      59: { bg: 'rgba(0, 65, 187, 0.5)', border: 'rgba(0, 65, 187, 1)' } // BC
    };

    // Create datasets
    const datasets = Object.entries(this.provinceNames).map(([provinceId, provinceName]) => {
      const province = parseInt(provinceId);

      const data = Object.keys(this.educationNames).map(educationId => {
        const education = parseInt(educationId);
        return employmentRates[province]?.[education] || 0;
      });

      return {
        label: provinceName,
        data,
        backgroundColor: provinceColors[province].bg,
        borderColor: provinceColors[province].border,
        borderWidth: 2,
        tension: 0.4,
        fill: false,
        pointRadius: 4
      };
    });

    return {
      labels: Object.values(this.educationNames),
      datasets
    };
  };

  private getLineOptions = (): any => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Employment Rate by Education Level Across Provinces',
          font: {
            size: 20,
            family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
            weight: 'bold'
          }
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
            label: function (context: any) {
              return `${context.dataset.label}: ${context.raw.toFixed(1)}%`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          min: 0,
          max: 100,
          title: {
            display: true,
            text: 'Employment Rate (%)',
            font: {
              weight: 'bold'
            }
          },
          ticks: {
            callback: function (value: any) {
              return value + '%';
            }
          }
        },
        x: {
          title: {
            display: true,
            text: 'Education Levels',
            font: {
              weight: 'bold'
            }
          }
        }
      }
    };
  };

  public render(): React.JSX.Element {
    const { loading, error, chartKey } = this.state;

    if (loading) {
      return <div className="text-center text-gray-600">Loading...</div>;
    }

    return (
      <div className="border-2 border-[#1ed1d6] rounded-lg shadow-md p-4">
        {error && <div className="error-banner bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}

        <div style={{ height: '400px', width: '100%', maxWidth: '900px', margin: '0 auto' }}>
          <Line key={chartKey} data={this.getLineChartData()} options={this.getLineOptions()} id="employment-chart-container" />
        </div>
      </div>
    );
  }
}

export default LineChartEmployment;