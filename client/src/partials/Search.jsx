import React from 'react';
import { useState } from 'react';
import '../css/Search.css';
import { debounce } from 'lodash';
import { RxMagnifyingGlass, RxReset } from "react-icons/rx";
import { HiOutlineCog8Tooth, HiCog8Tooth } from "react-icons/hi2";
import { FaCirclePlus, FaCircleMinus } from "react-icons/fa6";
import useGlobalState from '../js/globalStateStore';

function Search({ onSubmit, setAppIDVisibility, setGameTitleVisibility, increaseScale, decreaseScale, scaleValue, set25PerPage, set50PerPage, set100PerPage, seeAllGames }) {
    const [ settingsShown, setSettingsShown ] = useState(false);
    const [ setOrder ] = useGlobalState(state => [ state.setOrder ]);
    const [ showAppID, setShowAppID ] = useGlobalState(state => [ state.showAppID, state.setShowAppID ]);
    const [ showGameTitle, setShowGameTitle ] = useGlobalState(state => [ state.showGameTitle, state.setShowGameTitle ]);

    const textSizesArr = [ 'sm', 'md', 'lg', 'xl' ];
    const toggleSettings = () => {
        setSettingsShown(!settingsShown);
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

    const toggleAppID = (e) => {
        setShowAppID(e.target.checked);
    }
    const toggleGametitle = (e) => {
        setShowGameTitle(e.target.checked)
    }

    const orderAscending = () => {
        setOrder('asc');
        console.log('sorting by asc')
    }
    const orderDescending = () => {
        setOrder('desc');
        console.log('sorting by desc')
    }

    return (
        <>
            <div className="search-wrapper">
                <form className='search-form' onSubmit={handleFormSubmit}>
                    <input className='search' placeholder='Search for title...' name="name" autoComplete='name' required />
                    <span className="buttons-wrapper">
                        <button type="submit" className='search-btn'><RxMagnifyingGlass /></button>
                        <button onClick={handleReset} className='reset-btn'><RxReset /></button>
                        <button type='button' className={`settings-btn ${settingsShown ? 'active' : ''}`} onClick={toggleSettings}>{settingsShown ? <HiCog8Tooth /> : <HiOutlineCog8Tooth />}</button>
                    </span>
                </form>

                <div className="settings-wrapper">
                    <ul className={`settings-menu ${settingsShown ? 'shown' : ''}`}>Options
                        <div className="divider"></div>
                        <li className='list-item'>
                            <p>Show AppIDs</p>
                            <input type="checkbox" name='toggle-appids' className='toggle-appids-btn custom-checkbox' onChange={toggleAppID} checked={showAppID} />
                        </li>
                        <li className='list-item'>
                            <p>Show game titles</p>
                            <input type="checkbox" name='toggle-game-titles' className='toggle-game-titles-btn custom-checkbox' onChange={toggleGametitle} checked={showGameTitle} />
                        </li>
                        <div className="divider"></div>
                        <p>Set games size</p>
                        <li className='list-item zoom-btn-group'>
                            <button className='zoom-in' onClick={increaseScale}><FaCirclePlus className='zoom-in-icon'></FaCirclePlus></button>
                            <p className='scale-text'>{textSizesArr[ scaleValue ]}</p>
                            <button className='zoom-out' onClick={decreaseScale}><FaCircleMinus className='zoom-out-icon'></FaCircleMinus></button>
                        </li>
                        <div className="divider"></div>
                        <p>Games per page</p>
                        <li className='list-item'>
                            <button className='btn positive' onClick={set25PerPage}>25</button>
                            <button className='btn positive' onClick={set50PerPage}>50</button>
                            <button className='btn positive' onClick={set100PerPage}>100</button>
                            <button className='btn positive' onClick={seeAllGames}>All</button>
                        </li>
                        <div className="divider"></div>
                        <p>Order by title</p>
                        <li className='list-item'>
                            <button className='btn positive' onClick={orderAscending}>A-Z</button>
                            <button className='btn positive' onClick={orderDescending}>Z-A</button>
                        </li>
                    </ul>
                </div>
            </div >
        </>
    );
}

export default Search;
