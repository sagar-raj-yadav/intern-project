import React, { useEffect, useState } from 'react';
import { fetchStatistics } from '../api';

const Statistics = ({ month }) => {
    const [statistics, setStatistics] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchStatistics(month);
                setStatistics(response.data);
            } catch (error) {
                console.error('Error fetching statistics:', error);
            }
        };

        fetchData();
    }, [month]);

    if (!statistics) return <div>Loading statistics...</div>;

    return (
        <div>
            <h2><u>Statistics</u></h2>
            <p>Total Sale: {statistics.totalSale}</p>
            <p>Total Sold Items: {statistics.totalSoldItems}</p>
            <p>Total Not Sold Items: {statistics.totalNotSoldItems}</p>
        </div>
    );
};

export default Statistics;
