import '../css/Home.css';
import { FaSteam } from "react-icons/fa";
import { useEffect, useState } from 'react';
import { useBlocker, useNavigate } from 'react-router-dom';
import Auth from '../js/auth';
import useGlobalState from '../js/globalStateStore';
const auth = new Auth();

function Home() {
    const [ authenticated, setAuthenticated ] = useGlobalState(state => [ state.authenticated, state.setAuthenticated ]);
    const navigate = useNavigate();

    /* Check Session State */
    useEffect(() => {
        auth.checkSteamAuthenticated(setAuthenticated, navigate, () => {

        });
        document.title = 'Home'
    }, []);

    const loginContent = (
        <>
            <button onClick={(async () => { auth.handleLogin(setAuthenticated) })}>Click here to login<FaSteam size={50} className='steam-logo' /></button>
            <p>No username or password is stored when using this application</p>
        </>
    )
    const authenticatedContent = (
        <>
            <div className="user-wrapper">
                <h1 className='title'>Welcome, {localStorage.getItem('username')}</h1>
                <div className="avatar-wrapper">
                    <img src={localStorage.getItem('avatar')} alt="avatar" />
                </div>
                <button onClick={(() => { auth.handleLogout(setAuthenticated, navigate) })}>Log out<FaSteam size={50} className='steam-logo' /></button>
                <div className="steam-background">
                    <FaSteam className='steam-background' size={80 + 'vh'}></FaSteam>
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
