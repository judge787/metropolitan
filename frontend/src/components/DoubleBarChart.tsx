import React, { Component } from 'react';
import { getStartsByCensusArea, getCompletionsByCensusArea } from "../services/HousingDataService";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title);

interface HousingChartState {
    torontoStarts: number | null;
    hamiltonStarts: number | null;
    torontoCompletions: number | null;
    hamiltonCompletions: number | null;
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
        torontoStarts: null,
        hamiltonStarts: null,
        torontoCompletions: null,
        hamiltonCompletions: null,
        loading: true,
        error: null,
        chartKey: Date.now(),
        showCompletions: this.props.showCompletions,
        description: "This interactive chart compares housing metrics between Toronto and Hamilton, providing valuable insights into regional development. The Housing Starts view displays the number of new construction projects initiated in each city, while the Housing Completions view shows the number of residential projects that reached completion. By toggling between these views, users can analyze the relationship between project initiation and completion rates, helping urban planners, real estate investors, and policymakers understand construction timelines, market efficiency, and housing supply trends."
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
            const results = await Promise.allSettled([
                getStartsByCensusArea("Toronto"),
                getStartsByCensusArea("Hamilton"),
                getCompletionsByCensusArea("Toronto"),
                getCompletionsByCensusArea("Hamilton")
            ]);

            const errors: string[] = [];
            const newData: (number | null)[] = [null, null, null, null];

            results.forEach((result, index) => {
                if (result.status === "fulfilled") {
                    newData[index] = result.value;
                } else {
                    const area = index % 2 === 0 ? "Toronto" : "Hamilton";
                    const type = index < 2 ? "Starts" : "Completions";
                    errors.push(`${area} ${type}: ${result.reason.message || "Unknown error"}`);
                }
            });

            this.setState({
                torontoStarts: newData[0],
                hamiltonStarts: newData[1],
                torontoCompletions: newData[2],
                hamiltonCompletions: newData[3],
                error: errors.length > 0 ? `Partial data: ${errors.join("; ")}` : null,
                loading: false,
                chartKey: Date.now()
            });
        } catch (err) {
            this.setState({
                error: err instanceof Error ? err.message : "Unexpected error",
                loading: false
            });
        }
    };

    private getChartData = (): any => {
        const { torontoStarts, hamiltonStarts, torontoCompletions, hamiltonCompletions, showCompletions } = this.state;
        
        const data = showCompletions 
            ? [torontoCompletions || 0, hamiltonCompletions || 0]
            : [torontoStarts || 0, hamiltonStarts || 0];
        
        const label = showCompletions ? 'Housing Completions' : 'Housing Starts';
        const color = showCompletions 
            ? { bg: 'rgba(54, 162, 235, 0.5)', border: 'rgba(54, 162, 235, 1)' }
            : { bg: 'rgba(255, 99, 132, 0.5)', border: 'rgba(255, 99, 132, 1)' };

        return {
            labels: ['Toronto', 'Hamilton'],
            datasets: [
                {
                    label: label,
                    data: data,
                    backgroundColor: color.bg,
                    borderColor: color.border,
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

        const chartTitle = showCompletions ? 'Housing Completions Comparison' : 'Housing Starts Comparison';
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
                                        text: 'Census Metropolitan Area',
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