import React from 'react'
import '../css/Search.css';
function Search({ onSubmit, setVisible }) {

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target)
        const name = data.get('name');
        onSubmit(name);
    }

    const handleReset = (e) => {
        e.preventDefault();
        onSubmit('');
    }

    const toggleAppIdVisibility = e => {
        setVisible(e.target.checked);
    }
    return (
        <form className='search-form' onSubmit={handleFormSubmit}>
            <input className='search' placeholder='Search for title...' name="name" autoComplete='name' required></input>
            <button type="submit">Search</button>
            <button onClick={handleReset}>Reset</button>
            <span className="buttons-wrapper">
                <p>Show AppID</p>
                <input type="checkbox" name='toggle-appids' className='toggle-appids-btn custom-checkbox' onChange={toggleAppIdVisibility} />
            </span>
        </form>
    )
}

export default Search