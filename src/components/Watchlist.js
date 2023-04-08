import React from "react"

function Watchlist({watchlist}){
    return (
        <div className='watchlist'>
            <div className='watchlist-header'> Watchlist</div>
            {watchlist}
        </div>
    )
}

export default Watchlist