import React from "react";

const AchievementsList = ({ achievements, achieved, visible, achievedIcon, notAchievedIcon }) => {
    return (
        achievements.length > 0 ? (
            <div className={`achievement-list-wrapper ${visible ? 'visible' : 'hidden'}`}>
                <p className='achievement-list-title'>Achievements</p>
                <div className="achievement-list">
                    {achievements.map(achievement => {
                        return (
                            <div className="achievement-item" key={achievement.apiname}>
                                <p className='achievement-name'>{achievement.name ? achievement.name : achievement.apiname}</p>
                                <p className='achievement-status'>{achieved.some(x => x.name === achievement.name) ? achievedIcon : notAchievedIcon}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        ) : null
    );
}

export default AchievementsList;
