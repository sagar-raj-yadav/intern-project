const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const { isValidDate } = require('./utils.js'); 
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://sagarrajyadav2002:internship@cluster0.6r0d2yb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define Mongoose Schemas
const transactionSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    category: String,
    sold: Boolean,
    dateOfSale: { type: Date, required: true }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

// API to initialize the database
app.get('/api/init', async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const transactions = response.data;

        // Insert the fetched data into MongoDB
        await Transaction.deleteMany({});
        await Transaction.insertMany(transactions);

        res.status(200).send('Database initialized with seed data');
    } catch (error) {
        console.error('Error initializing database:', error);
        res.status(500).send('Error initializing database');
    }
});
app.get('/api/transactions', async (req, res) => {
    const { month, search, page = 1, perPage = 10 } = req.query;
    const query = {};

    if (month && isValidDate(month)) {
        const startDate = new Date(month);
        const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
        query.dateOfSale = { $gte: startDate, $lte: endDate };
    } else if (month) {
        return res.status(400).json({ error: 'Invalid date format' });
    }

    if (search) {
        query.$or = [
            { title: new RegExp(search, 'i') },
            { description: new RegExp(search, 'i') },
            { category: new RegExp(search, 'i') }
        ];
    }

    try {
        const transactions = await Transaction.find(query)
            .skip((page - 1) * perPage)
            .limit(parseInt(perPage));
        res.json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Error fetching transactions' });
    }
});

// API for statistics
app.get('/api/statistics', async (req, res) => {
    try {
        const { month } = req.query;
        const query = {};

        if (month) {
            const startOfMonth = new Date(month); 
            startOfMonth.setDate(1); 
            const endOfMonth = new Date(startOfMonth);
            endOfMonth.setMonth(endOfMonth.getMonth() + 1);
            query.dateOfSale = { $gte: startOfMonth, $lt: endOfMonth };
        }

        const totalSale = await Transaction.aggregate([
            { $match: query },
            { $group: { _id: null, totalAmount: { $sum: "$price" } } },
        ]);

        const totalSoldItems = await Transaction.countDocuments({ ...query, sold: true });
        const totalNotSoldItems = await Transaction.countDocuments({ ...query, sold: false });

        res.status(200).json({
            totalSale: totalSale.length > 0 ? totalSale[0].totalAmount : 0,
            totalSoldItems,
            totalNotSoldItems,
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).send('Error fetching statistics');
    }
});

// API for bar chart data
app.get('/api/bar-chart', async (req, res) => {
    try {
        const { month } = req.query;
        const query = {};

        if (month) {
            const startOfMonth = new Date(month);
            startOfMonth.setDate(1);
            const endOfMonth = new Date(startOfMonth);
            endOfMonth.setMonth(endOfMonth.getMonth() + 1);
            query.dateOfSale = { $gte: startOfMonth, $lt: endOfMonth };
        }

        const priceRanges = [
            { min: 0, max: 100 },
            { min: 101, max: 200 },
        ];

        const result = await Promise.all(priceRanges.map(async ({ min, max }) => {
            const count = await Transaction.countDocuments({
                ...query,
                price: { $gte: min, $lte: max },
            });
            return { range: `${min}-${max}`, count };
        }));

        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching bar chart data:', error);
        res.status(500).send('Error fetching bar chart data');
    }
});

// API for pie chart data
app.get('/api/pie-chart', async (req, res) => {
    try {
        const { month } = req.query;
        const query = {};

        if (month) {
            const startOfMonth = new Date(month);
            startOfMonth.setDate(1);
            const endOfMonth = new Date(startOfMonth);
            endOfMonth.setMonth(endOfMonth.getMonth() + 1);
            query.dateOfSale = { $gte: startOfMonth, $lt: endOfMonth };
        }

        const categories = await Transaction.aggregate([
            { $match: query },
            { $group: { _id: "$category", count: { $sum: 1 } } },
        ]);

        res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching pie chart data:', error);
        res.status(500).send('Error fetching pie chart data');
    }
});

// API to fetch combined data
app.get('/api/combined-data', async (req, res) => {
    try {
        const { month } = req.query;
        const baseUrl = `http://localhost:${PORT}`;
        
        const [statisticsResponse, barChartResponse, pieChartResponse] = await Promise.all([
            axios.get(`${baseUrl}/api/statistics`, { params: { month } }).catch((error) => {
                throw new Error(`Error fetching statistics: ${error.message}`);
            }),
            axios.get(`${baseUrl}/api/bar-chart`, { params: { month } }).catch((error) => {
                throw new Error(`Error fetching bar chart data: ${error.message}`);
            }),
            axios.get(`${baseUrl}/api/pie-chart`, { params: { month } }).catch((error) => {
                throw new Error(`Error fetching pie chart data: ${error.message}`);
            }),
        ]);

        const combinedData = {
            statistics: statisticsResponse.data,
            barChart: barChartResponse.data,
            pieChart: pieChartResponse.data,
        };

        res.status(200).json(combinedData);
    } catch (error) {
        console.error('Error fetching combined data:', error);
        res.status(500).send('Error fetching combined data');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
