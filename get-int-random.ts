function getIntRandom(start: number, end: number): number {
    if (end - start <= 0) {
        throw new Error('arg end should larger than start');
    }
    
    return Math.floor(Math.random() * (end - start))
}