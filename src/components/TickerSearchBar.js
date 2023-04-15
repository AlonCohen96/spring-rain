import React from "react";

function TickerSearchBar ({stocks, getStockSummary, closeAll, loading}){

    const [ticker, setTicker] = React.useState('')

    function updateTicker(event){
        setTicker(event.target.value)
    }

    function handleClickOnGetStockSummary(){
        getStockSummary(ticker);
        setTicker('')
    }

    function handleEnterKeyStroke(event){
        if (event.key === 'Enter') {
            event.preventDefault()
            handleClickOnGetStockSummary()
        }
    }

    function handleHoverInfo(event){
        event.preventDefault()
        window.open('https://github.com/AlonCohen96/spring-rain', '_blank', 'noreferrer')
    }

    return (
        <div className='ticker-search-bar-container'>
            <form className='ticker-search-bar-form'>
                <div className='ticker-search-bar-and-button-container'>
                    {loading
                        ? <div className="lds-ring">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                        : <img className='ticker-search-button'
                               onClick={handleClickOnGetStockSummary}
                               src='icons/search.svg'
                               alt='search-icon'
                        />
                    }
                    <input
                        className='ticker-search-bar'
                        name='ticker'
                        type='text'
                        placeholder='Search ticker, e.g. AAPL or UBS'
                        onChange={updateTicker}
                        onKeyDown={handleEnterKeyStroke}
                        value={ticker}
                    />
                </div>
                <div id='top-right-btn-container'>
                    <button id='close-all-btn' onClick={closeAll}>Clear all</button>
                    <img id='info-btn' onClick={handleHoverInfo} src='icons/info.svg' alt='info-icon' />
                </div>
            </form>
            <div className='stocks-container'>
                {stocks}
            </div>
        </div>
    )
}

export default TickerSearchBar

//<button id='info-btn' onClick={handleHoverInfo}>🛈</button>