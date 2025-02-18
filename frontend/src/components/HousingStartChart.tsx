import React, { useEffect, useState } from 'react';
import { getStartsByCensusArea } from "../services/HousingDataService"; // Updated import
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title);

const HousingStartChart: React.FC = () => {
    const [torontoStarts, setTorontoStarts] = useState<number | null>(null);
    const [hamiltonStarts, setHamiltonStarts] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [chartKey, setChartKey] = useState(Date.now()); // Key to force remount
    const [description, setDescription] = useState(
        "The chart above compares housing starts in Toronto and Hamilton, highlighting regional growth trends. Housing starts show new residential construction, providing data on urban expansion, economic activity, and housing supply. By visualizing this data, analysts can evaluate development patterns, compare market dynamics, and support strategic planning for housing and infrastructure developments."
    );

    useEffect(() => {
        const fetchData = async () => {
            try {
                const results = await Promise.allSettled([
                    getStartsByCensusArea("Toronto"), // Fetching total starts for Toronto
                    getStartsByCensusArea("Hamilton") // Fetching total starts for Hamilton
                ]);

                const errors: string[] = [];
                const newData: (number | null)[] = [null, null];
                
                results.forEach((result, index) => {
                    if (result.status === "fulfilled") {
                        newData[index] = result.value; // Store the total starts
                    } else {
                        const area = index === 0 ? "Toronto" : "Hamilton";
                        errors.push(`${area}: ${result.reason.message || "Unknown error"}`);
                    }
                });

                setTorontoStarts(newData[0]);
                setHamiltonStarts(newData[1]);

                if (errors.length > 0) {
                    setError(`Partial data: ${errors.join("; ")}`);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unexpected error");
            } finally {
                setLoading(false);
                setChartKey(Date.now()); // Update key to force chart remount
            }
        };

        fetchData();

        // Cleanup function
        return () => {
            // Explicitly destroy chart instance
            const chartInstance = ChartJS.getChart("chart-container");
            if (chartInstance) {
                chartInstance.destroy();
            }
        };
    }, []);

    const getChartData = () => {
        return {
            labels: ['Toronto', 'Hamilton'],
            datasets: [
                {
                    label: 'Housing Starts',
                    data: [
                        torontoStarts || 0, // Use the total starts for Toronto
                        hamiltonStarts || 0, // Use the total starts for Hamilton
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

    const chartOptions = {
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
    };

    if (loading) {
        return <div className="text-center text-gray-600">Loading...</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            {error && <div className="error-banner bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
            <div style={{ height: '400px', width: '100%' }}>
                <Bar 
                    key={chartKey}
                    data={getChartData()} 
                    options={chartOptions}
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
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
        </div>
    );
};

export default HousingStartChart;
