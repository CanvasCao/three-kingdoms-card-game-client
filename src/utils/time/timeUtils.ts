const isWithinMinutes = (timestamp: number, mins: number = 60) => {
    if (typeof timestamp !== 'number') {
        return false
    }
    const now = Date.now();
    const difference = now - timestamp;
    return difference <= mins * 60 * 1000;
}

export {
    isWithinMinutes
}
