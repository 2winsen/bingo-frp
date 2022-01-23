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
    const newDrawnBall = document.createElement("span");
    const content = document.createTextNode(`${drawnNumbers}`);
    newDrawnBall.appendChild(content);
    drawnNumbersElement?.appendChild(newDrawnBall);
}

export function renderStatus(tick: number) {
    const statusElement = document.getElementById("status");
    let status = "Choose Card(s)";
    if (tick > 9) {
        status = "Numbers Drawing";
    }
    if (tick > 99) {
        status = "Game Ended";
    }
    if (statusElement) {
        statusElement.innerHTML = `${status} (${tick})`;
    }
}

