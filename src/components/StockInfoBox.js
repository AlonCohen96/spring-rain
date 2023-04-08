import React from "react";
import OwnershipChart from './OwnershipChart.js'
import StockPriceChart from './StockPriceChart.js'
import { nanoid } from 'nanoid'

function StockInfoBox({stockSummary, chartData1y, chartDataMax, chartData1m, closeInfoBox, refresh, symbol, addStockToWatchlist}){

    const [companySummaryExpanded, setCompanySummaryExpanded] = React.useState(false)
    const [ownershipChartExpanded, setOwnershipChartExpanded] = React.useState(false)
    const [financialsExpanded, setFinancialsExpanded] = React.useState(false)
    const [keyRatiosExpanded, setKeyRatiosExpanded] = React.useState(false)
    const [earningsExpanded, setEarningsExpanded] = React.useState(false)
    const [dividendsExpanded, setDividendsExpanded] = React.useState(false)

    const [chartTimeFrame, setChartTimeFrame] = React.useState('1d')
    const [percentageChange, setPercentageChange] = React.useState()
    const [percentageChangeColor, setPercentageChangeColor] = React.useState()

    const insiderOwnership = stockSummary.majorHoldersBreakdown.insidersPercentHeld.raw
    const institutionalOwnership = stockSummary.majorHoldersBreakdown.institutionsPercentHeld.raw
    const retailOwnership = 1 - insiderOwnership - institutionalOwnership

    const financials = [
        <div key={nanoid()}>Total Revenue</div>, <div key={nanoid()}>{stockSummary.financialData.totalRevenue.fmt}</div>,
        <div key={nanoid()}>Gross Profits</div>, <div key={nanoid()}>{stockSummary.financialData.grossProfits.fmt}</div>,
        <div key={nanoid()}>Profit Margin</div>, <div key={nanoid()}>{stockSummary.financialData.profitMargins.fmt}</div>,
        <div key={nanoid()}>Gross Margins</div>, <div key={nanoid()}>{stockSummary.financialData.grossMargins.fmt}</div>,
        <div key={nanoid()}>Operating Cashflow</div>, <div key={nanoid()}>{stockSummary.financialData.operatingCashflow.fmt}</div>,
        <div key={nanoid()}>Total Cash</div>, <div key={nanoid()}>{stockSummary.financialData.totalCash.fmt}</div>,
        <div key={nanoid()}>Total Debt</div>, <div key={nanoid()}>{stockSummary.financialData.totalDebt.fmt}</div>
    ]

    const keyRatios = [
        <div key={nanoid()}>Cash per Share</div>, <div key={nanoid()}>{stockSummary.financialData.totalCashPerShare.raw}</div>,
        <div key={nanoid()}>Revenue per Share</div>, <div key={nanoid()}>{stockSummary.financialData.revenuePerShare.raw}</div>,
        <div key={nanoid()}>Return on Equity</div>,<div key={nanoid()}>{stockSummary.financialData.returnOnEquity.raw}</div>
    ]

    const earnings = [
        <div key={nanoid()}>Next Earnings Release</div>,
        <div key={nanoid()}>
            {requestDataPiece(stockSummary.calendarEvents.earnings.earningsDate)}
        </div>,
        <div key={nanoid()}>Average Earnings per Share</div>, <div key={nanoid()}>{stockSummary.calendarEvents.earnings.earningsAverage.raw}</div>
    ]

    const dividends = [
        <div key={nanoid()}>Last Dividend Value</div>, <div key={nanoid()}>{stockSummary.defaultKeyStatistics.lastDividendValue.raw}</div>,
        <div key={nanoid()}>Dividend Yield</div>, <div key={nanoid()}>{stockSummary.summaryDetail.dividendYield.fmt}</div>,
        <div key={nanoid()}>Ex-Dividend Date</div>, <div key={nanoid()}>{stockSummary.calendarEvents.exDividendDate.fmt}</div>,
        <div key={nanoid()}>Next Dividend Date</div>, <div key={nanoid()}>{stockSummary.calendarEvents.dividendDate.fmt}</div>,
    ]


    function getPercentageChange(calculatedPercentageChange, color){
        setPercentageChange(calculatedPercentageChange)
        setPercentageChangeColor(color)
    }

    function requestDataPiece(path){
        try {
            return path[0].fmt
        } catch (error){
            return 'n/a'
        }
    }

    function getUpside(){
        const potential = Math.round ((stockSummary.financialData.targetMeanPrice.raw - stockSummary.price.regularMarketPrice.raw) / stockSummary.price.regularMarketPrice.raw * 100 )
        return potential > 0 ? `▲ ${potential}%` : `▼ ${potential}`
    }

    function getBuyRating(){
        return stockSummary.financialData.targetMeanPrice.raw > stockSummary.price.regularMarketPrice.raw
    }

    function expandCompanySummary(){
        setCompanySummaryExpanded(prevState => !prevState)
    }

    function expandFinancials(){
        setFinancialsExpanded(prevState => !prevState)
    }

    function expandKeyRatios(){
        setKeyRatiosExpanded(prevState => !prevState)
    }

    function expandEarnings(){
        setEarningsExpanded(prevState => !prevState)
    }

    function expandDividends(){
        setDividendsExpanded(prevState => !prevState)
    }

    function expandOwnershipPieChart(event){
        setOwnershipChartExpanded(prevState => !prevState)

        let ownerShipChartContainerElement
        let displayProperty

        try {
            ownerShipChartContainerElement = event.target.nextElementSibling
            displayProperty = window.getComputedStyle(ownerShipChartContainerElement, null).getPropertyValue("display")

        } catch (error){
            ownerShipChartContainerElement = event.target.parentElement.nextElementSibling
            displayProperty = window.getComputedStyle(ownerShipChartContainerElement, null).getPropertyValue("display")
        }

        switch (displayProperty){
            case 'block': ownerShipChartContainerElement.style.display = 'none'; break;
            case 'none': ownerShipChartContainerElement.style.display = 'block'; break;
        }
    }

    function handleClickChartTimeFrame(event){
        const symbol = event.target.parentElement.parentElement.parentElement.id
        const stockInfoBoxElement = document.getElementById(symbol)

        for (let subElement of stockInfoBoxElement.children){
            if (subElement.classList.contains('details-container')){
                for (let kid of subElement.children){
                    if (kid.classList.contains('time-frame-buttons-container') ){
                        for (let button of kid.children){
                            button.classList.remove('active-time-frame-button')
                        }
                    }
                }
            }
        }

        event.target.classList.add('active-time-frame-button')
        setChartTimeFrame(event.target.name)
    }

    function getArrowIconDirection(expandedState){
        return expandedState ? 'up'  : 'down'
    }

    return (
        <div className='stock-info-box' id={symbol}>
            <div className='stock-info-box-header'>
                <div className={'stock-symbol'}>{symbol}</div>
                <div className='button-container'>
                    <img className='stock-info-box-icon' onClick={refresh} src='icons/refresh.svg' alt='refresh-icon' />
                    <img className='stock-info-box-icon' onClick={addStockToWatchlist} src='icons/add.svg' alt='add-icon' />
                    <img className='stock-info-box-icon' onClick={closeInfoBox} src='icons/close.svg' alt='close-icon' />
                </div>
            </div>

            <div className='details-container'>
                <div className='company-name'>{stockSummary.quoteType.shortName}</div>
                <div className='stock-price'>${stockSummary.price.regularMarketPrice.raw}</div>
                <div className='percentage-change' style={{color: percentageChangeColor}}>{percentageChange}</div>
                <div className='time-frame-buttons-container'>
                    <button name='1d' className='active-time-frame-button' onClick={handleClickChartTimeFrame}>1d</button>
                    <button name='5d' onClick={handleClickChartTimeFrame}>5d</button>
                    <button name='1m' onClick={handleClickChartTimeFrame}>1m</button>
                    <button name='6m' onClick={handleClickChartTimeFrame}>6m</button>
                    <button name='1y' onClick={handleClickChartTimeFrame}>1y</button>
                    <button name='5y' onClick={handleClickChartTimeFrame}>5y</button>
                    <button name='max' onClick={handleClickChartTimeFrame}>Max</button>
                </div>

                <div className='stock-price-chart-container'>
                    <StockPriceChart chartData1y={chartData1y} chartDataMax={chartDataMax} chartData1m={chartData1m} chartTimeFrame={chartTimeFrame} getPercentageChange={getPercentageChange} percentageChange={percentageChange}></StockPriceChart>
                </div>

                <div className='analyst-ratings-container'>
                    <div className={`price-target-container ${getBuyRating()? 'buy' : 'sell'}`}>
                        <div>Target</div>
                        <div>${Math.round(stockSummary.financialData.targetMeanPrice.raw)}</div>
                        <div>{getUpside()}</div>
                    </div>
                    <div className='consensus-container'>
                        <div>Consensus</div>
                        <div>{getBuyRating()? 'Buy' : 'Sell'}</div>
                        <div>Based on {stockSummary.financialData.numberOfAnalystOpinions.raw} Analyst Ratings</div>
                    </div>
                </div>

                <div className='section-container'>
                    <div className='section-header' onClick={expandCompanySummary}>
                        Company Profile
                        <img className='arrow-icon' src={`icons/arrow_${getArrowIconDirection(companySummaryExpanded)}.svg`} alt='arrow-icon'/>
                    </div>
                    <div className='company-profile'>{companySummaryExpanded && stockSummary.summaryProfile.longBusinessSummary}</div>
                </div>


                <div className='section-container' >
                    <div className='section-header' onClick={expandOwnershipPieChart}>
                        Ownership
                        <img className='arrow-icon' src={`icons/arrow_${getArrowIconDirection(ownershipChartExpanded)}.svg`} alt='arrow-icon'/>
                    </div>

                    <div className='ownership-chart-container'>
                        <OwnershipChart insiderOwnership={insiderOwnership} institutionalOwnership={institutionalOwnership} retailOwnership={retailOwnership}></OwnershipChart>
                        <div>{stockSummary.quoteType.shortName} Shareholder Makeup as of {new Date().toLocaleDateString('en-CH',{day: 'numeric', month: 'long', year: 'numeric'} ) }.</div>
                    </div>
                </div>

                <div className='section-container'>
                    <div className='section-header' onClick={expandFinancials}>
                        Financials
                        <img className='arrow-icon' src={`icons/arrow_${getArrowIconDirection(financialsExpanded)}.svg`} alt='arrow-icon'/>
                    </div>
                    <div className='list-content'>
                        {financialsExpanded && financials}
                    </div>
                </div>

                <div className='section-container'>
                    <div className='section-header' onClick={expandKeyRatios}>
                        Key Ratios
                        <img className='arrow-icon' src={`icons/arrow_${getArrowIconDirection(keyRatiosExpanded)}.svg`} alt='arrow-icon'/>
                    </div>
                    <div className='list-content'>
                        {keyRatiosExpanded && keyRatios}
                    </div>
                </div>

                <div className='section-container'>
                    <div className='section-header' onClick={expandEarnings}>
                        Earnings
                        <img className='arrow-icon' src={`icons/arrow_${getArrowIconDirection(earningsExpanded)}.svg`} alt='arrow-icon'/>
                    </div>
                    <div className='list-content'>
                        {earningsExpanded && earnings}
                    </div>
                </div>

                <div className='section-container'>
                    <div className='section-header' onClick={expandDividends}>
                        Dividends
                        <img className='arrow-icon' src={`icons/arrow_${getArrowIconDirection(dividendsExpanded)}.svg`} alt='arrow-icon'/>
                    </div>
                    <div className='list-content'>
                        {dividendsExpanded && dividends}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default StockInfoBox

//function isObjectEmpty(obj){
//         return Object.keys(obj).length !== 0
//     }

//{ isObjectEmpty(stockSummary) && <pre id={symbol}>{JSON.stringify(stockSummary, null, 2)}</pre> }
