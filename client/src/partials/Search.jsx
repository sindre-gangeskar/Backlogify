import React from 'react';
import { useState } from 'react';
import '../css/Search.css';
import { debounce, drop } from 'lodash';
import { RxMagnifyingGlass, RxReset } from "react-icons/rx";
import { RxHamburgerMenu } from "react-icons/rx";

function Search({ onSubmit, setAppIDVisibility, setGameTitleVisibility }) {
    const [ dropdownShown, setDropdownShown ] = useState(false);

    const toggleDown = () => {
        setDropdownShown(!dropdownShown);
        console.log(dropdownShown);
    }

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
        <>
            <div className="search-wrapper">
                <form className='search-form' onSubmit={handleFormSubmit}>
                    <input className='search' placeholder='Search for title...' name="name" autoComplete='name' required />
                    <span className="buttons-wrapper">
                        <button type="submit" className='search-btn'><RxMagnifyingGlass /></button>
                        <button onClick={handleReset} className='reset-btn'><RxReset /></button>
                        <button type='button' className={`dropdown-btn ${dropdownShown ? 'active' : ''}`} onClick={toggleDown}><RxHamburgerMenu /></button>
                    </span>
                </form>

                <div className="dropdown-wrapper">
                    <ul className={`dropdown-menu ${dropdownShown ? 'shown' : ''}`}>
                        <li className='list-item'>
                            <p>Show Game Titles</p>
                            <input type="checkbox" name='toggle-game-titles' className='toggle-game-titles-btn custom-checkbox' onChange={debouncedToggleGameTitleVisibility} />
                        </li>
                        <li className='list-item'>
                            <p>Show AppIDs</p>
                            <input type="checkbox" name='toggle-appids' className='toggle-appids-btn custom-checkbox' onChange={debouncedToggleAppIdVisibility} />
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}

export default Search;
