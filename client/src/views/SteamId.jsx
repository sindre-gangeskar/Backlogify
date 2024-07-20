import '../css/SteamId.css';
import { FaSteam } from "react-icons/fa";
import { useEffect, useState } from 'react';
import Navbar from '../partials/Navbar';
function SteamId() {
    const [ authenticated, setAuthenticated ] = useState(false);

    useEffect(() => {
        const checkSteamAuthenticated = async () => {
            try {
                const response = await fetch('http://localhost:3000/auth');

                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    if (data.data.authenticated === true) {
                        setAuthenticated(true);
                        localStorage.setItem('steamid', data.data.user.steamid64)
                        localStorage.setItem('username', data.data.user.personaname)
                        localStorage.setItem('avatar', data.data.user.avatarfull)
                        window.dispatchEvent(new Event('storage'));
                    }
                }

                else {
                    setAuthenticated(false);
                }
            } catch (error) {
                console.error('Error checking authentication status:', error);
            }
        };

        checkSteamAuthenticated();
    }, []);

    async function handleLogin() {
        location.href = 'http://localhost:3000/auth/login';
    }

    async function handleLogout() {
        const response = await fetch('http://localhost:3000/auth/logout');
        if (response.ok) {
            const data = await response.json();
            setAuthenticated(false);
            localStorage.clear();
            window.dispatchEvent(new Event('storage'));
        }
    }

    return (<>
        <div className="login-wrapper">
            <div className='steamid'>
                {authenticated === false ? (
                    <>
                        <button onClick={handleLogin}>Click here to login<FaSteam size={50} className='steam-logo' /></button>
                        <p>No username or password is stored when using this application</p>
                    </>
                ) :
                    <>
                        <div className="user-wrapper">
                            <h1 className='title'>Welcome, {localStorage.getItem('username')}</h1>
                            <div className="avatar-wrapper">
                                <img src={localStorage.getItem('avatar')} alt="avatar" />
                            </div>
                            <button onClick={handleLogout}>Log out<FaSteam size={50} className='steam-logo' /></button>
                            <div className="steam-background">
                                <FaSteam className='steam-background' size={1000}></FaSteam>
                            </div>
                        </div>
                    </>
                }
            </div>
        </div>
    </>
    );
}

export default SteamId;
