function trySafely(fn) {
    try {
        return fn();
    } catch (error) {
        console.error('Error caught:', error.message);
        console.error('Stack trace:', error.stack);
    }
}

module.exports = {
    trySafely
}