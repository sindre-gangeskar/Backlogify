import React from 'react';
import '../css/Navbar.css';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
function Navbar() {
    const authenticatedRoutes = [ { path: '/', name: 'home' }, { path: '/overview', name: 'overview' }, { path: '/backlog', name: 'backlog' } ]
    const [ navbarContent, setNavbarContent ] = useState();
    const authenticated = !!localStorage.getItem('steamid');

    const initNavbar = () => {
        if (authenticated) {
            setNavbarContent(
                <>
                    {authenticatedRoutes.map(route => (
                        <li key={route.name} className='nav-item'>
                            <Link to={route.path} className='nav-link'>{route.name}</Link>
                        </li>
                    ))}
                </>
            )
        } else {
            setNavbarContent(
                <li key={authenticatedRoutes[ 0 ].name} className='nav-item'>
                    <Link to={authenticatedRoutes[ 0 ].path} className='nav-link'>{authenticatedRoutes[ 0 ].name}</Link>
                </li>
            )
        }
    }


    useEffect(() => {
        initNavbar();
    }, [ authenticated, navbarContent ])

    return (
        <div className='nav navbar'>
            <h2 className="navbar-brand">Backlogify</h2>
            <ul className='navbar-group'>
                {navbarContent}
            </ul>
        </div >
    )
}

export default Navbar;