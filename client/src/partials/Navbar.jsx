import React from 'react';
import '../css/Navbar.css';
import { Link } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
function Navbar() {
    const authenticatedRoutes = [ { path: '/', name: 'home' }, { path: '/overview', name: 'overview' }, { path: '/backlog', name: 'backlog' } ]
/*     const home = { path: '/', name: 'home' };

    const [ steamid, setSteamid ] = useState(null);
    const [ authenticated, setAuthenticated ] = useState(false);
    const [ routes, setRoutes ] = useState([ home ]);

    useEffect(() => {
        const validate = async () => {
            const response = await fetch('http://localhost:3000/auth');
            if (response.ok) {
                const data = await response.json();
                setSteamid(data.data.user.steamid64);
            }
        } 
        validate();
    }, [])
    
    useEffect(() => {
        if (steamid)
            setRoutes(authenticatedRoutes);
        else setRoutes([ home ]);
    }, [steamid])
 */
    return (
        <div className='nav navbar'>
            <h2 className="navbar-brand">Backlogify</h2>
            <ul className='navbar-group'>
                {authenticatedRoutes.map(route => {
                    return (
                        <li key={route.name} className='nav-item'>
                            <Link to={route.path} className='nav-link'>{route.name}</Link>
                        </li>
                    )
                })}
            </ul>
        </div >
    )
}

export default Navbar;