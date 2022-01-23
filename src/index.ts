import { combineLatest, concatMap, filter, finalize, fromEvent, interval, map, merge, of, startWith, switchMap, take, tap } from "rxjs";
import "./index.css";
import { generateCardNumbers, generateDrawnBalls } from "./randomUtils";
import { render, renderDrawnNumbers, renderStatus } from "./renderer";

const card0 = document.getElementById("card0") as Element;
const card1 = document.getElementById("card1") as Element;
const newGame = document.getElementById("new-game") as Element;

const cardClickStream = (card: Element) => fromEvent<MouseEvent>(card, "click")
    .pipe(
        map(() => +card.id.slice(-1)),
    );

const cardGenerationStream = (tick: number) => merge(
    cardClickStream(card0),
    cardClickStream(card1),
)
    .pipe(
        filter(() => tick < 9),
        map(cardIdx => ({ cardIdx, numbers: generateCardNumbers() })),
        tap(({ cardIdx, numbers }) => render(cardIdx, numbers)),
        map(() => tick),
    )

const game = fromEvent(newGame, "click")
    .pipe(
        startWith("initialClick"),
        switchMap(() =>
            interval(1000)
                .pipe(
                    startWith(-1),
                    map(tick => tick + 2),
                    tap(renderStatus),
                    switchMap(tick =>
                        merge(
                            of(tick),
                            cardGenerationStream(tick),
                        )
                    ),
                    filter(tick => tick > 9),
                    concatMap(() =>
                        combineLatest([
                            interval(1000),
                            of(generateDrawnBalls())
                        ])
                            .pipe(
                                map(([tick, drawnNumbers]) => drawnNumbers[tick]),
                                tap(renderDrawnNumbers),
                            )
                    ),
                    take(20),
                    finalize(() => renderStatus(100)),
                )
        )
    );

game.subscribe();
