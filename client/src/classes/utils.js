class Utils {
    scrollToTop(elementRef) {
        if (elementRef.current)
            elementRef.current.scrollTo('', 0);
        else return;
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
                        /*       navHook('/overview'); */
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
    /* 
        async checkSession(navHook) {
            const checkSession = async () => {
                const response = await fetch('http://localhost:3000/auth', { method: 'GET', credentials: 'include' });
                if (response.ok) {
                    console.log('Fetched from server');
                }
            }
    
            const sessionInterval = setInterval(async () => {
                await checkSession();
            }, 5000)
    
        } */
    handleLogin() {
        location.href = 'http://localhost:3000/auth/login';
    }

    async handleLogout(authenticationState) {
        const response = await fetch('http://localhost:3000/auth/logout', {
            method: 'GET',
            credentials: 'include'
        });
        if (response.ok) {
            const data = await response.json();
            console.log(data.data.message);
            authenticationState(false);
            localStorage.clear();
            window.dispatchEvent(new Event('storage'));
        } else {
            console.log('Failed to log out');
        }
    }

}

export default Utils;