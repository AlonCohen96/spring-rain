// Created by Alon Cohen in March 2023

import React from "react"
import TickerSearchBar from "./TickerSearchBar";
import StockMiniBox from "./StockMiniBox";
import StockInfoBox from "./StockInfoBox";
import Watchlist from "./Watchlist";

let watchlistTickers = []
let stockTickers = []

function App() {
    const [stocks, setStocks] = React.useState([])
    const [watchlist, setWatchlist] = React.useState([])
    const [loading, setLoading] = React.useState(false);

    /*
    React.useEffect(() => {
        getStockSummary('TSLA')
    }, []);

     */
    function isObjEmpty (obj) {
        return Object.keys(obj).length === 0;
    }

    async function getStockSummary(ticker){
        setLoading(true)

        let data
        try {
            let response = await fetch(`netlify/functions/connectYahooFinanceApi?ticker=${ticker}`)
            data = await response.json()
        } catch (error){
            setLoading(false)
            alert('The requested ticker is currently unavailable in our database, please try again in a moment and check for spelling mistakes.')
            return
        }

        if (isObjEmpty(data.stockSummary)){
            setLoading(false)
            alert('The requested ticker is currently unavailable in our database, please try again in a moment and check for spelling mistakes.')
            return
        }

        try{
            const test = data.stockSummary.quoteType.symbol
        } catch (error){
            setLoading(false)
            alert('The requested ticker is currently unavailable in our database. Please try again later.')
            return
        }

        updateStocks(data.stockSummary, data.chartData1y, data.chartDataMax, data.chartData1m)
        setLoading(false)
    }


    function updateStocks(newStockData, chartData1y, chartDataMax, chartData1m){
        const symbol = newStockData.quoteType.symbol
        if (stockTickers.includes(symbol) ) {
            return
        }
        stockTickers.push(symbol)

        setStocks(prevStocks => {
            return [
                ...prevStocks,
                <StockInfoBox
                    key={symbol}
                    stockSummary={newStockData}
                    chartData1y={chartData1y}
                    chartDataMax={chartDataMax}
                    chartData1m={chartData1m}
                    closeInfoBox={closeInfoBox}
                    refresh={refresh}
                    symbol={symbol}
                    addStockToWatchlist={addStockToWatchlist}
                />
            ]
        })
    }

    function addStockToWatchlist(event){
        const symbol = event.target.parentElement.parentElement.parentElement.id
        if (watchlistTickers.includes(symbol) ) {
            return
        }
        watchlistTickers.push(symbol)

        setWatchlist(prevWatchlist => {
            return [
                ...prevWatchlist,
                <StockMiniBox
                    key={symbol}
                    symbol={symbol}
                    isStockAlreadyOpened={isStockAlreadyOpened}
                    removeFromWatchlist={removeFromWatchlist}
                />
            ]
        })
    }

    function removeFromWatchlist(event){
        const symbol = event.target.parentElement.id
        watchlistTickers = watchlistTickers.filter( ticker => ticker !== symbol )

        setWatchlist(prevWatchlist => {
            return prevWatchlist.filter( stock => stock.props.symbol !== symbol )
        })
    }

    function isStockAlreadyOpened(event){
        const symbol = event.target.parentElement.id
        if (stockTickers.includes(symbol) === false ) {
            getStockSummary(symbol)
        }
    }

    function closeInfoBox(event){
        const symbol = event.target.parentElement.parentElement.parentElement.id
        stockTickers = stockTickers.filter( ticker => ticker !== symbol )

        setStocks(prevStocks => {
            return prevStocks.filter(stock => stock.key !== symbol)
        })
    }

    function refresh(event){
        const symbol = event.target.parentElement.parentElement.parentElement.id
        getStockSummary(symbol)
        closeInfoBox(event)
    }

    function closeAll(event){
        event.preventDefault()
        setStocks([])
        stockTickers = []
    }

    return (
        <div className='app'>
            <TickerSearchBar
                stocks={stocks}
                getStockSummary={getStockSummary}
                closeAll={closeAll}
                loading={loading}
            />
            <Watchlist
                watchlist={watchlist}
            />
        </div>
    )
}

export default App;


/* ------------------- For Development ------------------- */

/*
function getStockSummary(ticker){
    setLoading(true)
    fetch(`./dummy${ticker}.json`)
        .then(response => response.json())
        .then(data => {
            fetch(`${ticker}Chart1y.json`)
                .then(response => response.json())
                .then(chartData1y => {
                    fetch(`${ticker}ChartMax.json`)
                        .then(response => response.json())
                        .then(chartDataMax => {
                            fetch(`${ticker}Chart1m.json`)
                                .then(response => response.json())
                                .then(chartData1m => updateStocks(data, chartData1y, chartDataMax, chartData1m))
                                .finally(() => setLoading(false) )
                        })
                })
                .catch(err => console.error('We could not find the requested chart: ' + err))
        })
        .catch(err => console.error('We could not find the requested ticker: ' + err))
}
 */


/*
const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'yh-finance.p.rapidapi.com'
        }
    }

    function getStockSummary(ticker){
        setLoading(true)
        fetch(`https://yh-finance.p.rapidapi.com/stock/v2/get-summary?symbol=${ticker}&region=US`, options)
            .then(response => response.json())
            .then(data => {
                fetch(`https://yh-finance.p.rapidapi.com/stock/v2/get-chart?interval=1d&symbol=${ticker}&range=1y&region=US`, options)
                    .then(response => response.json())
                    .then(chartData1y => {
                        fetch(`https://yh-finance.p.rapidapi.com/stock/v2/get-chart?interval=1d&symbol=${ticker}&range=max&region=US`, options)
                            .then(response => response.json())
                            .then(chartDataMax => {
                                fetch(`https://yh-finance.p.rapidapi.com/stock/v2/get-chart?interval=15m&symbol=${ticker}&range=1mo&region=US`, options)
                                    .then(response => response.json())
                                    .then(chartData1m => updateStocks(data, chartData1y, chartDataMax, chartData1m))
                                    .finally(() => setLoading(false) )
                            })
                    })
                    .catch(err => console.error('We could not find the requested chart: ' + err))
            })
            .catch(err => console.error('We could not find the requested ticker: ' + err))
    }
*/