const MAX_RANDOM_NUMBER = 60;

function randomInt(min: number, max: number) {
    return Math.floor(
        Math.random() * (max - min + 1) + min
    );
}

function generateRandomArray(size: number) {
    return Array.from({ length: size }, () => randomInt(1, MAX_RANDOM_NUMBER));
}

export function generateDrawnNumber() {
    return randomInt(1, MAX_RANDOM_NUMBER);
}

export function generateCardNumbers() {
    return generateRandomArray(9);
}