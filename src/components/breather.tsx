import React from "react";
import { ArrowUp, PauseOctagon, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import "./breather.css";
import type { Action } from "@/lib/action";

const iconSize = 36;
const waitInterval = 0.3;

interface P {
  actions: Action[];
}

export const Breather: React.FC<P> = ({ actions }) => {
  const [action, setAction] = React.useState<Action | undefined>(undefined);
  const [counter, setCounter] = React.useState<number | undefined>(undefined);

  const ac = React.useRef<AbortController | undefined>(undefined);

  const reset = () => {
    ac.current?.abort();
    ac.current = undefined;
    setCounter(undefined);
    setAction(undefined);
  };

  const sleep = (signal: AbortSignal, seconds: number = 1) => {
    return new Promise((resolve, reject) => {
      const abortListener = () => {
        signal.removeEventListener("abort", abortListener);
        reset();
        reject("rejected in sleep");
      };
      signal.addEventListener("abort", abortListener);

      setTimeout(resolve, seconds * 1000);
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
          await sleep(signal);
          if (shouldStop) return;
        }
        await sleep(signal, waitInterval);
        if (shouldStop) return;
      }
    }
  };

  React.useEffect(() => {
    console.info("got new actions, resetting", { actions });
    reset();
  }, [actions]);

  const position: React.CSSProperties = {
    gridRow: "1 / 2",
    gridColumn: "1 / 2",
  };

  const transition: React.CSSProperties = {
    transition: `all ${action?.duration ?? waitInterval}s ease-in-out`,
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
            "breather--shape w-[200px] h-[200px] bg-card flex justify-center items-center",
            action?.type
          )}
          style={transition}
        />
      </div>

      <div
        className={cn(
          "flex items-center justify-center",
          "col-start-1 col-end-1 row-start-1 row-end-1 z-10",
          "flex flex-col items-center gap-2 text-2xl",
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
          <div className="text-xs flex items-center gap-1">
            {counter}
            <span className="opacity-20">/</span>
            {action.duration}
          </div>
        )}
      </div>
    </div>
  );

  return (
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
  );
};
