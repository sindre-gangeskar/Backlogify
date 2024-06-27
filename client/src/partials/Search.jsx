import React from 'react';
import '../css/Search.css';
import { debounce } from 'lodash';
import { RxMagnifyingGlass, RxReset } from "react-icons/rx";

function Search({ onSubmit, setAppIDVisibility, setGameTitleVisibility }) {

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const name = data.get('name');
        onSubmit(name);
    };

    const handleReset = (e) => {
        e.preventDefault();
        onSubmit('');
    };

    const debouncedToggleAppIdVisibility = debounce(e => {
        setAppIDVisibility(e.target.checked);
    }, 200);

    const debouncedToggleGameTitleVisibility = debounce(e => {
        setGameTitleVisibility(e.target.checked);
    }, 200);

    return (
        <form className='search-form' onSubmit={handleFormSubmit}>
            <input className='search' placeholder='Search for title...' name="name" autoComplete='name' required />
            <span className="buttons-wrapper">
                <button type="submit" className='search-btn'><RxMagnifyingGlass /></button>
                <button onClick={handleReset} className='reset-btn'><RxReset /></button>
                <p>Show Title</p>
                <input type="checkbox" name='toggle-game-titles' className='toggle-game-titles-btn custom-checkbox' onChange={debouncedToggleGameTitleVisibility} />
                <p>Show AppID</p>
                <input type="checkbox" name='toggle-appids' className='toggle-appids-btn custom-checkbox' onChange={debouncedToggleAppIdVisibility} />
            </span>
        </form>
    );
}

export default Search;
