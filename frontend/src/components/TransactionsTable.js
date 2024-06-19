import React, { useEffect, useState } from 'react';
import { fetchTransactions } from '../api';

const TransactionsTable = ({ month }) => {
    const [transactions, setTransactions] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchTransactions(month, search, page, perPage);
                setTransactions(response.data);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchData();
    }, [month, search, page, perPage]);


    const tableStyle = {
        borderCollapse: 'collapse',
        width: '100%',
    };

    const thStyle = {
        border: '1px solid black',
        padding: '8px',
        textAlign: 'left',
        backgroundColor: '#f2f2f2',
    };

    const tdStyle = {
        border: '1px solid black',
        padding: '8px',
        textAlign: 'left',
    };

    const butttton = {
        margin:"20px 0 20px 20px",
        padding:"10px",
        fontSize:"18px",
        borderRadius:"8px",
        cursor:"pointer"
    };

    return (
        <div>
            <h2><u>Transactions Table</u></h2>
            <div>
                <input
                    type="text"
                    placeholder="Search by title, description"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ marginBottom: '20px',padding:"10px",width:"400px",fontSize:"15px",borderRadius:"8px" }}
                />
            </div>
            <table style={tableStyle}>
                <thead>
                    <tr >
                        <th style={thStyle}>ID</th>
                        <th style={thStyle}>Title</th>
                        <th style={thStyle}>Description</th>
                        <th style={thStyle}>Price</th>
                        <th style={thStyle}>Date of Sale</th>
                        <th style={thStyle}>Category</th>
                        <th style={thStyle}>Sold</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction) => (
                        <tr key={transaction.id}>
                            <td style={tdStyle}>{transaction.id}</td>
                            <td style={tdStyle}>{transaction.title}</td>
                            <td style={tdStyle}>{transaction.description}</td>
                            <td style={tdStyle}>{transaction.price}</td>
                            <td style={tdStyle}>{transaction.dateOfSale}</td>
                            <td style={tdStyle}>{transaction.category}</td>
                            <td style={tdStyle}>{transaction.sold ? 'Yes' : 'No'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <button onClick={() => setPage(page - 1)} disabled={page === 1} style={butttton}>Previous</button>
                <button onClick={() => setPage(page + 1)} style={butttton}>Next</button>
            </div>
        </div>
    );
};

export default TransactionsTable;
