import { expect, test, describe, beforeEach, afterEach, mock } from "bun:test";
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
globalThis.window = dom.window as any;
globalThis.document = dom.window.document;
globalThis.navigator = dom.window.navigator;
globalThis.Node = dom.window.Node;
globalThis.Element = dom.window.Element;
globalThis.HTMLElement = dom.window.HTMLElement;

import { renderHook, act } from "@testing-library/react";
import { usePomodoro } from "./usePomodoro";

describe("usePomodoro", () => {
  test("initializes with default values", () => {
    const { result } = renderHook(() => usePomodoro());
    expect(result.current.timeLeft).toBe(25 * 60);
    expect(result.current.timerState).toBe("WORK");
    expect(result.current.isActive).toBe(false);
  });

  test("starts and pauses the timer", () => {
    const { result } = renderHook(() => usePomodoro());
    
    act(() => {
      result.current.start();
    });
    expect(result.current.isActive).toBe(true);

    act(() => {
      result.current.pause();
    });
    expect(result.current.isActive).toBe(false);
  });

  test("resets the timer", () => {
    const { result } = renderHook(() => usePomodoro(10, 5));
    
    act(() => {
      result.current.start();
    });
    
    act(() => {
      result.current.reset();
    });

    expect(result.current.isActive).toBe(false);
    expect(result.current.timerState).toBe("WORK");
    expect(result.current.timeLeft).toBe(10 * 60);
  });

  test("transitions from WORK to BREAK when reaching zero", async () => {
    const { result } = renderHook(() => usePomodoro(1, 1, true));
    
    act(() => {
      result.current.start();
    });

    expect(result.current.timerState).toBe("WORK");
    expect(result.current.timeLeft).toBe(1);

    // Wait for 1.1 seconds
    await new Promise(resolve => setTimeout(resolve, 1100));

    expect(result.current.timerState).toBe("BREAK");
    expect(result.current.timeLeft).toBe(1);
  });

  test("transitions from BREAK back to WORK", async () => {
    const { result } = renderHook(() => usePomodoro(1, 1, true));
    
    act(() => {
      result.current.start();
    });

    // Work (1s) -> Break (1s) -> Work (1s)
    await new Promise(resolve => setTimeout(resolve, 1100));
    expect(result.current.timerState).toBe("BREAK");
    
    await new Promise(resolve => setTimeout(resolve, 1100));
    expect(result.current.timerState).toBe("WORK");
  });
});
