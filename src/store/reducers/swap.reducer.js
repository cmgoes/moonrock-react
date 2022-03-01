import {
    CHANGE_FROM_CURRENCY,
    CHANGE_TO_CURRENCY,
    CHANGE_AMOUNT,
    CHANGE_TRANSACTION_ID,
} from 'store/actions/actionTypes';

const initialState = {
    fromCurrency: null,
    toCurrency: null,
    transactionId: null,
    amount: null
}

// eslint-disable-next-line import/no-anonymous-default-export
export default (state=initialState, action) => {
    switch(action.type) {
        case CHANGE_FROM_CURRENCY:
            return {
                ...state,
                fromCurrency: action.payload
            }
        case CHANGE_TO_CURRENCY:
            return {
                ...state,
                toCurrency: action.payload
        }
        case CHANGE_TRANSACTION_ID:
            return {
                ...state,
                transactionId: action.payload
            }
        case CHANGE_AMOUNT:
            return {
                ...state,
                amount: action.payload
            }
                    
        default: 
            return state;
    }
}