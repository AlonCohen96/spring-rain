
const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': process.env.API_KEY,
        'X-RapidAPI-Host': 'yh-finance.p.rapidapi.com'
    }
}

exports.handler = async function (event, context) {

    const { ticker } = event.queryStringParameters;

    let response = await fetch(`https://yh-finance.p.rapidapi.com/stock/v2/get-summary?symbol=${ticker}&region=US`, options)
    let stockSummary = await response.json();

    let response2 = await fetch(`https://yh-finance.p.rapidapi.com/stock/v2/get-chart?interval=1d&symbol=${ticker}&range=1y&region=US`, options)
    let chartData1y = await response2.json();

    let response3 = await fetch(`https://yh-finance.p.rapidapi.com/stock/v2/get-chart?interval=1d&symbol=${ticker}&range=max&region=US`, options)
    let chartDataMax = await response3.json();

    let response4 = await fetch(`https://yh-finance.p.rapidapi.com/stock/v2/get-chart?interval=15m&symbol=${ticker}&range=1mo&region=US`, options)
    let chartData1m = await response4.json();

    return {
        statusCode: 200,
        body: JSON.stringify({
            stockSummary: stockSummary,
            chartData1y: chartData1y,
            chartDataMax: chartDataMax,
            chartData1m: chartData1m
        })
    };
}

