import { combineLatest, fromEvent, last, map, merge, of, scan, startWith, switchMap, take, takeWhile, tap, timer } from "rxjs";
import "./index.css";
import { generateCardNumbers, generateDrawnNumber } from "./randomUtils";
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
const cardsGenerationStream = () => merge(
    cardClickStream(card0),
    cardClickStream(card1),
)
    .pipe(
        map<number, Card>(id => ({ id, numbers: generateCardNumbers() })),
        tap(card => render(card)),
        // scan is like reduce for arrays, here we aggregate card values that were selected
        scan((acc, card) => acc.set(card.id, card), new Map<number, Card>()),
        // startWith is needed so the game would continue even if no cards was selected
        startWith(null),
    );

const cardsSelectStream = () => combineLatest([
    timer(0, 1000)
        .pipe(
            map(tick => tick + 1),
            map(tick => CARD_SELECTION_TIME - tick),
        ),
    // cards generation stream is used as a function to reset its internal scan operator state on new game
    cardsGenerationStream(),
])
    .pipe(
        takeWhile(([tick]) => tick > 0),
        tap(([tick]) => renderStatus(tick, "Select cards:")),
        map(([, cardsMap]) => cardsMap),
        last(),
    );

const numbersDrawingStream = (cardsMap: CardsMap | null) => timer(0, 1000)
    .pipe(
        map(tick => tick + 1),
        map(tick => NUMBERS_DRAWING_TIME - tick),
        tap((tick) => renderStatus(tick, "Numbers drawing:")),
        map(generateDrawnNumber),
        tap(drawnNumber => renderDrawnNumber(drawnNumber, cardsMap)),
        take(20),
    );


const newGame = document.getElementById("new-game") as HTMLElement;
const newGameStream = fromEvent(newGame, "click")
    .pipe(
        // startWith is needed for stream to begin on page load
        startWith("initialClick"),
        tap(clear),
    );

// Here we have an interesting thing, switchMap inside of switchMap.
// It is needed so that on every newGame click all inner streams to be cancelled and recreated
const game = newGameStream
    .pipe(
        switchMap(() => cardsSelectStream()
            .pipe(
                switchMap(numbersDrawingStream)
            )
        ),
    );

game.subscribe();
