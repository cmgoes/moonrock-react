import { Fragment, useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";
import {
    Box,
    Button,
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
    Link
} from '@mui/material'
import { makeStyles } from '@mui/styles';
import SearchIcon from '@mui/icons-material/Search';
import {
    getAllCurrencies,
    exchangeAmount,
} from 'utils/apiWorker'
import { longName } from "utils/constants";
import { defaultFrom, defaultTo, defaultAmount } from 'utils/config.json'
import {
    CHANGE_FROM_CURRENCY,
    CHANGE_TO_CURRENCY,
    CHANGE_AMOUNT,
} from 'store/actions/actionTypes';

const useStyles = makeStyles(theme => ({
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
    }
}));

export default function Bridge() {
    const classes = useStyles()
    const history = useHistory()
    const dispatch = useDispatch()
    const swapData = useSelector(state => state.swap)

    const toSearchBtn = useRef(null)
    const fromSearchBtn = useRef(null)
    const searchFrom = useRef(null)
    const searchTo = useRef(null)

    const [fromCurrencySelectEl, setFromCurrencySelectEl] = useState(null);
    const [toCurrencySelectEl, setToCurrencySelectEl] = useState(null);
    const [expectedRateEl, setExpectedRateEl] = useState(null);

    const [amount, setAmount] = useState(Number(defaultAmount))
    const [amountTo, setAmountTo] = useState(0)
    const [currencies, setCurrencies] = useState([])
    const [from, setFrom] = useState(undefined)
    const [to, setTo] = useState(undefined)
    const [isCounting, setIsCounting] = useState(false)
    const [initializing, setInitializing] = useState(true)
    const [fromFilter, setFromFilter] = useState('')
    const [toFilter, setToFilter] = useState('')
    const [sequence, setSequence] = useState('')
    const [isLongToName, setIsLongToName] = useState(null)
    const [isLongFromName, setIsLongFromName] = useState(null)
    const [fromTicker, setFromTicker] = useState(defaultFrom)
    const [toTicker, setToTicker] = useState(defaultTo)
    const [filtredFrom, setFiltredFrom] = useState(null)
    const [filtredTo, setFiltredTo] = useState(null)
    let recountTimeout = null

    useEffect(() => {
        initialize()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (to && to !== "undefined") {
            setIsLongToName(longName[to?.ticker])
            setToTicker(to.ticker?.toUpperCase())
        }
    }, [to])

    useEffect(() => {
        if (from) {
            setIsLongFromName(longName[from?.ticker])
            setFromTicker(from.ticker?.toUpperCase())
        }
    }, [from])

    useEffect(() => {
        const filter = fromFilter.toLowerCase().trim();
        const filterdFromData = currencies.filter(currency => {
            const name = currency.name.toLowerCase();
            const ticker = currency.ticker.toLowerCase();
            const isNotTo = to && currency.ticker !== to.ticker;
            return (ticker?.includes(filter) || name?.includes(filter)) && !(currency.isFiat && isNotTo)
        });
        setFiltredFrom(filterdFromData)
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
    }, [toFilter, currencies, from])

    const countSequence = (amountToValue) => {
        const price = amountToValue && amountToValue !== '-' && amount ? Number(amountToValue / amount).toFixed(7) : 0;
        return `1 ${from ? from.ticker?.toUpperCase() : defaultFrom?.toUpperCase() } ≈ ${price || ''} ${to ? to.ticker?.toUpperCase() : 'ETH'}`
    }

    const getFromCurrencies = async (fromValue) => {
        try {
            const currenciesData = await getAllCurrencies();
            setCurrencies(currenciesData)
            if (fromValue) {
                return currenciesData;
            }
            const fromData = currenciesData.find(currency => currency.ticker === defaultFrom);
            setFrom(fromData)
            dispatch({ type: CHANGE_FROM_CURRENCY, payload: fromData })
            return currenciesData;
        } catch (error) {
            alert('Error');
            console.error('Error')
        }
    }

    const getToCurrencies = (currenciesData, toValue) => {
        if (!toValue) {
            const toData = currenciesData.find(currency => currency.ticker === defaultTo);
            // setTo(toData ? toData : currenciesData.filter(currency => currency?.ticker !== from?.ticker)[0])
            setTo(toData)
            dispatch({ type: CHANGE_TO_CURRENCY, payload: toData })
        }
    }

    const recountTo = async (fromData = from, toData = to) => {
        if (fromData && toData) {
            setIsCounting(true)
            const fromTo = `${fromData.ticker}_${toData.ticker}`;
            let amountToValue;
            try {
                const { estimatedAmount } = await exchangeAmount(fromTo, amount);
                amountToValue = estimatedAmount
                setAmountTo(estimatedAmount)
            } catch (error) {
                amountToValue = '-'
                setAmountTo('-')
            } finally {
                const sequenceData = countSequence(amountToValue);
                setSequence(sequenceData)
                setIsCounting(false)
            }
        }
    }

    const startRecount = () => {
        dispatch({ type: CHANGE_AMOUNT, payload: amount })
        if (recountTimeout) {
          clearTimeout(recountTimeout)
        }
        recountTimeout = setTimeout(() => {
          recountTo();
        }, 500);
    }

    const toggleCurrancies = () => {
        const prevFrom = from;
        dispatch({ type: CHANGE_FROM_CURRENCY, payload: to })
        dispatch({ type: CHANGE_TO_CURRENCY, payload: prevFrom })
        setTo(prevFrom)
        setFrom(to)
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
        const amountData = Number(event.target.value);
        if (Number.isNaN(amountData)) {
            event.preventDefault();
            event.target.value = value.slice(0, -1);   
            setAmount(value.slice(0, -1))
            return false;
        } else {
            return true;
        }
    }

    const initialize = async () => {
        setInitializing(true)
        
        const storageFrom = swapData.fromCurrency
        const storageTo = swapData.toCurrency
        const lastId = swapData.transactionId
        dispatch({ type: CHANGE_AMOUNT, payload: amount })
        if (lastId) {
            history.push('/stepper')
            return;
        }
        
        if (storageFrom) {
            setFrom(storageFrom)
        }
        if (storageTo) {
            setTo(storageTo)
        }
          
        try {
            const currenciesData = await getFromCurrencies(storageFrom ? storageFrom : from);
            getToCurrencies(currenciesData, storageTo ? storageTo : to);
            await recountTo(storageFrom ? storageFrom : from, currenciesData, storageTo ? storageTo : to);
            setInitializing(false)
        } finally {
            setInitializing(false)
        }
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
                                You Send
                            </Typography>
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
                                    id="searchFrom"
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
                                <i className='fa fa-spinner' size="lg" rotation="180" spin></i>
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
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={() => history.push('/stepper')}
                        sx={{
                            height: '50px',
                            fontSize: '16px',
                            lineHeight: '22px',
                            letterSpacing: '.4px',
                            color: '#fff',
                            backgroundColor: '#00c26f',
                            border: '1px solid #00c26f',
                            p: '0 5px',
                            transition: 'background .3s ease',
                            mt: '32px',
                            "&:hover": {
                                backgroundColor: '#00c26f',
                                transform: 'scale(1)'
                            }
                        }}
                    >
                        Exchange
                    </Button>
                </Card>
            )}
        </Box>
    )
}