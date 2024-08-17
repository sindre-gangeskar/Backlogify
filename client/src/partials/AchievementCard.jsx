import React from "react";

const AchievementCard = ({ achievements, achievementIndex, icons }) => {
    const description = achievements[ achievementIndex ]?.description;
    const icon = icons[ achievementIndex ]?.icon
    return (
        achievements.length > 0 ? (
            <div className="achievement-window">
                <img className='icon-image' src={icon} alt={icons[ achievementIndex ]?.name + '.jpg'} />
                <p className="achievement-description">{description ? description : 'No description available'}</p>
            </div>
        ) : null
    )
}


export default AchievementCard;

