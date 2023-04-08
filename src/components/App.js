import React from "react"
import TickerSearchBar from "./TickerSearchBar";
import StockMiniBox from "./StockMiniBox";
import StockInfoBox from "./StockInfoBox";
import Watchlist from "./Watchlist";

let watchlistTickers = []
let stockTickers = []

const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '',
        'X-RapidAPI-Host': 'yh-finance.p.rapidapi.com'
    }
}

function App() {
    const [stocks, setStocks] = React.useState([])
    const [watchlist, setWatchlist] = React.useState([])
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        fetch(".netlify/functions/getApiKey")
            .then(response => response.json())
            .then(data => {
                options.headers = {
                    'X-RapidAPI-Key': data.apiKey,
                    'X-RapidAPI-Host': 'yh-finance.p.rapidapi.com'
                }
                getStockSummary('TSLA')
            })
    }, []);

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
                                    .catch(err => console.error('We could not find the requested ticker: ' + err))
                                    .finally(() => setLoading(false) )
                            })
                    })
            })
    }

    function updateStocks(newStockData, chartData1y, chartDataMax, chartData1m){
        const symbol = newStockData.quoteType.symbol
        if (stockTickers.includes(symbol) ) {
            return
        }
        stockTickers.push(symbol)

        setStocks(prevStocks => {
            return [...prevStocks, <StockInfoBox key={symbol} stockSummary={newStockData} chartData1y={chartData1y} chartDataMax={chartDataMax} chartData1m={chartData1m} closeInfoBox={closeInfoBox} refresh={refresh} symbol={symbol} addStockToWatchlist={addStockToWatchlist}/> ]
        })
    }

    function addStockToWatchlist(event){
        const symbol = event.target.parentElement.parentElement.parentElement.id
        if (watchlistTickers.includes(symbol) ) {
            return
        }
        watchlistTickers.push(symbol)

        setWatchlist(prevWatchlist => {
            return [...prevWatchlist, <StockMiniBox key={symbol} symbol={symbol} getStockSummary={getStockSummary} removeFromWatchlist={removeFromWatchlist}/>]
        })
    }

    function removeFromWatchlist(event){
        const symbol = event.target.parentElement.id
        watchlistTickers = watchlistTickers.filter( ticker => ticker !== symbol )

        setWatchlist(prevWatchlist => {
            return prevWatchlist.filter( stock => stock.props.symbol !== symbol )
        })
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
            <TickerSearchBar stocks={stocks} getStockSummary={getStockSummary} closeAll={closeAll} loading={loading} />
            <Watchlist watchlist={watchlist}/>
        </div>
    )
}

export default App;

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