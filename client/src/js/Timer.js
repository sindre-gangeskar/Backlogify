class Timer {
    delay(seconds, callback) {
        if (typeof callback !== 'function')
            throw new Error('Callback must be a function');
        const timer = setTimeout(() => {
            callback();
        }, seconds * 1000)

        return () => clearTimeout(timer);
    }
}

export default Timer;