// Web Worker pour timer persistent
let timerId: ReturnType<typeof setInterval> | null = null;
let targetTime: number | null = null;
let timerMessage = "";

self.onmessage = (e: MessageEvent) => {
  const { type, duration, message } = e.data as {
    type: string;
    duration?: number;
    message?: string;
  };

  switch (type) {
    case "START":
      if (timerId) {
        clearInterval(timerId);
      }
      targetTime = Date.now() + (duration ?? 0) * 1000;
      timerMessage = message ?? "";

      timerId = setInterval(() => {
        if (!targetTime) return;
        const remaining = Math.max(
          0,
          Math.ceil((targetTime - Date.now()) / 1000),
        );
        self.postMessage({ type: "TICK", remaining });

        if (remaining <= 0) {
          self.postMessage({ type: "COMPLETE", message: timerMessage });
          if (timerId) {
            clearInterval(timerId);
            timerId = null;
          }
          targetTime = null;
        }
      }, 1000);
      break;

    case "STOP":
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
      }
      targetTime = null;
      self.postMessage({ type: "STOPPED" });
      break;

    case "PAUSE":
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
      }
      // Garde targetTime pour pouvoir reprendre
      break;

    case "RESUME":
      if (targetTime && !timerId) {
        const savedTargetTime = targetTime;
        timerId = setInterval(() => {
          const remaining = Math.max(
            0,
            Math.ceil((savedTargetTime - Date.now()) / 1000),
          );
          self.postMessage({ type: "TICK", remaining });

          if (remaining <= 0) {
            self.postMessage({ type: "COMPLETE", message: timerMessage });
            if (timerId) {
              clearInterval(timerId);
              timerId = null;
            }
            targetTime = null;
          }
        }, 1000);
      }
      break;

    case "GET_STATUS":
      if (targetTime) {
        const remaining = Math.max(
          0,
          Math.ceil((targetTime - Date.now()) / 1000),
        );
        self.postMessage({
          type: "STATUS",
          remaining,
          running: timerId !== null && remaining > 0,
        });
      } else {
        self.postMessage({ type: "STATUS", remaining: 0, running: false });
      }
      break;
  }
};
