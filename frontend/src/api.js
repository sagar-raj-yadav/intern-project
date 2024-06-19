import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';
export const fetchTransactions = async (month, search, page, perPage) => {
    const params = {
        month,
        search,
        page,
        perPage
    };
    
    if (month) {
        params.month = new Date(month).toISOString().slice(0, 10);
    }

    const response = await axios.get(`${API_BASE_URL}/transactions`, { params });
    return response;
};

export const fetchStatistics = (month) => {
    return axios.get(`${API_BASE_URL}/statistics`, { params: { month } });
};

export const fetchBarChartData = (month) => {
    return axios.get(`${API_BASE_URL}/bar-chart`, { params: { month } });
};

export const fetchPieChartData = (month) => {
    return axios.get(`${API_BASE_URL}/pie-chart`, { params: { month } });
};

export const fetchCombinedData = (month) => {
    return axios.get(`${API_BASE_URL}/combined-data`, { params: { month } });
};
