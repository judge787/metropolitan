import React, { Component } from 'react';
import { getStartsByCensusArea } from "../services/HousingDataService";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title);

interface HousingStartChartState {
    torontoStarts: number | null;
    hamiltonStarts: number | null;
    loading: boolean;
    error: string | null;
    chartKey: number;
    description: string;
}

class HousingStartChart extends Component<{}, HousingStartChartState> {
    public state: HousingStartChartState = {
        torontoStarts: null,
        hamiltonStarts: null,
        loading: true,
        error: null,
        chartKey: Date.now(),
        description: "The chart above compares housing starts in Toronto and Hamilton, highlighting regional growth trends. Housing starts show new residential construction, providing data on urban expansion, economic activity, and housing supply. By visualizing this data, analysts can evaluate development patterns, compare market dynamics, and support strategic planning for housing and infrastructure developments."
    };

    public componentDidMount(): void {
        this.fetchData();
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
                getStartsByCensusArea("Hamilton")
            ]);

            const errors: string[] = [];
            const newData: (number | null)[] = [null, null];

            results.forEach((result, index) => {
                if (result.status === "fulfilled") {
                    newData[index] = result.value;
                } else {
                    const area = index === 0 ? "Toronto" : "Hamilton";
                    errors.push(`${area}: ${result.reason.message || "Unknown error"}`);
                }
            });

            this.setState({
                torontoStarts: newData[0],
                hamiltonStarts: newData[1],
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
        const { torontoStarts, hamiltonStarts } = this.state;
        return {
            labels: ['Toronto', 'Hamilton'],
            datasets: [
                {
                    label: 'Housing Starts',
                    data: [
                        torontoStarts || 0,
                        hamiltonStarts || 0,
                    ],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                    ],
                    borderWidth: 1,
                },
            ],
        };
    };

    public render(): React.JSX.Element {
        const { loading, error, chartKey, description } = this.state;

        if (loading) {
            return <div className="text-center text-gray-600">Loading...</div>;
        }

        return (
            <div className="bg-white rounded-lg shadow-md p-4">
                {error && <div className="error-banner bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
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
                                    text: 'Housing Starts Comparison',
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
                                        text: 'Number of Housing Starts',
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

export default HousingStartChart;
