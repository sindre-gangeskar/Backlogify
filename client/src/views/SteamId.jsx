import '../css/SteamId.css';
import { FaSteam } from "react-icons/fa";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Utils from '../classes/utils';
const utils = new Utils();

function SteamId() {
    const [ authenticated, setAuthenticated ] = useState(false);
    const navigate = useNavigate();

    /* Check Session State */
    useEffect(() => {
        utils.checkSteamAuthenticated(setAuthenticated, navigate);
    }, []);

    const loginContent = (
        <>
            <button onClick={(async () => { utils.handleLogin(setAuthenticated) })}>Click here to login<FaSteam size={50} className='steam-logo' /></button>
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
                <button onClick={(() => {utils.handleLogout(setAuthenticated)})}>Log out<FaSteam size={50} className='steam-logo' /></button>
                <div className="steam-background">
                    <FaSteam className='steam-background' size={1000}></FaSteam>
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

export default SteamId;
