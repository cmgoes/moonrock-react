const API_URL = 'https://changenow.io/api/v1/';
const API_KEY = '595ecc7332e0fe83d50353ff6dd27fbc95a711258cd6e621a204a5948f88a27f'

const moonswap = () => {
    const apiCall = async (url, params) => {
        try {
            const res = await fetch(url, params);
            const responseData = await res.json();
            if (!res.ok) {
                throw responseData;
            }
            return responseData;
        } catch (error) {
            throw error;
        }
    };
      
    async function apiGet(url, params = {}) {
        const searchParams = new URLSearchParams('');
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                searchParams.set(key, String(value));
            }
        });
      
        const requsetUrl = `${url}?${searchParams.toString()}`;
        const data = await apiCall(requsetUrl, { method: 'GET' });
        return data;
    }
      
    async function apiPost(url, body = {}) {
        const data = await apiCall(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(body)
        });
        return data;
    }
      
    const cnApiClinet = {
        'CURRENCIES': async function getCurrencies({ active, fixedRate }, callback) {
            const url = `${API_URL}currencies`;
            const res = await apiGet(url, { active, fixedRate });
            if (!!callback && typeof callback === 'function') {
                callback(res);
            }
            return res;
        },
        'CURRENCIES_TO': async function getCurrenciesTo({ ticker, fixedRate }, callback) {
            const url = `${API_URL}currencies-to/${String(ticker).toLowerCase()}`;
            const res = await apiGet(url, { fixedRate });
            if (!!callback && typeof callback === 'function') {
                callback(res);
            }
            return res;
        },
        'CURRENCY_INFO': async function getCurrencyInfo({ ticker }, callback) {
            const url = `${API_URL}currencies/${String(ticker).toLowerCase()}`;
            const res = await apiGet(url);
            if (!!callback && typeof callback === 'function') {
                callback(res);
            }
            return res;
        },
        'LIST_OF_TRANSACTIONS': async function getTxLsit(params, callback) {
            const { apiKey = '', from, to, status, limit = 10, offset = 0, dateFrom = '', dateTo = '' } = params;
            const queryParams = { from, to, status, limit, offset, dateFrom, dateTo };
            const url = `${API_URL}transactions/${apiKey}`;
            const res = await apiGet(url, { ...queryParams});
            if (!!callback && typeof callback === 'function') {
                callback(res);
            }
            return res;
        },
        'TX_STATUS': async function getTxStatus({ id, apiKey = '' }, callback) {
            const url = `${API_URL}transactions/${id}/${apiKey}`;
            const res = await apiGet(url);
            if (!!callback && typeof callback === 'function') {
                callback(res);
            }
            return res;
        },
        'ESTIMATED': async function getEstimated(params, callback) {
            const { apiKey = '', from, to, amount, fixedRate} = params;
            const fromTo = `${String(from).toLowerCase()}_${String(to).toLowerCase()}`;
            const url = `${API_URL}exchange-amount`;
            const urlParams =  `${fixedRate === true ? '/fixed-rate' : ''}/${amount}/${fromTo}`;
            const requsetUrl = url + urlParams;
            const res = await apiGet(requsetUrl, { api_key: apiKey});
            if (!!callback && typeof callback === 'function') {
                callback(res);
            }
            return res;
        },
        'CREATE_TX': async function createTx(params, callback) {
            const { 
                apiKey = '', from, to, address, amount, extraId, refundAddress, refundExtraId, userId, payload, contactEmail, fixedRate
            } = params;
            const url = `${API_URL}transactions`;
            const urlParams =  `${fixedRate === true ? '/fixed-rate' : ''}/${apiKey}`;
            const requsetUrl = url + urlParams;
            const body = {
                from,
                to,
                address,
                amount,
                extraId: extraId || '',
                refundAddress: refundAddress || '',
                refundExtraId: refundExtraId || '',
                userId: userId || '',
                payload: payload || '',
                contactEmail: contactEmail || ''
            };
            const res = await apiPost(requsetUrl, body);
            if (!!callback && typeof callback === 'function') {
                callback(res);
            }
            return res;
        },
        'PAIRS' : async function getPairs({ includePartners }, callback) {
            const url = `${API_URL}market-info/available-pairs`
            const res = await apiGet(url, { includePartners });
            if (!!callback && typeof callback === 'function') {
                callback(res);
            }
            return res;
        },
        'FIXED_RATE_PAIRS': async function getFixedRatePairs({ apiKey = '' }, callback) {
            const url = `${API_URL}market-info/fixed-rate/${apiKey}`;
            const res = await apiGet(url);
            if (!!callback && typeof callback === 'function') {
                callback(res);
            }
            return res;
        },
        'MIN_AMOUNT': async function getMinAmout({ from ,to }, callback) {
            const fromTo = `${String(from).toLowerCase()}_${String(to).toLowerCase()}`;
            const url = `${API_URL}min-amount/${fromTo}`;
            const res = await apiGet(url);
            if (!!callback && typeof callback === 'function') {
                callback(res);
            }
            return res;
        }
    };
    
    async function cnApiWrapper(callName, callPrams, callback) {
        const method = cnApiClinet[callName];
        const params = callPrams || {};
        if (!method) {
            const err = new Error(`Undefined api method: ${callName}`);
            throw err;
        }
        const res = await method(params, callback);
        return res;
    }

    return cnApiWrapper
}

export default moonswap;