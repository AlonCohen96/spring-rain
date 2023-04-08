import React from "react";

function StockMiniBox({symbol, getStockSummary, removeFromWatchlist}){
    return (
        <div className='stock-mini-box' id={symbol}>
            <div className='watchlist-ticker' onClick={() => getStockSummary(symbol)}>{symbol}</div>
            <img className='watchlist-icon' onClick={removeFromWatchlist} src='icons/delete.svg' alt='delete-icon' />
        </div>
    )
}

export default StockMiniBox