import { useEffect } from 'react';
import useGlobalState from '../js/globalStateStore';
import '../css/Background.css'
function Background() {
    const [ background, setBackground ] = useGlobalState(state => [ state.background, state.setBackground ]);
    const [ gamesData ] = useGlobalState(state => [ state.games ]);
    useEffect(() => {
        const getGames = new Promise((resolve, reject) => {
            if (!gamesData) return;
            if (gamesData) {
                resolve(gamesData);
            }
            else
                reject('Could not find games in storage');
        })

        const getGameBackgrounds = async () => {
            try {
                const games = await getGames;
                const filtered = games.data.appids.map(game => ({
                    appid: game.appid
                }));

                const randomize = () => {
                    const randomizedNumber = Math.floor(Math.random() * filtered.length);
                    return filtered[ randomizedNumber ];
                }
                const randomizedGame = randomize();

                setBackground(`https://steamcdn-a.akamaihd.net/steam/apps/${randomizedGame.appid}/library_hero.jpg`)
            } catch (error) {
                setBackground('/images/library_hero1.jpg');
                console.log(error);
            }

        }
        getGameBackgrounds();
    }, [ setBackground, gamesData ])


    return <img src={background} alt="library_hero.jpg" className='background' onError={() => { setBackground('https://steamcdn-a.akamaihd.net/steam/apps/420/library_hero.jpg') }} height={100} />;
}

export default Background;
