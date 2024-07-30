class Auth {
    handleLogin() {
        location.href = 'http://localhost:3000/auth/login';
    }
    async checkSteamAuthenticated(authenticationState, navHook) {
        try {
            const response = await fetch('http://localhost:3000/auth', {
                method: 'GET',
                credentials: 'include'
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
            const response = await fetch('http://localhost:3000/auth', { method: 'GET', credentials: 'include' });
            if (response.ok) {
                const data = await response.json();
                if (!data.data.authenticated) {
                    authenticationState(false);
                    localStorage.clear();
                    window.dispatchEvent(new Event('storage'));
                    navHook('/');
                    clearInterval(sessionInterval)
                }
            }
        }

        const sessionInterval = setInterval(async () => {
            await checkSession();
        }, 1000 * 60 * 15)

    }
    async handleLogout(authenticationState, navHook) {
        if (confirm('Are you sure you want to log out?')) {
            this.logout()
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
        const response = await fetch('http://localhost:3000/auth/logout', {
            method: 'GET',
            credentials: 'include'
        });
        if (response.ok) {
            const data = await response.json();
            console.log(data.data.message);
            localStorage.clear();
            window.dispatchEvent(new Event('storage'));
        } else {
            console.log('Failed to log out');
        }
    }
}

export default Auth;