import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { MonthlyData, fetchProcessedHousingData } from '../services/HousingDataService';

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


interface HousingChartState {
    startsData: MonthlyData[];
    completionsData: MonthlyData[];
    loading: boolean;
    error: string | null;
    chartKey: number;
    showCompletions: boolean;
    description: string;
    selectedMonth: number | null;
    availableMonths: number[];
}

interface HousingChartProps {
    showCompletions: boolean;
    onToggleView: () => void;
}

class HousingChart extends Component<HousingChartProps, HousingChartState> {
    public state: HousingChartState = {
        startsData: [],
        completionsData: [],
        loading: true,
        error: null,
        chartKey: Date.now(),
        showCompletions: this.props.showCompletions,
        description: "This interactive chart compares housing metrics between Toronto and Hamilton by month, providing valuable insights into regional development. The Housing Starts view displays the number of new construction projects initiated in each city, while the Housing Completions view shows the number of residential projects that reached completion. By toggling between these views, users can analyze the relationship between project initiation and completion rates, helping urban planners, real estate investors, and policymakers understand construction timelines, market efficiency, and housing supply trends.",
        selectedMonth: null, // Default to showing all months
        availableMonths: []
    };

    public componentDidMount(): void {
        this.loadData();
    }

    public componentDidUpdate(prevProps: HousingChartProps): void {
        if (prevProps.showCompletions !== this.props.showCompletions) {
            this.setState({
                showCompletions: this.props.showCompletions,
                chartKey: Date.now()
            });
        }
    }

    public componentWillUnmount(): void {
        // Explicitly destroy chart instance
        const chartInstance = ChartJS.getChart("chart-container");
        if (chartInstance) {
            chartInstance.destroy();
        }
    }

    // Handle month selection change
    private readonly handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        const value = event.target.value;
        const selectedMonth = value === "all" ? null : parseInt(value, 10);
        
        this.setState({
            selectedMonth,
            chartKey: Date.now()
        });
    };

    private readonly loadData = async (): Promise<void> => {
        try {
            const data = await fetchProcessedHousingData();
            
            this.setState({
                startsData: data.startsData,
                completionsData: data.completionsData,
                availableMonths: data.availableMonths,
                loading: false,
                error: null,
                chartKey: Date.now()
            });
        } catch (err) {
            console.error('Error loading housing data:', err);
            this.setState({
                error: err instanceof Error ? err.message : "Unexpected error",
                loading: false
            });
        }
    };

    private readonly getChartData = (): any => {
        const { startsData, completionsData, showCompletions, selectedMonth } = this.state;
        let data = showCompletions ? completionsData : startsData;
        
        // Filter by selected month if one is selected
        if (selectedMonth !== null) {
            data = data.filter(item => item.month === selectedMonth);
        }
        
        // Convert month numbers to names
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        return {
            labels: data.map(item => {
                // Ensure month is treated as a number and is within valid range
                const monthIndex = typeof item.month === 'number' ? 
                    Math.min(Math.max(Math.floor(item.month) - 1, 0), 11) : 0;
                return monthNames[monthIndex] || `Month ${item.month}`;
            }),
            datasets: [
                {
                    label: 'Toronto',
                    data: data.map(item => item.toronto || 0),
                    backgroundColor: 'rgba(0, 255, 247, 0.5)',
                    borderColor: 'rgba(0, 255, 247, 1)',
                    borderWidth: 1,
                },
                {
                    label: 'Hamilton',
                    data: data.map(item => item.hamilton || 0),
                    backgroundColor: 'rgba(0, 65, 187, 0.5)',
                    borderColor: 'rgba(0, 65, 187, 1)',
                    borderWidth: 1,
                }
            ],
        };
    };

    public render(): React.JSX.Element {
        const { loading, error, chartKey, description, showCompletions, availableMonths, selectedMonth } = this.state;
    
        if (loading) {
            return <div className="text-center text-gray-600">Loading...</div>;
        }
        let chartTitle;
        let yAxisTitle;
    
        if (showCompletions) {
            chartTitle = selectedMonth === null 
                ? 'All Months Housing Completions Comparison' 
                : 'Monthly Housing Completions Comparison';
            yAxisTitle = 'Number of Housing Completions';
        } else {
            chartTitle = selectedMonth === null 
                ? 'All Months Housing Starts Comparison' 
                : 'Monthly Housing Starts Comparison';
            yAxisTitle = 'Number of Housing Starts';
        }
        
        // Convert month numbers to names for the dropdown
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                           'July', 'August', 'September', 'October', 'November', 'December'];
    
        return (
            <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Chart Container */}
                <div className="flex-1 border-2 border-[#1ed1d6] rounded-lg shadow-md p-4">
                    {error && <div className="error-banner bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
    
                    <div className="mb-4 flex flex-wrap gap-4 items-center justify-between">
                        <button 
                            onClick={this.props.onToggleView}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
                        >
                            {showCompletions ? "Show Housing Starts" : "Show Housing Completions"}
                        </button>
                        
                        <div className="flex items-center">
                            <label htmlFor="month-filter" className="mr-2 font-semibold text-black">Filter by Month:</label>
                            <select
                                id="month-filter"
                                value={selectedMonth === null ? "all" : selectedMonth.toString()}
                                onChange={this.handleMonthChange}
                                className="p-2 border border-gray-300 rounded-lg bg-white text-black"
                            >
                                <option value="all">All Months</option>
                                {availableMonths.map(month => (
                                    <option key={month} value={month.toString()}>
                                        {monthNames[month - 1] || `Month ${month}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <div style={{ height: '400px', width: '100%' }}>
                        <Bar 
                            key={chartKey}
                            data={this.getChartData()} 
                            options={{
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
                                        display: true,
                                        position: 'top',
                                    }
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                            text: yAxisTitle,
                                            font: {
                                                size: 16,
                                                family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                                                weight: 'normal',
                                            },
                                        },
                                    },
                                    x: {
                                        title: {
                                            display: true,
                                            text: 'Month',
                                            font: {
                                                size: 16,
                                                family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                                                weight: 'normal',
                                            },
                                        },
                                    },
                                },
                            }}
                            id="chart-container"
                        />
                    </div>
    
                    {/* Description Box */}
                    <div className="mt-4">
                        <label htmlFor="chart-description" className="block text-blue-700 font-semibold mb-2 text-xl">
                            Data Summary
                        </label>
                        <textarea
                            id="chart-description"
                            className="w-full p-2 border-2 border-[#1ed1d6] rounded-lg resize-none text-blue-700"
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

export default HousingChart;
