import { bufferCount, combineLatest, concat, distinct, fromEvent, map, merge, of, startWith, switchMap, take, takeUntil, takeWhile, tap, timer } from "rxjs";
import "./index.css";
import { generateCardNumbers, generateDrawnNumbers } from "./randomUtils";
import { render, renderDrawnNumbers, renderInitial, renderStatus } from "./renderer";

const CARD_SELECTION_TIME = 10;
const NUMBERS_DRAWING_TIME = 20;

const card0 = document.getElementById("card0") as Element;
const card1 = document.getElementById("card1") as Element;
const newGame = document.getElementById("new-game") as Element;

const cardClickStream = (card: Element) => fromEvent<MouseEvent>(card, "click")
    .pipe(
        map(() => +card.id.slice(-1)),
    );

const cardGenerationStream = merge(
    cardClickStream(card0),
    cardClickStream(card1),
)
    .pipe(
        map(cardIdx => ({ cardIdx, numbers: generateCardNumbers() })),
        tap(({ cardIdx, numbers }) => render(cardIdx, numbers)),
        startWith("initialCardClick"),
    )

const cardSelectStream = combineLatest([
    timer(0, 1000)
        .pipe(
            map(tick => tick + 1),
            map(tick => CARD_SELECTION_TIME - tick),
            tap((tick) => renderStatus(tick, "Select cards:")),
        ),
    cardGenerationStream,
])
    .pipe(
        takeWhile(([tick]) => tick > 0)
    )

const numbersDrawingStream = combineLatest([
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
        tap(renderDrawnNumbers),
    )

const newGameStream = fromEvent(newGame, "click")
    .pipe(
        startWith("initialClick"),
        tap(renderInitial),
    );

const game = newGameStream
    .pipe(
        switchMap(() => concat(
            cardSelectStream,
            numbersDrawingStream,
        ))
    );

game.subscribe();