import { Fragment, useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    CircularProgress,
    Card,
    Typography,
    Popover,
    List,
    ListItem,
    Divider,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Link,
    FormControlLabel,
    Checkbox,
} from '@mui/material'
import { makeStyles } from '@mui/styles';
import SearchIcon from '@mui/icons-material/Search';
import {
    getAllCurrencies,
    exchangeAmount,
    minilalExchangeAmount,
    getCurrencyInfo,
    createTransaction,
    getTransactionStatus,
} from 'utils/apiWorker'
import { defaultFrom, defaultTo } from 'utils/config.json';
import { useHistory } from 'react-router-dom';
import { errorType, longName, statuses, finishedStatuses } from 'utils/constants';
import { valiateAddress, valiateExternalId } from 'utils/validators';
import {
    CHANGE_FROM_CURRENCY,
    CHANGE_TO_CURRENCY,
    CHANGE_TRANSACTION_ID,
} from 'store/actions/actionTypes';
import './stepperStyles.css'

const useStyles = makeStyles(theme => ({
    stepContainer: {
        width: '100%',
        margin: '0 auto',
        height: 'auto',
    },
    exchangeInput: {
        width: '100%',
        height: '100%',
        margin: '0',
        padding: '17px 20px 0',
        fontSize: '24px',
        borderRadius: '5px 0 0 5px',
        border: 'none',
        outline: 'none',
    },
    coinIcon: {
        width: 30,
        height: 30,
        marginRight: '5px'
    },
    arrow: {
        position: 'absolute',
        right: 10,
        top: 32,
        border: '6px solid transparent',
        borderTop: '6px solid #818283',
    },
    searchInput: {
        height: '100%',
        marginBottom: '0',
        paddingTop: '10px',
        paddingBottom: '10px',
        paddingLeft: '40px',
        fontSize: '20px',
        border: 'none',
        borderBottom: '1px solid #b6c0cb',
        borderRadius: '4px 4px 4px 0',
        outline: 'none',
    },
    circle: {
        position: 'absolute',
        width: '10px',
        height: '10px',
        top: '20px',
        left: '18px',
        backgroundColor: '#fff',
        borderRadius: '50%',
    },
    line: {
        position: 'absolute',
        left: '22px',
        height: '50px',
        top: '0',
        width: '2px',
        backgroundColor: '#fff',
    },
    stepNumber: {
        width: '30px',
        minWidth: '30px',
        flexBasis: '30px',
        height: '30px',
        borderRadius: '50%',
        border: '2px solid #3bee81',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '12px',
        fontWeight: '600',
        color: '#fff'
    }
}));

const exchangeInterval = 5000;

