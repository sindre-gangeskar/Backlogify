import React from "react"
const GamesWrapper = React.forwardRef(({ content }, ref) => {
    return (
        <div className="games-wrapper" ref={ref}>
            {content}
        </div>
    );
});

export default GamesWrapper