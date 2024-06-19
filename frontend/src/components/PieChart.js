import React, { useEffect, useState } from 'react';
import { fetchPieChartData } from '../api';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const CustomPieChart = ({ month }) => {
    const [pieChartData, setPieChartData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchPieChartData(month);
                setPieChartData(response.data);
            } catch (error) {
                console.error('Error fetching pie chart data:', error);
            }
        };

        fetchData();
    }, [month]);

    if (!pieChartData) return <div>Loading pie chart data...</div>;

    return (
        <div>
            <h2><u>Pie Chart</u></h2>
            <PieChart width={600} height={300}>
                <Pie
                    data={pieChartData}
                    cx={300}
                    cy={150}
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="_id"
                >
                    {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </div>
    );
};

export default CustomPieChart;
