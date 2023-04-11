import React from "react";

function StockMiniBox( {symbol, removeFromWatchlist, isStockAlreadyOpened} ){

    return (
        <div className='stock-mini-box' id={symbol}>
            <div className='watchlist-ticker' onClick={isStockAlreadyOpened}>{symbol}</div>
            <img className='watchlist-icon' onClick={removeFromWatchlist} src='icons/delete.svg' alt='delete-icon' />
        </div>
    )
}

export default StockMiniBox