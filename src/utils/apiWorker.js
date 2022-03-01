import config from './config.json'
import axios from 'axios';
const API_BASE_URL = 'https://changenow.io/api/v1';

const API_KEY = config.api_key;

export const getAllCurrencies = async () => {
  const res = await axios.get(`${API_BASE_URL}/currencies?active=true`);
  return res.data;
}

export const exchangeAmount = async (fromTo, amount = 1) => {
  const res = await axios.get(`${API_BASE_URL}/exchange-amount/${amount}/${fromTo}?api_key=${API_KEY}`);
  return res.data;
}

export const availableCurrencies = async (currency) => {
  const res = await axios.get(`${API_BASE_URL}/currencies-to/${currency}`);
  return res.data;
}

export const minilalExchangeAmount = async (fromTo) => {
  const res = await axios.get(`${API_BASE_URL}/min-amount/${fromTo}`);
  return res.data;
}

export const createExchange = async (params = {}) => {
  const res = await axios.post(`${API_BASE_URL}/min-amount/${API_KEY}`, params);
  return res.data;
}

export const getCurrencyInfo = async (ticker) => {
  const res = await axios.get(`${API_BASE_URL}/currencies/${ticker}`);
  return res.data;
}

export const createTransaction = async (params) => {
  const res = await axios.post(`${API_BASE_URL}/transactions/${API_KEY}`, params);
  return res.data;
}

export const getTransactionStatus = async (id) => {
  const res = await axios.get(`${API_BASE_URL}/transactions/${id}/${API_KEY}`);
  return res.data;
}