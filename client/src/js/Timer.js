class Timer {
    async delay(seconds) {
        return new Promise(resolve => {
            setTimeout(resolve, seconds * 1000);
        });
    }
}

export default Timer;