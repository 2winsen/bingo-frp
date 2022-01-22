import { bufferTime, combineLatest, concatMap, fromEvent, interval, map, merge, of, skipUntil, switchMap, take, tap, zip } from "rxjs";
import "./index.css";
import { render, renderDrawnNumbers } from "./renderer";

export function randomInt(min: number, max: number) {
    return Math.floor(
        Math.random() * (max - min + 1) + min
    );
}

function generateRandomArray(size: number) {
    return Array.from({ length: size }, () => randomInt(1, 20));
}

function generateDrawnBalls() {
    return generateRandomArray(20);
}

function generateCard() {
    return generateRandomArray(9);
}

const card0 = document.getElementById("card0") as Element;
fromEvent(card0, "click")

const game = zip(
    of(generateCard()),
    of(generateCard()),
).pipe(
    concatMap(cards =>
        fromEvent(card0, "click")
            .pipe(
                map(() => cards),
            ),
    ),
    tap(render),
    switchMap(() =>
        combineLatest([
            interval(1000),
            of(generateDrawnBalls())
        ])
            .pipe(
                map(([tick, drawnNumbers]) => drawnNumbers[tick]),
                tap(renderDrawnNumbers),
                take(20),
            )
    )
)

game.subscribe();



// const preload$ = from(preloadImages());

// const board$ = of(emptyBoard())
//     .pipe(
//         map(addWindows),
//         tap(renderBoard),
//     );

// const cat$ = (board: GameBoard) => interval(GAME_INTERVAL)
//     .pipe(
//         startWith(0, 0),
//         map(_ => getRandomWindow(board)),
//         pairwise(),
//         tap(([previousPoint, point]) => {
//             showCat(previousPoint, point, board);
//             updateBoard(previousPoint, point);
//         }),
//         map(_ => board),
//     );

// const player$ = ({ grid }: GameBoard) => fromEvent<MouseEvent>(document, "click")
//     .pipe(
//         filter(event => event.target === document.getElementById("canvas")),
//         map(getCursorPosition),
//         map(getBoardPosition),
//         map(([x, y]) => grid[x][y]),
//         tap(updateScore),
//     );

// preload$
//     .pipe(
//         switchMap(_ => board$),
//         switchMap(cat$),
//         switchMap(player$),
//     )
//     .subscribe();