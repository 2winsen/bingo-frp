export function renderInitial() {
    render(0, new Array(9).fill(""));
    render(1, new Array(9).fill(""));
    const drawnNumbersElement = document.getElementById("drawnNumbers");
    if (drawnNumbersElement) {
        while (drawnNumbersElement.childNodes.length > 1) {
            drawnNumbersElement.removeChild(drawnNumbersElement.lastChild!);
        }
    }
}

export function render(cardIdx: number, numbers: number[]) {
    const cardElement = document.getElementById(`card${cardIdx}`);
    numbers.forEach((num, idx) => {
        if (idx === 4) {
            return;
        }
        const cell = cardElement?.getElementsByClassName(`idx${idx}`)[0];
        if (cell) {
            cell.innerHTML = `${num}`;
        }
    });
}

export function renderDrawnNumbers(drawnNumbers: number) {
    const drawnNumbersElement = document.getElementById("drawnNumbers");
    const newDrawnNumber = document.createElement("span");
    const content = document.createTextNode(`${drawnNumbers}`);
    newDrawnNumber.appendChild(content);
    drawnNumbersElement?.appendChild(newDrawnNumber);
}

export function renderStatus(tick: number, phase: string) {
    const statusElement = document.getElementById("status");
    if (statusElement) {
        statusElement.innerHTML = `${phase} (${tick})`;
    }
}

