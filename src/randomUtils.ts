function randomInt(min: number, max: number) {
    return Math.floor(
        Math.random() * (max - min + 1) + min
    );
}

function generateRandomArray(size: number) {
    return Array.from({ length: size }, () => randomInt(1, 60));
}

export function generateDrawnNumbers() {
    return generateRandomArray(20);
}

export function generateCardNumbers() {
    return generateRandomArray(9);
}