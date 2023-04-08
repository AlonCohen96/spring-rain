import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Customized, ResponsiveContainer } from 'recharts';

function StockPriceChart({chartData1y, chartDataMax, chartTimeFrame, chartData1m, getPercentageChange }) {

    function preProcessChartData(chartData){
        let prices = chartData.chart.result[0].indicators.quote[0].close
        prices = prices.map( price => Math.round(price * 100 ) / 100 )

        let timestamps = chartData.chart.result[0].timestamp
        let options

        switch (chartTimeFrame){
            case '5d' || '1d' : options = {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
                }
                timestamps = timestamps.map( timestamp => new Date(timestamp * 1000).toLocaleDateString('en-CH', options) );
            break;
            default : options = {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
                }
                timestamps = timestamps.map( timestamp => new Date(timestamp * 1000).toLocaleDateString('en-CH', options) )
        }

        return timestamps.map( (timestamp, i) => ( { name: timestamp, USD: prices[i] } ) )
    }

    function setLineColor(data){
        return data.at(0).USD - data.at(-1).USD > 0 ? '#fc2003' : '#70e000'
    }

    function calculateChangeInPercentage(data){
        const startPrice = data.at(0).USD
        const endPrice = data.at(-1).USD

        const percentageChange = Math.round (( (endPrice - startPrice) / startPrice * 100 ) * 100 ) / 100

        return percentageChange > 0 ? `+${percentageChange}%` : `${percentageChange}%`
    }


    const processedChartData1y = preProcessChartData(chartData1y)
    const processedChartDataMax = preProcessChartData(chartDataMax)
    const processedChartData1m = preProcessChartData(chartData1m)

    let data

    switch (chartTimeFrame){
        case 'max': data = processedChartDataMax; break;
        case '5y': data = processedChartDataMax.slice(-62); break;
        case '1y': data = processedChartData1y; break;
        case '6m': data = processedChartData1y.slice(-125); break;
        case '1m': data = processedChartData1m; break;
        case '5d': data = processedChartData1m.slice(-250); break;
        case '1d': data = processedChartData1m.slice(-50); break;
    }

    const lineColor = setLineColor(data)
    const calculatedPercentageChange = calculateChangeInPercentage(data)


    React.useEffect(() => {
        getPercentageChange(calculatedPercentageChange, lineColor)
    }, []);

        return (
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 0,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={false} />
                    <YAxis domain={["auto"]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="USD" stroke={lineColor} activeDot={{ r: 4 }} dot={false}/>
                </LineChart>
            </ResponsiveContainer>
        );
}

export default StockPriceChart