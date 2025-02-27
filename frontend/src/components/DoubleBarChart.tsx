import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Define interface for month data
interface MonthlyData {
    month: number;
    toronto: number;
    hamilton: number;
}

interface HousingChartState {
    startsData: MonthlyData[];
    completionsData: MonthlyData[];
    loading: boolean;
    error: string | null;
    chartKey: number;
    showCompletions: boolean;
    description: string;
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
        description: "This interactive chart compares housing metrics between Toronto and Hamilton by month, providing valuable insights into regional development. The Housing Starts view displays the number of new construction projects initiated in each city, while the Housing Completions view shows the number of residential projects that reached completion. By toggling between these views, users can analyze the relationship between project initiation and completion rates, helping urban planners, real estate investors, and policymakers understand construction timelines, market efficiency, and housing supply trends."
    };

    public componentDidMount(): void {
        this.fetchData();
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

    private fetchData = async (): Promise<void> => {
        try {
            // Fetch all housing data
            const response = await fetch('/api/data');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const allData = await response.json();
            console.log('Raw data from API:', allData); // Debug log to see what data we're receiving
            
            // Process the data to group by month
            const startsDataMap = new Map<number, MonthlyData>();
            const completionsDataMap = new Map<number, MonthlyData>();
            
            allData.forEach((item: any) => {
                // Handle potentially missing month data - default to 1 if not present
                const month = item.month !== null && item.month !== undefined ? 
                    parseInt(item.month, 10) : 1;
                
                // Debug log for problematic records
                if (item.month === null || item.month === undefined) {
                    console.warn('Record with missing month:', item);
                }
                
                // Process starts data
                if (!startsDataMap.has(month)) {
                    startsDataMap.set(month, {
                        month,
                        toronto: 0,
                        hamilton: 0
                    });
                }
                
                // Process completions data
                if (!completionsDataMap.has(month)) {
                    completionsDataMap.set(month, {
                        month,
                        toronto: 0,
                        hamilton: 0
                    });
                }
                
                // Update data based on census area
                if (item.censusArea === "Toronto") {
                    const existingStartsData = startsDataMap.get(month)!;
                    existingStartsData.toronto += item.totalStarts || 0;
                    startsDataMap.set(month, existingStartsData);
                    
                    const existingCompletionsData = completionsDataMap.get(month)!;
                    existingCompletionsData.toronto += item.totalComplete || 0;
                    completionsDataMap.set(month, existingCompletionsData);
                } else if (item.censusArea === "Hamilton") {
                    const existingStartsData = startsDataMap.get(month)!;
                    existingStartsData.hamilton += item.totalStarts || 0;
                    startsDataMap.set(month, existingStartsData);
                    
                    const existingCompletionsData = completionsDataMap.get(month)!;
                    existingCompletionsData.hamilton += item.totalComplete || 0;
                    completionsDataMap.set(month, existingCompletionsData);
                }
            });
            
            // Convert maps to arrays and sort by month
            const startsData = Array.from(startsDataMap.values()).sort((a, b) => a.month - b.month);
            const completionsData = Array.from(completionsDataMap.values()).sort((a, b) => a.month - b.month);
            
            console.log('Processed starts data:', startsData);
            console.log('Processed completions data:', completionsData);
            
            this.setState({
                startsData,
                completionsData,
                loading: false,
                error: null,
                chartKey: Date.now()
            });
        } catch (err) {
            console.error('Error in fetchData:', err);
            this.setState({
                error: err instanceof Error ? err.message : "Unexpected error",
                loading: false
            });
        }
    };

    private getChartData = (): any => {
        const { startsData, completionsData, showCompletions } = this.state;
        const data = showCompletions ? completionsData : startsData;
        
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
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                },
                {
                    label: 'Hamilton',
                    data: data.map(item => item.hamilton || 0),
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                }
            ],
        };
    };

    public render(): React.JSX.Element {
        const { loading, error, chartKey, description, showCompletions } = this.state;

        if (loading) {
            return <div className="text-center text-gray-600">Loading...</div>;
        }

        const chartTitle = showCompletions ? 'Monthly Housing Completions Comparison' : 'Monthly Housing Starts Comparison';
        const yAxisTitle = showCompletions ? 'Number of Housing Completions' : 'Number of Housing Starts';

        return (
            <div className="bg-white rounded-lg shadow-md p-4">
                {error && <div className="error-banner bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
                <div className="mb-4">
                    <button 
                        onClick={this.props.onToggleView}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
                    >
                        {showCompletions ? "Show Housing Starts" : "Show Housing Completions"}
                    </button>
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
                    <label htmlFor="chart-description" className="block text-gray-700 font-semibold mb-2">
                        Data Summary:
                    </label>
                    <textarea
                        id="chart-description"
                        className="w-full p-2 border border-gray-300 rounded-lg resize-none text-black"
                        rows={4}
                        value={description}
                        readOnly
                    />
                </div>
            </div>
        );
    }
}

export default HousingChart;