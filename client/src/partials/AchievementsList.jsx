import React from "react";

const AchievementsList = ({ achievements, achieved, visible, achievedIcon, notAchievedIcon, icons, setAchievementIndex }) => {
    return (
        achievements.length > 0 ? (
            <div className={`achievement-list-wrapper ${visible ? 'visible' : 'hidden'}`}>
                <p className='achievement-list-title'>Achievements</p>
                <div className="achievement-list">
                    {achievements.map((achievement, index) => {
                        const isAchieved = achieved.some(x => x.name === achievement.name);
                        const icon = icons[ index ];
                        return (
                            <div className="achievement-item" key={achievement.apiname} onMouseEnter={() => { setAchievementIndex(index) }}>
                                <span className='achievement-container'><p>{achievement.name ? achievement.name : achievement.apiname}</p></span>
                                <p className='achievement-status'>{isAchieved ? achievedIcon : notAchievedIcon}</p>
                                {<img className="achievement-icon" src={isAchieved ? icon.icon : icon.icongray}></img>}
                            </div>
                        );
                    })}
                </div>
            </div>
        ) : null
    );
}

export default AchievementsList;
