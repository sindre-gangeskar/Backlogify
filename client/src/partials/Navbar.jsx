import React from 'react';
import '../css/Navbar.css';
import { Link } from 'react-router-dom';
function Navbar() {
    const routes = [ { path: '/', name: 'home' }, { path: '/overview', name: 'overview' }, { path: '/backlog', name: 'backlog' } ]
    return (
        <div className='nav navbar'>
            <h2 className="navbar-brand">Backlogify</h2>
            <ul className='navbar-group'>
                {routes.map(route => {
                    return (
                        <li key={route.name} className='nav-item'>
                            <Link to={route.path} className='nav-link'>{route.name}</Link>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default Navbar;