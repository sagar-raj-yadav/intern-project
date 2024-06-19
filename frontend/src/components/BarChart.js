import React, { useEffect, useState } from 'react';
import { fetchBarChartData } from '../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const CustomBarChart = ({ month }) => {
    const [barChartData, setBarChartData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchBarChartData(month);
                setBarChartData(response.data);
            } catch (error) {
                console.error('Error fetching bar chart data:', error);
            }
        };

        fetchData();
    }, [month]);

    if (!barChartData) return <div>Loading bar chart data...</div>;

    return (
        <div>
            <h2><u>Bar Chart</u></h2>
            <BarChart width={600} height={300} data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
        </div>
    );
};

export default CustomBarChart;
