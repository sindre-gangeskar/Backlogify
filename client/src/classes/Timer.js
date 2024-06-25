class Timer {
    delay(seconds, callback) {
        if (typeof callback !== 'function')
            throw new Error('Callback must be a function');
        setTimeout(() => {
            callback();
        }, seconds * 1000)
    }
}

export default Timer;