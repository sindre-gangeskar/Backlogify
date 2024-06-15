import React from 'react'
import '../css/Search.css';
function Search() {
    return (
        <form action="/" method="get" className='search-form'>
            <input className='search' placeholder='Search for title...' required></input>
            <button type='submit' className='search-btn'>Search</button>
        </form>
    )
}

export default Search