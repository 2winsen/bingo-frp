import { Card, CardsMap } from "./types";

const DAUBED = "X"

export function clear() {
    const emptyNumbers = new Array(9).fill("");
    render({ id: 0, numbers: emptyNumbers });
    render({ id: 1, numbers: emptyNumbers });
    const drawnNumbersElement = document.getElementById("drawnNumbers");
    if (drawnNumbersElement) {
        while (drawnNumbersElement.childNodes.length > 1) {
            drawnNumbersElement.removeChild(drawnNumbersElement.lastChild!);
        }
    }
}

function renderCardNumber(cardElement: HTMLElement | null, number: number | string, idx: number) {
    if (idx === 4) {
        return;
    }
    const cell = cardElement?.getElementsByClassName(`idx${idx}`)[0] as HTMLElement;
    if (cell) {
        cell.textContent = `${number}`;
        cell.style.color = (number === DAUBED) ? "#d75aff" : "#000";
    }
}

export function render({ id, numbers }: Card) {
    const cardElement = document.getElementById(`card${id}`);
    numbers.forEach((num, idx) => renderCardNumber(cardElement, num, idx));
}

export function renderDrawnNumber(drawnNumber: number, cardsMap: CardsMap | null) {
    const drawnNumbersElement = document.getElementById("drawnNumbers");
    const newDrawnNumber = document.createElement("span");
    const content = document.createTextNode(`${drawnNumber}`);
    newDrawnNumber.appendChild(content);
    drawnNumbersElement?.appendChild(newDrawnNumber);

    if (!cardsMap) {
        return;
    }

    cardsMap.forEach((card, cardIdx) => {
        const cardElement = document.getElementById(`card${cardIdx}`);
        card.numbers.forEach((number, idx) => {
            if (number === drawnNumber) {
                renderCardNumber(cardElement, DAUBED, idx);
            }
        })
    });
}

export function renderStatus(tick: number, phase: string) {
    const statusElement = document.getElementById("status");
    if (statusElement) {
        statusElement.textContent = `${phase} (${tick})`;
    }
}

