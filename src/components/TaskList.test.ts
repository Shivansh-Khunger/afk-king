import { expect, test, describe, beforeEach } from "bun:test";
import { TaskList } from "./TaskList";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

describe("TaskList", () => {
  let taskList: TaskList;

  beforeEach(() => {
    localStorage.clear();
    taskList = new TaskList();
  });

  test("should add a task", () => {
    const task = taskList.addTask("Test Task");
    expect(task.text).toBe("Test Task");
    expect(task.completed).toBe(false);
    expect(taskList.getTasks().length).toBe(1);
  });

  test("should not add an empty task", () => {
    expect(() => taskList.addTask("   ")).toThrow("Task text cannot be empty");
  });

  test("should toggle a task", () => {
    const task = taskList.addTask("Test Task");
    taskList.toggleTask(task.id);
    expect(taskList.getTasks()[0].completed).toBe(true);
    taskList.toggleTask(task.id);
    expect(taskList.getTasks()[0].completed).toBe(false);
  });

  test("should delete a task", () => {
    const task = taskList.addTask("Test Task");
    const deleted = taskList.deleteTask(task.id);
    expect(deleted).toBe(true);
    expect(taskList.getTasks().length).toBe(0);
  });

  test("should persist tasks in localStorage", () => {
    taskList.addTask("Persisted Task");
    const newTaskList = new TaskList();
    expect(newTaskList.getTasks().length).toBe(1);
    expect(newTaskList.getTasks()[0].text).toBe("Persisted Task");
  });
});
