import '../css/Home.css';
import { FaSteam } from "react-icons/fa";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Auth from '../js/auth';
import useGlobalState from '../js/globalStateStore';
import SteamBacklogifyIcon from '../partials/SteamBacklogifyIcon';
const auth = new Auth();

function Home() {
    const [ authenticated, setAuthenticated ] = useGlobalState(state => [ state.authenticated, state.setAuthenticated ]);
    const navigate = useNavigate();

    /* Check Session State */
    useEffect(() => {
        const checkAuthentication = async () => {
            await auth.checkSteamAuthenticated(setAuthenticated, navigate);
        }
        checkAuthentication();
        document.title = 'Home'
    }, []);

    const loginContent = (
        <>
            <div className="steam-background">
                <SteamBacklogifyIcon width={800} height={800}></SteamBacklogifyIcon>
            </div>
            <button onClick={auth.handleLogin}>Click here to login<FaSteam size={50} className='steam-logo' /></button>
            <p>No username or password is stored when using this application</p>
        </>
    )
    const authenticatedContent = (
        <>
            <div className="user-wrapper">
                <p className='title'>Welcome, {localStorage.getItem('username')}</p>
                <div className="avatar-wrapper">
                    <img src={localStorage.getItem('avatar')} alt="avatar" />
                </div>
                <button onClick={(async () => { await auth.handleLogout(setAuthenticated, navigate) })}>Log out<FaSteam size={50} className='steam-logo' /></button>
                <div className="steam-background">
                    <SteamBacklogifyIcon width={800} height={800}></SteamBacklogifyIcon>
                    {/* <FaSteam className='steam-background' size={80 + 'vh'}></FaSteam> */}
                </div>
            </div>
        </>
    )
    const content = authenticated ? authenticatedContent : loginContent;

    return (<>
        <div className="login-wrapper">
            <div className='steamid'>
                {content}
            </div>
        </div>
    </>
    );
}

export default Home;
