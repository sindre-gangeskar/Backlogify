const baseURL = import.meta.env.VITE_SERVER_BASEURL;
class Auth {
    handleLogin() {
        location.href = `${import.meta.env.VITE_SERVER_BASEURL}/auth/login`;
    }

    async checkSteamAuthenticated(authenticationState, navHook) {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_BASEURL}/auth`, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                if (data.data.authenticated) {
                    authenticationState(true);

                    localStorage.setItem('steamid', data.data.user.steamid64)
                    localStorage.setItem('username', data.data.user.personaname)
                    localStorage.setItem('avatar', data.data.user.avatarfull)
                    if (!localStorage.getItem('redirected')) {
                        localStorage.setItem('redirected', true);
                        navHook('/overview');
                    }

                    window.dispatchEvent(new Event('storage'));
                }
                else {
                    authenticationState(false);
                    localStorage.clear();
                }
            }
            else {
                authenticationState(false);
                localStorage.clear();
            }
        } catch (error) {
            console.error('Error checking authentication status:', error);
            authenticationState(false);
            localStorage.clear();
        }
    };
    async checkSession(navHook, authenticationState) {
        const checkSession = async () => {
            const response = await fetch(`${baseURL}/auth`, { method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json' } });
            if (response.ok) {
                const data = await response.json();
                if (!data.data.authenticated) {
                    authenticationState(false);
                    localStorage.clear();
                    navHook('/');
                    clearInterval(sessionInterval)
                    window.dispatchEvent(new Event('storage'));
                }
            }
        }

        const sessionInterval = setInterval(async () => {
            await checkSession();
        }, 1000 * 60 * 15)

    }
    async handleLogout(authenticationState, navHook) {
        if (confirm('Are you sure you want to log out?')) {
            await this.logout();
            authenticationState(false);
            navHook('/');
        } else return;
    }
    async inactiveLogout(authenticationState, navHook) {
        this.logout();
        authenticationState(false);
        navHook('/');
    }
    async logout() {
        const response = await fetch(`${baseURL}/auth/logout`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
            localStorage.clear();
            window.dispatchEvent(new Event('storage'));
        } else {
            console.log('Failed to log out');
        }
    }
    async requestDeleteAccountData(steamid, navHook) {
        if (confirm('Are you sure you want to delete your data?\nThis will clear out your backlog entirely')) {
            try {
                const response = await fetch(`${baseURL}/backlog/${steamid}`,
                    {
                        method: 'DELETE',
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/json' }
                    });
                if (response.ok) {
                    navHook('/');
                    this.logout();
                } else {
                    console.log('Failed to fetch response');
                    return;
                }
            } catch (error) {
                console.error('An error has occurred:', error);
            }
        } else {
            return console.log('User canceled the deletion');
        }
    }

}

export default Auth;