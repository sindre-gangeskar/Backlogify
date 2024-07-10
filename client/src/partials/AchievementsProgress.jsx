import React from 'react';
const AchievementsProgress = React.memo(React.forwardRef(({ visible, achievements, achieved, progress, play }, ref) => {
    return (
        <>
            {achievements.length ? (
                <div className={`achievements-progress-wrapper ${visible === true ? 'visible' : 'hidden'}`}>
                    <p className='achievements-title'>{`${achieved.length} / ${achievements.length} unlocked`}</p>
                    <div className="achievements-progress-track">
                        <div className="achievements-progress-bar" style={{ width: `${play ? `${progress}%` : '0%'}` }} ref={ref}></div>
                    </div>
                </div>
            ) : (<div className={`achievements-progress-wrapper ${visible === true ? 'visible' : 'hidden'}`}>
                <h4 className='achievements-text'>No achievements exist for this game</h4>
            </div>
            )}
        </>
    )
}))

export default AchievementsProgress;