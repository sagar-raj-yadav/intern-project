import React, { useEffect, useState } from 'react';
import { fetchCombinedData } from '../api';

const CombinedData = ({ month }) => {
    const [combinedData, setCombinedData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchCombinedData(month);
                setCombinedData(response.data);
            } catch (error) {
                console.error('Error fetching combined data:', error);
            }
        };

        fetchData();
    }, [month]);

    if (!combinedData) return <div>Loading combined data...</div>;

    return (
        <div>
            <h2><u>Combined Data</u></h2>
            <div>
                <h3><u>Statistics</u></h3>
                <p>Total Sale: {combinedData.statistics.totalSale}</p>
                <p>Total Sold Items: {combinedData.statistics.totalSoldItems}</p>
                <p>Total Not Sold Items: {combinedData.statistics.totalNotSoldItems}</p>
            </div>
            <div>
                <h3><u>Bar Chart</u></h3>
                <ul>
                    {combinedData.barChart.map((range) => (
                        <li key={range.range}>
                            {range.range}: {range.count}
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h3><u>Pie Chart</u></h3>
                <ul>
                    {combinedData.pieChart.map((category) => (
                        <li key={category._id}>
                            {category._id}: {category.count}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CombinedData;
