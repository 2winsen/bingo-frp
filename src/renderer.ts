import { Card } from "./types";

export function render(cards: Card[]) {
    cards.forEach((card, cardIdx) => {
        const cardElement = document.getElementById(`card${cardIdx}`);
        card.forEach((num, idx) => {
            if (idx === 4) {
                return;
            }
            const cell = cardElement?.getElementsByClassName(`idx${idx}`)[0];
            if (cell) {
                cell.innerHTML = `${num}`;
            }
        });
    });
}

export function renderDrawnNumbers(drawnNumbers: number) {
    const drawnNumbersElement = document.getElementById("drawnNumbers");
    const newDrawnBall = document.createElement("span");
    const content = document.createTextNode(`${drawnNumbers}`);
    newDrawnBall.appendChild(content);
    drawnNumbersElement?.appendChild(newDrawnBall);
}