export default function SepperPage() {
    const classes = useStyles()
    const history = useHistory()
    const dispatch = useDispatch()
    const swapData = useSelector(state => state.swap)
    
    const fromSearchBtn = useRef(null)
    const searchFrom = useRef(null)
    const toSearchBtn = useRef(null)
    const searchTo = useRef(null)

    const [fromCurrencySelectEl, setFromCurrencySelectEl] = useState(null);
    const [toCurrencySelectEl, setToCurrencySelectEl] = useState(null);
    const [expectedRateEl, setExpectedRateEl] = useState(null);

    const [amount, setAmount] = useState(swapData.amount)
    const [amountTo, setAmountTo] = useState(0)
    const [currentStep, setCurrentStep] = useState(1)
    const [currencies, setCurrencies] = useState([])
    const [from, setFrom] = useState(null)
    const [to, setTo] = useState(null)
    const [fullTo, setFullTo] = useState(null)
    const [fullFrom, setFullFrom] = useState(null)
    const [isCounting, setIsCounting] = useState(false)
    let recountTimeout = null
    const [arkWallets, setArkWallets] = useState([])
    const [recipientWallet, setRecipientWallet] = useState('')
    const [refundWallet, setRefundWallet] = useState('')
    const [externalId, setExternalId] = useState('')
    const [initializing, setInitializing] = useState(true)
    const [confirm, setConfirm] = useState(false)
    const [fromFilter, setFromFilter] = useState('')
    const [toFilter, setToFilter] = useState('')
    const [needRefund, setNeedRefund] = useState(false)
    const [recipientFocus, setRecipientFocus] = useState(false)
    const [refundFocus, setRefundFocus] = useState(false)
    const [externalIdFocus, setExternalIdFocus] = useState(false)

    const [hasError, setHasError] = useState(false)
    const [amountError, setAmountError] = useState(false)
    const [minAmountValue, setMinAmount] = useState(0)
    const [transactionTime, setTransactionTime] = useState('')
    const [selectValue, setSelectValue] = useState('')
    // Step 3
    const [transaction, setTransaction] = useState(null)
    const [creating, setCreating] = useState(false)
    let statusTimer = null
    // finishedStatuses,
    // statuses,
    const [sequence, setSequence] = useState('')

    const [isLongToName, setIsLongToName] = useState(null)
    const [isLongFromName, setIsLongFromName] = useState(null)
    const [isValidRecipient, setIsValidRecipient] = useState(false)
    const [isValidRefund, setIsValidRefund] = useState(false)
    const [isValidExternalId, setIsValidExternalId] = useState(false)
    const [renderFromLabel, setRenderFromLabel] = useState('')
    const [exstraIdPalce, setExstraIdPalce] = useState('')
    const [exstraIdValidError, setExstraIdValidError] = useState('')
    const [recipientPlace, setRecipientPlace] = useState('')
    const [refundPlace, setRefundPlace] = useState('')
    const [fromTicker, setFromTicker] = useState(defaultFrom)
    const [toTicker, setToTicker] = useState(defaultTo)
    const [filtredFrom, setFiltredFrom] = useState(null)
    const [filtredTo, setFiltredTo] = useState(null)
    const [validParams, setValidParams] = useState(null)
    const [confirmingStatus, setConfirmingStatus] = useState(null)
    const [exchangingStatus, setExchangingStatus] = useState(null)
    const [sendingStatus, setSendingStatus] = useState(null)
    const [isExchangeFinished, setIsExchangeFinished] = useState(null)
    const [isExchangeFinishedSuccess, setIsExchangeFinishedSuccess] = useState(null)
    const [payinHashLink, setPayinHashLink] = useState(null)
    const [payinAddressLink, setPayinAddressLink] = useState(null)
    const [payoutAddressLink, setPayoutAddressLink] = useState(null)
    const [payoutHashLink, setPayoutHashLink] = useState(null)
    const [, setExchangeRate] = useState(null)
    const [hasProfit, setHasProfit] = useState(null)

    useEffect(() => {
        initialize();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (to) {
            setIsLongToName(longName[to.ticker])
        }
        setRecipientPlace(to ? `Enter the recipient's ${to.ticker?.toUpperCase()} address` : '')
        setToTicker(to ? to.ticker?.toUpperCase(): defaultTo)
    }, [to])

    useEffect(() => {
        if (from) {
            setIsLongFromName(longName[from.ticker])
        }
        setFromTicker(from ? from.ticker?.toUpperCase() : defaultFrom)
    }, [from])

    useEffect(() => {
        setIsValidRecipient(to ? valiateAddress(to.ticker, recipientWallet) : false)
    }, [to, recipientWallet])

    useEffect(() => {
        setIsValidRefund(from ? valiateAddress(from.ticker, refundWallet): false)
    }, [from, refundWallet])

    useEffect(() => {
        setIsValidExternalId(to ? valiateExternalId(to.ticker, externalId) : false)
    }, [to, externalId])

    useEffect(() => {
        if (from && amountError) {
            setRenderFromLabel(from && amountError ? `Minimum amount ${minAmountValue} ${from.ticker?.toUpperCase()}` : '')
        }
    }, [from, amountError, minAmountValue])

    useEffect(() => {
        setExstraIdPalce(fullTo && fullTo.externalIdName ? `${fullTo.externalIdName} (Optional)` : '')
        setExstraIdValidError(fullTo && fullTo.externalIdName ? `This ${fullTo.externalIdName.toLowerCase()} is not valid` : '')
    }, [fullTo])

    useEffect(() => {
        setRefundPlace(fullFrom ? `Enter ${fullFrom.ticker?.toUpperCase()} refund address (${fullFrom.isAnonymous ? 'required' : 'optional'})` : '')
    }, [fullFrom])

    useEffect(() => {
        const filter = fromFilter.toLowerCase().trim();
        const filtredFromData = currencies.filter(currency => {
            const name = currency.name.toLowerCase();
            const ticker = currency.ticker.toLowerCase();
            const isNotTo = to && currency.ticker !== to.ticker;
            return (ticker?.includes(filter) || name?.includes(filter)) && !(currency.isFiat && isNotTo);
        });
        setFiltredFrom(filtredFromData)
    }, [fromFilter, currencies, to])

    useEffect(() => {
        const filter = toFilter.toLowerCase().trim();
        const filterdToData = currencies.filter(currency => {
            const name = currency.name.toLowerCase();
            const ticker = currency.ticker.toLowerCase();
            const isNotFrom = from && currency.ticker !== from.ticker;
            return (ticker?.includes(filter) || name?.includes(filter)) && !(currency.isFiat && isNotFrom);
        });
        setFiltredTo(filterdToData)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [to, toFilter, currencies])

    useEffect(() => {
        if (from && to && amount) {
            const isValidRecipient = recipientWallet && valiateAddress(to.ticker, recipientWallet);
            const isValidRefund = fullFrom && (fullFrom.isAnonymous || refundWallet) ? 
              valiateAddress(from.ticker, refundWallet) : true;
            const isValidExternalId = fullTo && (!fullTo.hasExternalId || externalId) ? valiateExternalId(to.ticker, externalId) : true;
            setValidParams(Boolean(isValidRecipient && isValidRefund && isValidExternalId && !hasError && !amountError))
            return
        }
        setValidParams(false)
    }, [from, to, amount, recipientWallet, fullFrom, refundWallet, fullTo, externalId, hasError, amountError])

    useEffect(() => {
        if (transaction) {
            const { status } = transaction;
            setConfirmingStatus(status === statuses.exchanging || status === statuses.sending);
            setExchangingStatus(status === statuses.sending)
            setSendingStatus(status === statuses.sending)
            setIsExchangeFinishedSuccess(status === statuses.finished)
            return
        } 
        setConfirmingStatus(false)
        setExchangingStatus(false)
        setSendingStatus(false)
        setIsExchangeFinishedSuccess(false)
    }, [transaction])

    useEffect(() => {
        if (transaction) {
            const { status } = transaction;
            setIsExchangeFinished(finishedStatuses?.includes(status))
            return
        } 
        setIsExchangeFinished(false)
    }, [transaction])

    useEffect(() => {
        if (transaction && transaction.status === statuses.finished) {
            setPayinHashLink(fullFrom ? fullFrom.transactionExplorerMask.replace('$$', transaction.payinHash) :  '')
            setPayinAddressLink(fullFrom ? fullFrom.addressExplorerMask.replace('$$', transaction.payinAddress) :  '')
            return
        } 
        setPayinHashLink('')
        setPayinAddressLink('')
    }, [transaction, fullFrom])

    useEffect(() => {
        if (transaction && transaction.status === statuses.finished) {
            setPayoutAddressLink(fullTo ? fullTo.addressExplorerMask.replace('$$', transaction.payoutAddress) :  '')
            setPayoutHashLink(fullTo ? fullTo.transactionExplorerMask.replace('$$', transaction.payoutHash) :  '')
            return
        } 
        setPayoutAddressLink('')
        setPayoutHashLink('')
    }, [transaction, fullTo])

    useEffect(() => {
        if (transaction && transaction.status === statuses.finished) {
            const { amountReceive, amountSend, fromCurrency, toCurrency, expectedReceiveAmount } = transaction;
            const rate = Number(amountReceive) / Number(amountSend);
            const profit = Number(amountReceive) - Number(expectedReceiveAmount);
            setExchangeRate(`1 ${fromCurrency?.toUpperCase()} ≈ ${rate.toFixed(7)} ${toCurrency?.toUpperCase()}`)
            setHasProfit(profit > 0 ? `${profit.toFixed(8)} ${toCurrency?.toUpperCase()}` : '')
            return
        } 
        setExchangeRate('')
        setHasProfit('')
    }, [transaction])

    const parseDate = (date) => {
        const time = new Date(date);
        return time.toLocaleString();
    }
    const countSequence = (amountToValue) => {
        const price = amountToValue && amountToValue !== '-' && amount ? Number(amountToValue / amount).toFixed(7) : 0;
        return `1 ${from ? from.ticker?.toUpperCase() : defaultFrom?.toUpperCase() } ≈ ${price || ''} ${to ? to.ticker?.toUpperCase() : 'ETH'}`
    }
    const toggleRefund = () => {
        setNeedRefund(!needRefund)
        setRefundWallet('')
    }
    const getFromCurrencies = async (fromValue) => {
        const currenciesData = await getAllCurrencies();
        setCurrencies(currenciesData)
        if (fromValue) {
            return currenciesData;
        }
        const fromData = currenciesData.find(currency => currency.ticker === defaultFrom);
        setFrom(fromData)
        return currenciesData;
    }
    const getToCurrencies = (currenciesData, toValue) => {
        if (!toValue) {
            const toData = currenciesData.find(currency => currency.ticker === defaultTo);
            setTo(toData ? toData : currenciesData.filter(currency => currency.ticker !== from.ticker)[0])
        }
    }
    const recountTo = async (fromData = from, toData = to) => {
        if (fromData && toData) {
            setIsCounting(true)
            const fromTo = `${fromData?.ticker}_${toData?.ticker}`;
            if (arkWallets?.length && toData?.ticker === defaultTo) {
                setArkAddress();   ////
            }
            let amountToValue;
            try {
                const fullFromData = await getCurrencyInfo(fromData?.ticker);
                const fullToData = await getCurrencyInfo(toData?.ticker);
                setFullFrom(fullFromData)
                setFullTo(fullToData)
                const { minAmount } = await minilalExchangeAmount(fromTo);
                setMinAmount(minAmount)
                if (minAmount > amount) {
                    setAmountError(true)
                    return;
                }
                setAmountError(false)
                const { estimatedAmount, transactionSpeedForecast } = await exchangeAmount(fromTo, amount);
                setTransactionTime(transactionSpeedForecast)
                setAmountTo(estimatedAmount)
                amountToValue = estimatedAmount
                setHasError(false)
            } catch (error) {
                setAmountTo(0)
                amountToValue = 0
                setHasError(true)
                if (error.body) {
                    const errorData = JSON.parse(error.body);
                    if (errorData.error === errorType.SMALL_DEPOSIT) {
                        setAmountError(true)
                        return;
                    }
                    if (errorData.error === errorType.INACTIVE) {
                        const errorMessage = `The ${from.ticker?.toUpperCase()}/${to.ticker?.toUpperCase()} 
                        pair is temporarily unavailable for exchanges.`;
                        alert(errorMessage);
                        console.log('error', errorMessage)
                        return;
                    }
                }
                if (error.message) {
                    alert(`Faled to fetch available currencies. Reason: ${error.message}.`);
                    console.log(`Faled to fetch available currencies. Reason: ${error.message}.`)
                    return;
                }
                alert('Unknown error.');
                console.log('Unknown error.');
            } finally {
                setSequence(countSequence(amountToValue))
                setIsCounting(false)
            }
        }
    }
    const startRecount = () => {
        if (recountTimeout) {
            clearTimeout(recountTimeout)
        }
        recountTimeout = setTimeout(() => {
            recountTo();
        }, 500);
    }
    const toggleCurrancies = () => {
        const prevFrom = from;
        setFrom(to)
        setTo(prevFrom)
        setExternalId('')
        recountTo(to, prevFrom);
    }
    const openSelectFrom = (e) => {
        if (currencies.length) {
            setFromCurrencySelectEl(e.currentTarget)
        }
    }
    const openSelectTo = (e) => {
        if (currencies.length) {
            setToCurrencySelectEl(e.currentTarget)
        }
    }
    const selectCoinFrom = (ticker) => {
        const newFrom = currencies.find(currency => currency.ticker === ticker);
        if (newFrom) {
            setFrom(newFrom)
            dispatch({ type: CHANGE_FROM_CURRENCY, payload: newFrom })
            
        }
        recountTo(newFrom ? newFrom : from, to);
        setFromCurrencySelectEl(null)
        setFromFilter('')
    }
    const selectCoinTo = (ticker) => {
        const newTo = currencies.find(currency => currency.ticker === ticker);
        if (newTo) {
            setTo(newTo)
            dispatch({ type: CHANGE_TO_CURRENCY, payload: newTo })
        }
        recountTo(from, newTo ? newTo : to);
        setToCurrencySelectEl(null)
        setToFilter('')
    }
    const isNumber = (event) => {
        const value = event.target.value.trim();
        const amount = Number(event.target.value);
        if (Number.isNaN(amount)) {
            event.preventDefault();
            event.target.value = value.slice(0, -1);   
            setAmount(value.slice(0, -1))
            return false;
        } else {
            return true;
        }
    }
    const createExchange = async () => {
        if (validParams) {
            const params = {
                from: from.ticker,
                to: to.ticker,
                address: recipientWallet,
                amount: amount,
            }
  
            if (externalId) { params.extraId = externalId; }
            if (refundWallet) { params.refundAddress = refundWallet; }
            setCreating(true)
            try {
                const transactionData = await createTransaction(params);
                dispatch({ type: CHANGE_TRANSACTION_ID, payload: transactionData.id })
                setTransaction(transactionData)
                statusTimer = setInterval(() => {
                    checkTransactionStatus(transactionData.id);  ////
                }, exchangeInterval);
                
                await checkTransactionStatus(transactionData.id);  ////
                setCurrentStep(3)
            } catch (error) {
                alert(`Faled to create transaction.`);
                console.log(`Faled to create transaction.`);
            } finally {
                setCreating(false)
            }
        }
    }
    const checkTransactionStatus = async (transactionId) => {
        if (!transactionId) {
            return;
        }
        try {
            const transactionData = await getTransactionStatus(transactionId);
            if (!fullTo || !fullFrom) {
                const [ from, to ] = await Promise.all([getCurrencyInfo(transactionData.fromCurrency),
                getCurrencyInfo(transactionData.toCurrency)]);
                setFullFrom(from)
                setFullTo(to)
            }
    
            setTransaction(transactionData)
            
            if (finishedStatuses?.includes(transactionData.status)) {
                if (transactionData.status === statuses.finished) {
                    setCurrentStep(4)
                }
                dispatch({ type: CHANGE_TRANSACTION_ID, payload: null })
                clearInterval(statusTimer);
            }
        } catch (error) {
            alert(`Faled to fetch transaction data.`);
            console.log(`Faled to fetch transaction data.`);
        }
    }
    const initialize = async () => {
        setInitializing(true)
        const storageFrom = swapData.fromCurrency
        const storageAmount = swapData.amount
        const storageTo = swapData.toCurrency
        const lastId = swapData.transactionId
        // const profile = walletApi.profiles.getCurrent();
        const profile = {}
        const arkWalletsData = profile.wallets?.map(wallet => {
            return wallet.name ? wallet.name : wallet.address;
        });
        setArkWallets(arkWalletsData)
        if (storageFrom) {
            setFrom(storageFrom)
        }
        if (storageTo) {
            setTo(storageTo)
        }
        if (storageAmount) {
            setAmount(storageAmount)
        }
        if (arkWalletsData?.length && to && to.ticker === defaultTo) {
            setArkAddress();   ////
        }
        try {
            if (lastId) {
                statusTimer = setInterval(() => {
                    checkTransactionStatus(lastId);   ////
                }, exchangeInterval);
                setTransaction({
                    id: lastId
                });
                await checkTransactionStatus(lastId);   ////
                setCurrentStep(3)
                setInitializing(false)
                return;
            }
            const currenciesData = await getFromCurrencies(storageFrom ? storageFrom : from);
            getToCurrencies(currenciesData, storageTo ? storageTo : to);
            await recountTo(storageFrom ? storageFrom : from, storageTo ? storageTo : to);
            setInitializing(false)
        } catch (error) {
            if (error.message) {
                alert(`Faled to fetch available currencies. Reason: ${error.message}.`);
                console.log(`Faled to fetch available currencies. Reason: ${error.message}.`);
                return;
            }
            if (error.body) {
                const { message } = JSON.parse(error.body);
                alert(message);
                console.log(message);
                return
            }
            alert('Unknown error.');
            console.log('Unknown error.');
        } finally {
            setInitializing(false)
        }
    }
    const startNewTransaction = async () => {
        dispatch({ type: CHANGE_TRANSACTION_ID, payload: null })
        history.push('/moonbridge')
    }
    const setArkAddress = (value) => {
        if (!value) {
            value = arkWallets[0];
        }
        // const profile = walletApi.profiles.getCurrent();
        const profile = {}
        const selectedWallet = profile.wallets.find(wallet => {
            return wallet.name === value || wallet.address === value;
        });
        setSelectValue(value)
        if (!selectedWallet) {
            setRecipientWallet(profile.wallets[0].address)
            return;
        }
        setRecipientWallet(selectedWallet.address)
    }

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center'
        }}>
            {initializing ? (
                <CircularProgress />
            ) : (
                <Card 
                    sx={{
                        width: "80%",
                        maxWidth: '500px'
                    }}
                >
                    {currentStep === 1 && <div className={classes.stepContainer}>
                        <Box sx={{
                            width: '100%',
                            height: '40px',
                            paddingBottom: '10px',
                            display: 'flex',
                            alignItems: 'center',
                        }}>
                            <div className={classes.stepNumber}>1</div>
                            <span className="stepName">Send To</span>
                        </Box>
                        <div className='stepBody'>
                            <div className='formBlock'>
                                <Box sx={{
                                    display: 'flex',
                                    backgroundColor: '#fff',
                                    borderRadius: '5px',
                                    border: '1px solid #d7dfe8',
                                    minHeight: 70
                                }}>
                                    <Box sx={{
                                        borderRadius: "5px 0 0 5px",
                                        flexGrow: '1',
                                        position: 'relative',
                                        borderRight: '1px solid #d7dfe8'
                                    }}>
                                        {amountError ? (
                                            <Typography
                                                sx={{
                                                    position: 'absolute',
                                                    top: '5px',
                                                    left: '20px',
                                                    fontSize: 14,
                                                    color: 'rgb(220, 29, 46)'
                                                }}
                                            >
                                                {renderFromLabel}
                                            </Typography>
                                        ) : (
                                            <Typography
                                                sx={{
                                                    position: 'absolute',
                                                    top: '5px',
                                                    left: '20px',
                                                    fontSize: 14
                                                }}
                                            >
                                                You Send
                                            </Typography>
                                        )}
                                        <input
                                            className={classes.exchangeInput}
                                            type="text"
                                            value={amount}
                                            onKeyUp={startRecount}
                                            onInput={isNumber}
                                            onChange={(e) => setAmount(e.target.value)}
                                        />
                                    </Box>
                                    <Box 
                                        ref={fromSearchBtn}
                                        sx={{
                                            minWidth: 160,
                                            padding: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            position: 'relative',
                                            cursor: 'pointer'
                                        }}
                                        onClick={openSelectFrom}
                                        aria-describedby="select-from-popover"
                                    >
                                        {from ? <img src={from?.image} className={classes.coinIcon} alt="" /> : <div style={{width: 35}}></div>}
                                        {(from && isLongFromName) ? (
                                            <Typography 
                                                component="span"
                                                sx={{
                                                    fontSize: 20,
                                                    color: '#333',
                                                    fontWeight: '600',
                                                    mr: '4px'
                                                }}>
                                                    {longName[from?.ticker]?.ticker} 
                                                    <sup>{longName[from?.ticker]?.sub}</sup>
                                            </Typography>
                                        ) : (
                                            <Typography 
                                                component="span"
                                                sx={{
                                                    fontSize: 20,
                                                    color: '#333',
                                                    fontWeight: '600'
                                                }}>
                                                {fromTicker}
                                            </Typography>
                                        )}
                                        <div className={classes.arrow}></div>
                                    </Box>
                                    <Popover
                                        id="select-from-popover"
                                        open={Boolean(fromCurrencySelectEl)}
                                        anchorEl={fromCurrencySelectEl}
                                        onClose={() => setFromCurrencySelectEl(null)}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'right',
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        sx={{
                                            "& .MuiPopover-paper": {
                                                backgroundColor: '#fff'
                                            }
                                        }}
                                    >
                                        <Box sx={{
                                            position: 'relative'
                                        }}>
                                            <SearchIcon sx={{
                                                position: 'absolute',
                                                top: 12,
                                                left: 8,
                                                fontSize: '24px!important',
                                                color: '#625e5e'
                                            }} />
                                            <input 
                                                type="text"
                                                className={classes.searchInput}
                                                ref={searchFrom}
                                                value={fromFilter}
                                                onChange={(e) => setFromFilter(e.target.value)}
                                            />
                                        </Box>
                                        <List sx={{ py: '10px', maxHeight: 380 }}>
                                            {filtredFrom.map((fromCurrency, index) => (
                                                <Fragment key={fromCurrency.ticker}>
                                                    <ListItem 
                                                        alignItems="center" 
                                                        onClick={() => selectCoinFrom(fromCurrency.ticker)}
                                                        sx={{ cursor: 'pointer' }}
                                                    >
                                                        <ListItemAvatar sx={{minWidth: 40}}>
                                                            <Avatar src={fromCurrency.image} alt="" sx={{width: 30, height: 30}} />
                                                        </ListItemAvatar>
                                                        <ListItemText
                                                            primary={fromCurrency.ticker}
                                                            secondary={fromCurrency.name}
                                                            primaryTypographyProps={{
                                                                fontWeight: '400',
                                                                fontSize: '16px',
                                                                color: '#000',
                                                                lineHeight: '23px'
                                                            }}
                                                            secondaryTypographyProps={{
                                                                fontWeight: '300',
                                                                fontSize: '14px',
                                                                color: '#808086',
                                                                lineHeight: '20px'
                                                            }}
                                                        />
                                                    </ListItem>
                                                    {filtredFrom.length !== index && <Divider variant="inset" component="li" sx={{my: '10px'}} />}
                                                </Fragment>
                                            ))}
                                        </List>
                                    </Popover>
                                </Box>
                                <Box sx={{
                                    height: '50px',
                                    width: '100%',
                                    pl: '50px',
                                    pr: '30px',
                                    position: 'relative',
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                    <div className={classes.circle}></div>
                                    <div className={classes.line}></div>
                                    <Typography
                                        component="span"
                                        sx={{
                                            fontSize: '12px',
                                            color: '#fff',
                                            mr: '4px'
                                        }}
                                    >
                                        {sequence}
                                    </Typography>
                                    <Box sx={{flexGrow: '1', display: 'flex'}}>
                                        <button 
                                            style={{
                                                paddingLeft: '4px', 
                                                color: '#3bee81', 
                                                fontSize: '12px',
                                                backgroundColor: 'transparent',
                                                outline: 'none',
                                                border: 'none',
                                            }}
                                            aria-describedby="expected-rate-popover"
                                            onClick={(e) => setExpectedRateEl(e.target)}
                                        >
                                            Expected rate
                                        </button>
                                        <Popover
                                            id="expected-rate-popover"
                                            open={Boolean(expectedRateEl)}
                                            anchorEl={expectedRateEl}
                                            onClose={() => setExpectedRateEl(null)}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'left',
                                            }}
                                            sx={{
                                                "& .MuiPopover-paper": {
                                                    backgroundColor: '#fff'
                                                }
                                            }}
                                        >
                                            <Box sx={{ maxWidth: 250, p: '20px' }}>
                                                <Typography 
                                                    variant="h4"
                                                    sx={{ color: '#5c5780', fontSize: 16, mb: '10px' }}
                                                >
                                                    This is an expected rate
                                                </Typography>
                                                <Typography 
                                                    sx={{ color: '#2b2b37', fontSize: '14px', mt: '20px'}}
                                                >
                                                    ChangeNOW will pick the best rate for you during the moment of the exchange.
                                                </Typography>
                                                <Link
                                                    href="https://changenow.io/faq/what-is-the-expected-exchange-rate" 
                                                    sx={{
                                                        color: '#3bee81',
                                                        fontSize: '12px',
                                                        "&:hover": {
                                                            color: '#3bee81',
                                                        }
                                                    }} 
                                                    target="_blank"
                                                    rel="noopener"
                                                >
                                                    Learn More
                                                </Link>
                                            </Box>
                                        </Popover>    
                                    </Box>
                                    <Box sx={{ color: "#3bee81", cursor: 'pointer', userSelect: 'none' }} onClick={toggleCurrancies}>
                                        <i className='fa fa-long-arrow-alt-up' size="lg"></i>
                                        <i className='fa fa-long-arrow-alt-down' size="lg"></i>
                                    </Box>
                                </Box>
                                <Box sx={{
                                    display: 'flex',
                                    backgroundColor: '#fff',
                                    borderRadius: '5px',
                                    border: '1px solid #d7dfe8',
                                    minHeight: 70
                                }}>
                                    <Box sx={{
                                        borderRadius: "5px 0 0 5px",
                                        flexGrow: '1',
                                        position: 'relative',
                                        borderRight: '1px solid #d7dfe8'
                                    }}>
                                        <Typography
                                            sx={{
                                                position: 'absolute',
                                                top: '5px',
                                                left: '20px',
                                                fontSize: 14
                                            }}
                                        >
                                            You get
                                        </Typography>
                                        <input
                                            className={classes.exchangeInput}
                                            disabled
                                            type="text"
                                            value={isCounting ? '' : amountTo}
                                        />
                                        {/* {isCounting && <span className="inputLoader">
                                            <i className='fa fa-spinner rotate' size="lg" rotation="180" spin></i>
                                        </span>} */}
                                    </Box>
                                    <Box 
                                        ref={toSearchBtn}
                                        sx={{
                                            minWidth: 160,
                                            padding: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            position: 'relative',
                                            cursor: 'pointer'
                                        }}
                                        onClick={openSelectTo}
                                        aria-describedby="select-to-popover"
                                    >
                                        {to ? <img src={to?.image} className={classes.coinIcon} alt="" /> : <div style={{width: 35}}></div>}
                                        {(to && isLongToName) ? (
                                            <Typography 
                                                component="span"
                                                sx={{
                                                    fontSize: 20,
                                                    color: '#333',
                                                    fontWeight: '600',
                                                    mr: '4px'
                                                }}>
                                                    {longName[to?.ticker]?.ticker} 
                                                    <sup>{longName[to?.ticker]?.sub}</sup>
                                            </Typography>
                                        ) : (
                                            <Typography 
                                                component="span"
                                                sx={{
                                                    fontSize: 20,
                                                    color: '#333',
                                                    fontWeight: '600'
                                                }}>
                                                {toTicker}
                                            </Typography>
                                        )}
                                        <div className={classes.arrow}></div>
                                    </Box>
                                    <Popover
                                        id="select-to-popover"
                                        open={Boolean(toCurrencySelectEl)}
                                        anchorEl={toCurrencySelectEl}
                                        onClose={() => setToCurrencySelectEl(null)}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'right',
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        sx={{
                                            "& .MuiPopover-paper": {
                                                backgroundColor: '#fff'
                                            }
                                        }}
                                    >
                                        <Box sx={{
                                            position: 'relative'
                                        }}>
                                            <SearchIcon sx={{
                                                position: 'absolute',
                                                top: 12,
                                                left: 8,
                                                fontSize: '24px!important',
                                                color: '#625e5e'
                                            }} />
                                            <input 
                                                type="text"
                                                className={classes.searchInput}
                                                ref={searchTo}
                                                value={toFilter}
                                                onChange={(e) => setToFilter(e.target.value)}
                                            />
                                        </Box>
                                        <List sx={{ py: '10px', maxHeight: 380 }}>
                                            {filtredTo.map((toCurrency, index) => (
                                                <Fragment key={toCurrency.ticker}>
                                                    <ListItem 
                                                        alignItems="center" 
                                                        onClick={() => selectCoinTo(toCurrency.ticker)}
                                                        sx={{ cursor: 'pointer' }}
                                                    >
                                                        <ListItemAvatar sx={{minWidth: 40}}>
                                                            <Avatar src={toCurrency.image} alt="" sx={{width: 30, height: 30}} />
                                                        </ListItemAvatar>
                                                        <ListItemText
                                                            primary={toCurrency.ticker}
                                                            secondary={toCurrency.name}
                                                            primaryTypographyProps={{
                                                                fontWeight: '400',
                                                                fontSize: '16px',
                                                                color: '#000',
                                                                lineHeight: '23px'
                                                            }}
                                                            secondaryTypographyProps={{
                                                                fontWeight: '300',
                                                                fontSize: '14px',
                                                                color: '#808086',
                                                                lineHeight: '20px'
                                                            }}
                                                        />
                                                    </ListItem>
                                                    {filtredTo.length !== index && <Divider variant="inset" component="li" sx={{my: '10px'}} />}
                                                </Fragment>
                                            ))}
                                        </List>
                                    </Popover>
                                </Box>
                            </div>

                            {(to && to.ticker === 'ark' && arkWallets.length) ? (
                                <div className="addressInputBody">
                                    <span className="addressInputLabel">Recipient Wallet</span>
                                    {fullFrom && !fullFrom.isAnonymous && <span 
                                        className="refundButton" onClick={toggleRefund}>
                                        {needRefund ? 'Remove refund address' : '+ Add refund address'}
                                    </span>}
                                    <input-select items={arkWallets} label="" name="ArkWallets" value={selectValue} onChange={(e) => setSelectValue(e.target.value)} onInput={setArkAddress} />
                                    {recipientWallet && !isValidRecipient && !recipientFocus && <p className="inputError">
                                        This address is not valid
                                    </p>}
                                </div>
                            ) : (
                                <div className="addressInputBody">
                                    <span className="addressInputLabel">Recipient Wallet</span>
                                    {fullFrom && !fullFrom.isAnonymous && <span
                                        className="refundButton" onClick={toggleRefund}>
                                        {needRefund ? 'Remove refund address' : '+ Add refund address'}
                                    </span>}
                                    <div className="addressInputWrapper">
                                        <input  
                                            type="text" 
                                            value={recipientWallet}
                                            onChange={(e) => setRecipientWallet(e.target.value)}
                                            onBlur={() => setRecipientFocus(false)}
                                            onFocus={() => setRecipientFocus(true)}
                                            className="addressInput" 
                                            placeholder={recipientPlace}
                                        />
                                        {recipientWallet && isValidRecipient && <div className="inputSuccesValid">
                                            <i className='fa fa-check' size="lg"></i>
                                        </div>}
                                    </div>
                                    {recipientWallet && !isValidRecipient && !recipientFocus && <p className="inputError">
                                        This address is not valid
                                    </p>}
                                </div>
                            )}
                            {fullTo && fullTo.hasExternalId && <div className="addressInputBody">
                                <div className="addressInputWrapper">
                                    <input 
                                        type="text" 
                                        v-model="externalId" 
                                        onBlur={() => setExternalIdFocus(false)}
                                        onFocus={() => setExternalIdFocus(true)}
                                        className="addressInput border border-solid focus:border-green border-gray-400"
                                        placeholder={exstraIdPalce}
                                    />
                                    {externalId && isValidExternalId && <div className="inputSuccesValid">
                                        <i className='fa fa-check' size="lg"></i>
                                    </div>}
                                </div>
                                {externalId && !isValidExternalId && !externalIdFocus && <p className="inputError">
                                    {exstraIdValidError}
                                </p>}
                            </div>}
                            {(needRefund || fullFrom) && fullFrom.isAnonymous && <div className="addressInputBody">
                                <span className="addressInputLabel">Refund Wallet</span>
                                <div className="addressInputWrapper">
                                    <input 
                                        type="text" 
                                        v-model="refundWallet"
                                        onBlur={() => setRefundFocus(false)}
                                        onFocus={() => setRefundFocus(true)}
                                        className="addressInput border border-solid focus:border-green border-gray-400" 
                                        placeholder={refundPlace}
                                    />
                                    {refundWallet && isValidRefund && <div className="inputSuccesValid">
                                        <i className='fa fa-check' size="lg"></i>
                                    </div>}
                                </div>
                                {refundWallet && !isValidRefund && !refundFocus && <p className="inputError">
                                    This address is not valid
                                </p>}
                            </div>}
                        </div>
                        <div className="buttonsBlock">
                            {validParams ? (
                                <button className="stepButton buttonGreen hover:opacity-75 disabled:bg-gray" 
                                    disabled={!validParams} 
                                    onClick={() => setCurrentStep(2)}>
                                    Next
                                </button>
                            ) : (
                                <button className="stepButton disabledButton hover:opacity-75 disabled:bg-gray" disabled={!validParams} 
                                >
                                    Next
                                </button>
                            )}
                            <button 
                                onClick={() => history.push('/moonbridge')} 
                                className="stepButton buttonWhite hover:opacity-75"
                            >
                                Back
                            </button>
                        </div>
                    </div>}
                    {currentStep === 2 && <div className={classes.stepContainer}>
                        <div className="stepHeader">
                            <div className={classes.stepNumber}>2</div>
                            <span className="stepName">Confirmation</span>
                        </div>
                        <div className="stepBody">
                            <div>
                                <div className="confirmInfoData pr-6">
                                    <span className="confirmInfoLabel">You Send</span>
                                    <span className="confirmInfoAmount">{amount} {from?.ticker}</span>
                                    <span className="confirmInfoSub">{sequence}</span>
                                </div>
                                <div className="confirmArrow md:block hidden">
                                    <i className='fa fa-arrow-right'></i>
                                </div>
                                <div className="confirmInfoData md:pl-6">
                                    <span className="confirmInfoLabel">You Get</span>
                                    <span className="confirmInfoAmount">≈ {amountTo} {to?.ticker}</span>
                                    <span className="confirmInfoSub">{recipientWallet}</span>
                                </div>
                            </div>
                            <div style={{margin: '10px 0'}}>
                                <div style={{marginRight: '30px'}}>
                                    <p className="confirmInfoLabel" style={{marginBottom: '3px'}}>Estimated Arrival</p>
                                    <p className="confirmInfoSub">≈ {transactionTime} minutes</p>
                                </div>
                                {fullTo?.hasExternalId && externalId && <div>
                                    <p className="confirmInfoLabel" style={{marginBottom: '3px'}}>{fullTo?.externalIdName ? fullTo?.externalIdName : 'Extra Id'}</p>
                                    <p className="confirmInfoSub">{externalId}</p>
                                </div>}
                            </div>
                        </div>
                        <div className="confirmCheckboxWrapper">
                            <FormControlLabel
                                value="end"
                                control={<Checkbox
                                    color="success"
                                    checked={confirm}
                                    onChange={(e) => setConfirm(e.target.checked)}
                                    sx={{
                                        mt: '4px',
                                        "& .MuiSvgIcon-root": {
                                            fill: '#01b574'
                                        }
                                    }} />
                                }
                                label={
                                    <div className="confirmText">
                                        I've read and agree to the ChangeNOW 
                                        <Link 
                                            href="https://changenow.io/terms-of-use" 
                                            target="blank"
                                            sx={{
                                                color: "#3bee81",
                                                mx: '4px',
                                                "&:hover": {
                                                    color: '#a2f1c1'
                                                }
                                            }}
                                        >
                                            Terms of Use
                                        </Link> 
                                        and 
                                        <Link 
                                            href="https://changenow.io/privacy-policy"
                                            target="blank"
                                            sx={{
                                                color: "#3bee81",
                                                mx: '4px',
                                                "&:hover": {
                                                    color: '#a2f1c1'
                                                }
                                            }}
                                        >
                                            Privacy Policy
                                        </Link>
                                    </div>}
                                labelPlacement="end"
                                sx={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    ml: 0
                                }}
                            />
                        </div>
                        <div className="buttonsBlock">
                            {!confirm || creating ? (
                                <button className="stepButton disabledButton" disabled={!confirm}>Confirm</button>
                            ) : (
                                <button className="stepButton buttonGreen" onClick={createExchange}>Confirm</button>
                            )}
                            <button 
                                className="stepButton buttonWhite" 
                                onClick={() => setCurrentStep(1)} 
                                disabled={creating}
                            >
                                Back
                            </button>
                        </div>
                        {creating && <div className="bigLoader">
                            <i className='fa fa-circle-notch' size="lg" rotation="180" style={{color: '#3bee81'}}></i>
                        </div>}
                    </div>}
                    {currentStep === 3 && transaction && <div className={classes.stepContainer}>
                        <div>
                            <div className="stepHeader relative" style={{fontSize: '16px'}}>
                                <div className={classes.stepNumber}>3</div>
                                <span className="stepName">Sending</span>
                            </div>
                            <Typography 
                                sx={{
                                    color: '#a4a3aa', 
                                    fontSize: '16px',
                                    mb: '4px'
                                }}
                            >
                                Transaction Id: {transaction?.id}
                            </Typography>
                            <button 
                                style={{
                                    color: '#3bee81',
                                    background: 'transparent',
                                    outline: 'none',
                                    border: 'none',
                                    fontSize: '16px',
                                }} 
                                onClick={startNewTransaction}
                            >
                                Start new transaction
                            </button>
                        </div>
                        <div style={{padding: '5px 0'}}>
                            <div style={{border: '2px solid #3bee81', padding: '5px 65px 5px 10px', borderRadius: '8px'}} className="mb-1">
                                <div className="stepThreeBlock">
                                    <p className="infoHeader">You send</p>
                                    <p className="infoContent" style={{textTransform: 'uppercase'}}>
                                        {amount} {transaction?.fromCurrency}
                                    </p>
                                </div>
                                <div className="stepThreeBlock">
                                    <p className="infoHeader">To address</p>
                                    <p className="infoContent">
                                        {transaction?.payinAddress} 
                                        <button-clipboard value={transaction?.payinAddress} className="text-theme-page-text-light mx-2"/>
                                    </p>
                                </div>
                                {transaction?.payinExtraId && <div className="stepThreeBlock">
                                    <p className="infoHeader">{transaction?.payinExtraIdName}</p>
                                    <p className="infoContent">
                                        {transaction?.payinExtraId} 
                                        <button-clipboard value={transaction?.payinExtraId} className="text-theme-page-text-light mx-2"/>
                                    </p>
                                </div>}
                            </div>
                            <div style={{padding: '5px 65px 5px 10px'}}>
                                <div className="stepThreeBlock">
                                    <p className="infoHeader">You get</p>
                                    <p className="infoHeader" style={{fontSize: 18, textTransform: 'uppercase'}}> ≈ {transaction?.expectedReceiveAmount} {transaction?.toCurrency}</p>
                                </div>
                                <div className="stepThreeBlock">
                                    <p className="infoHeader">Recipient Wallet</p>
                                    <p className="infoHeader" style={{fontSize: 18, wordBreak: 'break-all'}}>{transaction?.payoutAddress}</p>
                                </div>
                                {transaction?.payoutExtraId && <div className="stepThreeBlock">
                                    <p className="infoHeader">{transaction?.payoutExtraIdName}</p>
                                    <p className="infoHeader" style={{fontSize: 18, wordBreak: 'break-all'}}>{transaction?.payoutExtraId}</p>
                                </div>}
                            </div>
                            {!isExchangeFinished && <div className="exchangeStatuses flex items-center justify-center flex-col md:flex-row">
                                <div className="exchange-status">
                                    {confirmingStatus ? (
                                        <i className='fa fa-check-circle' size="lg" style={{color: '#3bee81'}}></i>
                                    ) : (
                                        <i className='fa fa-spinner rotate' size="lg" rotation="180" style={{color: '#3bee81'}}></i>
                                    )}
                                    <span style={{marginLeft: '8px', color: '#fff', fontSize: 14}}>{confirmingStatus ? 'Deposit received' : 'Awaiting deposit'}</span>
                                </div>
                                <div className="exchange-status">
                                    {exchangingStatus ? (
                                        <i className='fa fa-check-circle' size="lg" style={{color: '#3bee81'}} ></i>
                                    ) : confirmingStatus ? (
                                        <i className='fa fa-spinner rotate' size="lg" rotation="180" style={{color: '#3bee81'}}></i>
                                    ) : (
                                        <i className='fa-circle-notch' size="lg" style={{color: '#E9E7EF'}}></i>
                                    )}
                                    <span style={{marginLeft: '8px', color: '#fff', fontSize: 14}}>{exchangingStatus ? 'Exchanged' : 'Exchanging'}</span>
                                </div>
                                <div className="exchange-status">
                                    {isExchangeFinishedSuccess ? (
                                        <i className='fa fa-check-circle' size="lg" style={{color: '#3bee81'}}></i>
                                    ) : sendingStatus ? (
                                        <i className='fa fa-spinner rotate' size="lg" rotation="180" style={{color: '#3bee81'}}></i>
                                    ) : (
                                        <i className='fa fa-circle-notch' size="lg" style={{color: '#E9E7EF'}}></i>
                                    )}
                                    <span style={{marginLeft: '8px', color: '#fff', fontSize: 14}}>{isExchangeFinishedSuccess ? 'Sent to your wallet' : 'Sending to your wallet'}</span>
                                </div>
                            </div>}
                            {transaction?.status === statuses.failed && <div className="px-4 py-3 rounded my-1" style={{backgroundColor: '#fff5f5'}}>
                                <span className="block sm:inline" style={{color: '#e53e3e'}}>Error during exchange. Please contact support.</span>
                            </div>}
                            <div 
                                style={{
                                    backgroundColor: 'rgba(61,61,112,.04)',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    margin: '4px 0'
                                }}
                            >
                                <p style={{color: '#fff', marginBottom: '4px', fontSize: 14}}>If you have any questions about your exchange, please contact our support team via email.</p>
                                <a style={{color: '#3bee81', fontSize: 16}}  href="mailto: support@changenow.io">support@changenow.io</a>
                            </div>
                        </div>
                    </div>}
                    {currentStep === 4 && transaction && <div className={classes.stepContainer}>
                        <div 
                            className="relative px-2 py-2 rounded my-1 flex flex-col justify-center items-center" 
                            style={{
                                backgroundColor: 'rgba(61,61,112,.04)',
                                position: 'relative',
                                padding: '8px',
                                borderRadius: '4px',
                                margin: '4px 0',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <div className="transactionSuccessIcon">
                                <img src="https://changenow.io/images/exchange/check.svg" alt="" />
                            </div>
                            <p style={{fontSize: '26px', fontWeight: '700', marginBotom: '10px', color: '#fff'}}>
                                Transaction is completed!
                            </p>
                            {hasProfit && <p style={{fontSize: '17px', fontWeight: '700', color: '#fff'}}>
                                You earned <span style={{color: '#3bee81'}} >{hasProfit}</span>  more than was expected!
                            </p>}
                            <button 
                                style={{
                                    color: '#3bee81',
                                    background: 'transparent',
                                    outline: 'none',
                                    border: 'none',
                                    fontSize: '16px',
                                    alignSelf: 'flex-start'
                                }} 
                                onClick={startNewTransaction}
                            >
                                Start new transaction
                            </button>
                        </div>
                        <div className="smallStep">
                            <div className="smallStepHeader">
                                <div className="smallStepNumber">1</div>
                                <p className="smallStepName">Your {transaction?.fromCurrency?.toUpperCase()} Wallet</p>
                                <span className="stepHeaderText">{ parseDate(transaction?.depositReceivedAt) }</span>
                            </div>
                            <div className="flex">
                                <div className="smallStepInfoIcon">
                                    <img style={{width: '52px'}} src="https://changenow.io/images/exchange/wallet-icon.svg" alt="" />
                                </div>
                            <div style={{paddingLeft: '33px'}}>
                                <div className="smallStepInfoItem">
                                    <p className="stepInfoHead" style={{width: '240px'}}>Input Transaction Hash</p>
                                    <p style={{fontSize: '15px', letterSpacing: '.3px',  wordBreak: 'break-all'}}>
                                        <a 
                                            style={{color:' #3bee81', wordBreak: 'break-all', userSelect: 'all'}} 
                                            href={payinHashLink} 
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {transaction?.payinHash}
                                        </a>
                                        <button-clipboard value={transaction?.payinHash} className="text-theme-page-text-light mx-2"/>
                                    </p>
                                </div>
                                <div className="smallStepInfoItem">
                                    <p className="stepInfoHead" style={{width: '240px'}}>ChangeNOW Address</p>
                                    <p style={{fontSize: '15px', letterSpacing: '.3px',  wordBreak: 'break-all'}}>
                                        <a 
                                            style={{color: '#3bee81', wordBreak: 'break-all', userSelect: 'all'}} 
                                            href={payinAddressLink} 
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {transaction?.payinAddress}
                                        </a>
                                        <button-clipboard value={transaction?.payinAddress} className="text-theme-page-text-light mx-2"/>
                                    </p>
                                </div>
                                <div className="smallStepInfoItem">
                                    <p className="stepInfoHead" style={{fontWeight: '700', width: '240px'}}>Amount Sent</p>
                                    <p style={{fontSize: '15px', letterSpacing: '.3px',  wordBreak: 'break-all', fontWeight: '700'}}>
                                        {transaction?.amountSend} {transaction?.fromCurrency?.toUpperCase()}
                                    </p>
                                </div>
                            </div>
                        </div>
                        </div>
                        <div className="smallStep">
                            <div className="smallStepHeader">
                                <div className="smallStepNumber">2</div>
                                <p className="smallStepName">Your {transaction?.toCurrency?.toUpperCase()} Wallet</p>
                                <span className="stepHeaderText">{ parseDate(transaction?.updatedAt) }</span>
                                </div>
                                <div className="flex">
                                <div className="smallStepInfoIcon">
                                    <img style={{width: '52px'}} src="https://changenow.io/images/exchange/exchange-icon.svg" alt="" />
                                </div>
                                <div style={{paddingLeft: '33px'}}>
                                    <div className="smallStepInfoItem">
                                    <p className="stepInfoHead" style={{width: '240px'}}>Output Transaction Hash</p>
                                    <p style={{fontSize: '15px', letterSpacing: '.3px',  wordBreak: 'break-all'}}>
                                        <a 
                                            style={{color: '#3bee81', wordBreak: 'break-all', userSelect: 'all'}} 
                                            href={payoutHashLink} 
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                        {transaction?.payoutHash}
                                        </a>
                                        <button-clipboard value={transaction?.payoutHash} className="text-theme-page-text-light mx-2"/>
                                    </p>
                                    </div>
                                    <div className="smallStepInfoItem">
                                    <p className="stepInfoHead" style={{width: '240px'}}>Your {transaction?.toCurrency?.toUpperCase()} Address</p>
                                    <p style={{fontSize: '15px', letterSpacing: '.3px',  wordBreak: 'break-all'}}>
                                        <a 
                                            style={{color: '#3bee81', wordBreak: 'break-all', userSelect: 'all'}} 
                                            target="_blank"
                                            href={payoutAddressLink}
                                            rel="noreferrer"
                                        >
                                            {transaction?.payoutAddress}
                                        </a>
                                        <button-clipboard value={transaction?.payoutAddress} className="text-theme-page-text-light mx-2"/>
                                    </p>
                                    </div>
                                <div className="smallStepInfoItem">
                                    <p className="stepInfoHead" style={{fontWeight: '700', width: '240px'}}>Amount Received</p>
                                    <p style={{fontSize: '15px', letterSpacing: '.3px',  wordBreak: 'break-all', fontWeight: '700'}}>
                                        {transaction?.amountReceive} {transaction?.toCurrency?.toUpperCase()}
                                    </p>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>}
                </Card>
            )}
        </Box>
    )
}