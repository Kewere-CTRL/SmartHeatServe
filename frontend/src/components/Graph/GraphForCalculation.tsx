import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

interface SchedulePoint {
    x: string;
    y: string;
    y_cal: string;
}

interface GraphForCalculationProps {
    schedule: SchedulePoint[];
}

const GraphForCalculation: React.FC<GraphForCalculationProps> = ({ schedule }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);

    const xValues = schedule.map(point => parseFloat(point.x));
    const yValues = schedule.map(point => parseFloat(point.y));
    const yCalValues = schedule.map(point => parseFloat(point.y_cal));

    const minX = Math.min(...xValues) - 10;
    const maxX = Math.max(...xValues) + 10;
    const minY = Math.min(...[...yValues, ...yCalValues]) - 10;
    const maxY = Math.max(...[...yValues, ...yCalValues]) + 10;

    useEffect(() => {
        const ctx = chartRef.current?.getContext('2d');
        if (!ctx) return;

        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: schedule.map(point => point.x),
                datasets: [
                    {
                        label: 'Тпод по графику',
                        data: schedule.map(point => parseFloat(point.y)),
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: false,
                        tension: 0,
                    },
                    {
                        label: 'Тпод расчетная',
                        data: schedule.map(point => parseFloat(point.y_cal)),
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        fill: false,
                        tension: 0,
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: 'График нелинейности здания'
                    }
                },
                scales: {
                    x: {
                        min: minX,
                        max: maxX,
                        type: 'linear',
                        title: {
                            display: false,
                        },
                        ticks: {
                            stepSize: 1,
                            autoSkip: false,
                            maxRotation: 0,
                            minRotation: 0,
                            callback: function(value) {
                                return xValues.includes(value) ? value : '';
                            }
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        min: minY,
                        max: maxY,
                        title: {
                            display: false,
                        },
                        ticks: {
                            stepSize: 5,
                            maxRotation: 0,
                            minRotation: 0,

                        },
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });

        return () => chart.destroy();
    }, [schedule]);

    return <canvas ref={chartRef}/>;
};

export default GraphForCalculation;
