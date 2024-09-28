import React from 'react';
import useGlobalState from '../js/globalStateStore';
import Auth from '../js/auth';
import '../css/Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import SteamBacklogifyIcon from './SteamBacklogifyIcon';

function Navbar() {
    const auth = new Auth();
    const navigate = useNavigate();
    const deleteDataRef = useRef(null);
    const routes = [ { path: '/', name: 'home' }, { path: '/library', name: 'library' }, { path: '/backlog', name: 'backlog' } ]
    const [ authenticated, setAuthenticated ] = useGlobalState(state => [ state.authenticated, state.setAuthenticated ]);
    const steamid = localStorage.getItem('steamid');
    const setAuthNavbar = () => (
        <>
            <ul className='navbar-group'>
                {routes.map(route => (
                    <li key={route.name} className='nav-item'>
                        <Link to={route.path} className='nav-link'>{route.name}</Link>
                    </li>
                ))}
            </ul>

            <div className="navbar-profile-wrapper">
                <span className="nav-username">{localStorage.getItem('username')}</span>
                <img className="nav-avatar" src={localStorage.getItem('avatar')} alt="avatar" />
                <ul className='profile-dropdown'>
                    <li className='dropdown-item'>
                        <button className='btn positive' onClick={() => { auth.handleLogout(setAuthenticated, navigate) }}>Log out</button>
                    </li>
                    <li className='dropdown-item'>
                        <form className="delete-data-form" ref={deleteDataRef} onSubmit={(e => {auth.requestDeleteAccountData(e, deleteDataRef, navigate, setAuthenticated)})}>
                            <input type="hidden" name="steamid" value={steamid || ''} />
                            <button className='btn negative'>Delete my data</button>
                        </form>
                    </li>
                </ul>
            </div>
        </>
    )
    const setGuestNavbar = () => (
        <ul className="navbar-group">
            <li key={routes[ 0 ].name} className='nav-item'>
                <Link to={routes[ 0 ].path} className='nav-link'>{routes[ 0 ].name}</Link>
            </li>
        </ul>
    )
    const navbarContent = () => authenticated ? setAuthNavbar() : setGuestNavbar();
    return (
        <div className='nav navbar'>
            <h2 className="navbar-brand"><SteamBacklogifyIcon width={50} height={50} className={'navbar-icon'} /> Steam Backlogify</h2>
            {navbarContent()}
        </div >
    )
}

export default Navbar;