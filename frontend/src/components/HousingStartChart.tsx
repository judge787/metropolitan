import React from 'react';
import { useEffect, useState } from "react";
import { HousingData } from "../types/HousingData";
import { getData } from "../services/HousingDataService";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title);

const HousingStartChart: React.FC = () => {
    const [torontoData, setTorontoData] = useState<HousingData | null>(null);
    const [hamiltonData, setHamiltonData] = useState<HousingData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [chartKey, setChartKey] = useState(Date.now()); // Key to force remount

    useEffect(() => {
        const fetchData = async () => {
            try {
                const results = await Promise.allSettled([
                    getData(13),
                    getData(82)
                ]);

                const errors: string[] = [];
                const newData: (HousingData | null)[] = [null, null];
                
                results.forEach((result, index) => {
                    if (result.status === "fulfilled") {
                        newData[index] = result.value;
                    } else {
                        const area = index === 0 ? "Toronto" : "Hamilton";
                        errors.push(`${area}: ${result.reason.message || "Unknown error"}`);
                    }
                });

                setTorontoData(newData[0]);
                setHamiltonData(newData[1]);

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
            labels: [
                torontoData?.censusArea || 'Toronto',
                hamiltonData?.censusArea || 'Hamilton'
            ],
            datasets: [
                {
                    label: 'Housing Starts',
                    data: [
                        torontoData?.totalStarts || 0,
                        hamiltonData?.totalStarts || 0
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
                    family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif", // Add a font family
                    weight: 'bold', // Use 'bold' instead of a string
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
                        family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif", // Add a font family
                        weight: 'normal', // Use 'normal' instead of a string
                    },
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Census Metropolitan Area',
                    font: {
                        size: 16,
                        family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif", // Add a font family
                        weight: 'normal', // Use 'normal' instead of a string
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
        </div>
    );
};

export default HousingStartChart;
