import React, { useEffect, useState } from 'react';
import useGlobalState from '../js/globalStateStore';
import '../css/Background.css'
function Background() {
    const [ gamesData ] = useGlobalState(state => [ state.games ]);
    const [ background, setBackground ] = useGlobalState(state => [ state.background, state.setBackground ]);

    useEffect(() => {
        const getGames = new Promise((resolve, reject) => {
            if (gamesData) {
                resolve(gamesData);
                console.log(gamesData);
            }
            else reject('Could not find games in storage');
        })

        const getGameBackgrounds = async () => {
            try {
                await getGames;
                const filtered = gamesData.data.appids.map(game => ({
                    appid: game.appid
                }));

                const randomize = () => {
                    const randomizedNumber = Math.floor(Math.random() * filtered.length);
                    return filtered[ randomizedNumber ];
                }
                const randomizedGame = randomize();

                setBackground(`https://steamcdn-a.akamaihd.net/steam/apps/${randomizedGame.appid}/library_hero.jpg`)
            } catch (error) {
                console.log(error);
                setBackground('/public/images/library_hero1.jpg');
            }

        }
        getGameBackgrounds();
    }, [ gamesData, setBackground ])

    return <img src={background} alt="library_hero.jpg" className='background' onError={() => {setBackground('/public/images/library_hero1.jpg')}} height={100} />;
}

export default Background;
