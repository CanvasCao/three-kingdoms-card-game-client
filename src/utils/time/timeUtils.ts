const isWithin30Minutes = (timestamp: number) => {
    if (typeof timestamp !== 'number') {
        return false
    }
    const now = Date.now();
    const difference = now - timestamp;
    return difference <= 30 * 60 * 1000;
}

export {
    isWithin30Minutes
}
