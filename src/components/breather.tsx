import React from "react";
import { ArrowUp, PauseOctagon, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import "./breather.css";
import type { Action } from "@/lib/action";

const iconSize = 36;

interface P {
  countDurationSeconds?: number;
  waitDurationSeconds?: number;
  actions: Action[];
}

export const Breather: React.FC<P> = ({
  actions,
  countDurationSeconds = 1,
  waitDurationSeconds = 0.3,
}) => {
  const [action, setAction] = React.useState<Action | undefined>(undefined);
  const [counter, setCounter] = React.useState<number | undefined>(undefined);
  const [totalMs, setTotalMs] = React.useState(0);

  let totalSeconds = Math.floor(totalMs / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  totalSeconds = totalSeconds % 60;

  const ac = React.useRef<AbortController | undefined>(undefined);

  const reset = () => {
    ac.current?.abort();
    ac.current = undefined;
    setCounter(undefined);
    setAction(undefined);
  };

  const sleep = (signal: AbortSignal, seconds: number) => {
    return new Promise((resolve, reject) => {
      let aborted = false;

      const abortListener = () => {
        signal.removeEventListener("abort", abortListener);
        aborted = true;
        reset();
        reject("rejected in sleep");
      };
      signal.addEventListener("abort", abortListener);

      setTimeout(() => {
        resolve(seconds);
        if (aborted) return;
        setTotalMs((p) => p + seconds * 1000);
      }, seconds * 1000);
    });
  };

  const toggle = () => {
    if (ac.current !== undefined) {
      ac.current.abort();
      return;
    }

    ac.current = new AbortController();
    void run(ac.current.signal).catch(() => {
      reset();
    });
  };

  const run = async (signal: AbortSignal) => {
    let shouldStop = false;

    const abortListener = () => {
      signal.removeEventListener("abort", abortListener);
      shouldStop = true;
      reset();
    };
    signal.addEventListener("abort", abortListener);

    while (!shouldStop) {
      for (const a of actions) {
        setAction(a);
        for (let i = 0; i < a.duration; i++) {
          setCounter(i + 1);
          await sleep(signal, countDurationSeconds);
          if (shouldStop) return;
        }
        await sleep(signal, waitDurationSeconds);
        if (shouldStop) return;
      }
    }
  };

  React.useEffect(() => {
    console.info("got new actions, resetting", { actions });
    reset();
    setTotalMs(0);
  }, [actions, countDurationSeconds, waitDurationSeconds]);

  const position: React.CSSProperties = {
    gridRow: "1 / 2",
    gridColumn: "1 / 2",
  };

  let transitionDuration = waitDurationSeconds;
  if (action !== undefined) {
    transitionDuration = action.duration * countDurationSeconds;
  }
  const transition: React.CSSProperties = {
    transition: `all ${transitionDuration}s ease-in-out`,
  };

  const content = (
    <div className={cn("breather--content", action?.type)} onClick={toggle}>
      <div
        style={position}
        className={cn(
          "breather--shape-container flex items-center justify-center"
        )}
      >
        <div
          style={position}
          className="breather--shape-bounds border-2 border-dashed"
        />
      </div>

      <div
        style={position}
        className={cn(
          "breather--shape-container flex items-center justify-center"
        )}
      >
        <div
          className={cn(
            "breather--shape bg-card flex justify-center items-center",
            action?.type
          )}
          style={transition}
        />
      </div>

      <div
        className={cn(
          "flex items-center justify-center",
          "col-start-1 col-end-1 row-start-1 row-end-1 z-10",
          "flex flex-col items-center gap-2",
          action?.type
        )}
      >
        {action === undefined && (
          <Play size={iconSize} className={cn("breather--icon")} />
        )}
        {(action?.type === "hold in" || action?.type === "hold out") && (
          <PauseOctagon size={iconSize} className={cn("breather--icon")} />
        )}
        {(action?.type === "in" || action?.type === "out") && (
          <ArrowUp
            size={iconSize}
            className={cn("breather--icon", action?.type)}
          />
        )}
        {action !== undefined && counter !== undefined && (
          <div className="breather--counter flex items-center gap-1 font-mono">
            {counter}
            <span className="opacity-20">/</span>
            {action.duration}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div
        className={cn(
          "breather--container",
          "w-full h-full",
          "flex flex-col gap-4 items-center justify-center",
          action?.type
        )}
      >
        {content}
      </div>

      <div className="text-2xl font-mono flex items-center justify-center p-4 text-muted-foreground">
        {totalMinutes.toString().padStart(2, "0")}:
        {totalSeconds.toString().padStart(2, "0")}
      </div>
    </>
  );
};
