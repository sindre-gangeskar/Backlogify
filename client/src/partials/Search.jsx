import React from 'react'
import '../css/Search.css';
function Search({ onSubmit }) {

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target)
        const name = data.get('name');
        onSubmit(name);
    } 

    const handleReset = e => {
        e.preventDefault();
        onSubmit('');
    }

    return (
        <form className='search-form' onSubmit={handleFormSubmit}>
            <input className='search' placeholder='Search for title...' name="name" required></input>
            <button type="submit">Search</button>
            <button onClick={handleReset}>Reset</button>
        </form>
    )
}

export default Search