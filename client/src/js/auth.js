const serverURL = import.meta.env.VITE_SERVER_BASEURL;
class Auth {
    handleLogin() {
        location.href = `${import.meta.env.VITE_SERVER_BASEURL}/auth/login`;
    }

    async checkSteamAuthenticated(authenticationState, navHook) {
        try {
            const response = await fetch(`${serverURL}/auth`, {
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
                        navHook('/library');
                    }

                    window.dispatchEvent(new Event('storage'));
                }
            }
            else {
                authenticationState(false);
            }
        } catch (error) {
            console.error('Error checking authentication status:', error);
            authenticationState(false);
        }
    };
    async checkSession(navHook, authenticationState) {
        const checkSession = async () => {
            const response = await fetch(`${serverURL}/auth`, { method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json' } });
            if (response.ok) {
                const data = await response.json();
                if (!data.data.authenticated) {
                    clearInterval(sessionInterval)
                    authenticationState(false);
                    localStorage.clear();
                    window.dispatchEvent(new Event('storage'));
                    navHook('/');
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
        await this.logout();
        authenticationState(false);
        navHook('/');
    }
    async logout() {
        const response = await fetch(`${serverURL}/auth/logout`, {
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
    async requestDeleteAccountData(event, ref, navHook, authenticationState) {
        event.preventDefault();
        const form = new FormData(ref.current);
        const steamId = form.get('steamid');

        if (confirm('Are you sure you want to delete your data?\nThis will clear out your backlog entirely')) {
            try {
                const response = await fetch(`${serverURL}/backlog/account`,
                    {
                        method: 'DELETE',
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ steamId }),
                        mode: 'cors'
                    });
                if (response.ok) {
                    await this.logout();
                    authenticationState(false);
                    navHook('/');
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