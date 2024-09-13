class SteamService {
    async fetchAppIDDetails(appid, server, setAppDetails) {
        try {
            const response = await fetch(`${server}/library/gameDetails/${appid}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                const data = await response.json();
                setAppDetails(data.data.result.data || []);
            }
            else return;
        } catch (error) {
            console.error('Failed to fetch app details');
        }
    }

    async fetchAppReviews(appid, server, setAppReviews) {
        
    }
}


export default SteamService;