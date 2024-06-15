import React from 'react';
import '../css/Navbar.css';

function Navbar() {
    return (
        <div className='nav navbar'>
            <h2 className="navbar-brand">Backlogify</h2>
            <ul className='navbar-group'>
                <li className='nav-item'><a href="/home" className='nav-link'>Home</a></li>
                <li className='nav-item'><a href="/backlog" className='nav-link'>Library</a></li>
                <li className='nav-item'><a href="/backlog" className='nav-link'>Backlog</a></li>
            </ul>
        </div>
    )
}

export default Navbar;