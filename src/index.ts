import { combineLatest, fromEvent, last, map, merge, of, scan, startWith, switchMap, take, takeWhile, tap, timer } from "rxjs";
import "./index.css";
import { generateCardNumbers, generateDrawnNumbers } from "./randomUtils";
import { clear, render, renderDrawnNumber, renderStatus } from "./renderer";
import { Card, CardsMap } from "./types";

const CARD_SELECTION_TIME = 10;
const NUMBERS_DRAWING_TIME = 20;

const cardClickStream = (card: HTMLElement) => fromEvent<MouseEvent>(card, "click")
    .pipe(
        map(() => +card.id.slice(-1)),
    );

const card0 = document.getElementById("card0") as HTMLElement;
const card1 = document.getElementById("card1") as HTMLElement;
const cardsGenerationStream = merge(
    cardClickStream(card0),
    cardClickStream(card1),
)
    .pipe(
        map<number, Card>(id => ({ id, numbers: generateCardNumbers() })),
        tap(card => render(card)),
        scan((acc, card) => acc.set(card.id, card), new Map<number, Card>()),
        startWith(null),
    )

const cardsSelectStream = combineLatest([
    timer(0, 1000)
        .pipe(
            map(tick => tick + 1),
            map(tick => CARD_SELECTION_TIME - tick),
        ),
    cardsGenerationStream,
])
    .pipe(
        takeWhile(([tick]) => tick > 0),
        tap(([tick]) => renderStatus(tick, "Select cards:")),
        map(([, cardsMap]) => cardsMap),
        last(),
    )

const numbersDrawingStream = (cardsMap: CardsMap | null) => combineLatest([
    timer(0, 1000)
        .pipe(
            map(tick => tick + 1),
            map(tick => NUMBERS_DRAWING_TIME - tick),
            tap((tick) => renderStatus(tick, "Numbers drawing:")),
        ),
    of(generateDrawnNumbers())
])
    .pipe(
        take(20),
        map(([tick, drawnNumbers]) => drawnNumbers[tick]),
        tap(drawnNumbers => renderDrawnNumber(drawnNumbers, cardsMap)),
    )

const newGame = document.getElementById("new-game") as HTMLElement;
const newGameStream = fromEvent(newGame, "click")
    .pipe(
        startWith("initialClick"),
        tap(clear),
    );

const game = newGameStream
    .pipe(
        switchMap(() => cardsSelectStream),
        switchMap(cardsMap => numbersDrawingStream(cardsMap)),
    );

game.subscribe();
