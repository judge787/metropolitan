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
    selectedMonth: number | null; // Add selected month state
    availableMonths: number[]; // Track available months for the dropdown
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

    // Handle month selection change
    private readonly handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        const value = event.target.value;
        const selectedMonth = value === "all" ? null : parseInt(value, 10);
        
        this.setState({
            selectedMonth,
            chartKey: Date.now()
        });
    };

    private readonly fetchData = async (): Promise<void> => {
        try {
            // Fetch all housing data
            const response = await fetch('/api/housingStats');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const allData = await response.json();
            console.log('Raw data from API:', allData); // Debug log to see what data we're receiving
            
            // Process the data to group by month
            const startsDataMap = new Map<number, MonthlyData>();
            const completionsDataMap = new Map<number, MonthlyData>();
            const monthsSet = new Set<number>();
            
            allData.forEach((item: any) => {
                // Handle potentially missing month data - default to 1 if not present
                const month = item.month !== null && item.month !== undefined ? 
                    parseInt(item.month, 10) : 1;
                
                // Add to available months
                monthsSet.add(month);
                
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
            const availableMonths = Array.from(monthsSet).sort((a, b) => a - b);
            
            console.log('Processed starts data:', startsData);
            console.log('Processed completions data:', completionsData);
            console.log('Available months:', availableMonths);
            
            this.setState({
                startsData,
                completionsData,
                availableMonths,
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
            <div className="border-2 border-[#1ed1d6] rounded-lg shadow-md p-4">
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
                                        text: selectedMonth === null ? 'Month' : 'Month',
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
                    <label htmlFor="chart-description" className="block text-[rgba(0,65,187,0.8)] font-semibold mb-2 text-3xl" style={{ fontFamily: 'Others' }}>
                        Data Summary
                    </label>
                    <textarea
                        id="chart-description"
                        className="w-full p-2 border-2 border-[#1ed1d6] rounded-lg resize-none text-[rgba(0,65,187,0.8)]" style={{ fontFamily: 'Sans-Serif' }}
                        rows={6}
                        value={description}
                        readOnly
                    />
                </div>
            </div>
        );
    }
}

export default HousingChart;