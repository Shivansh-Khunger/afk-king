export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export class TaskList {
  private tasks: Task[] = [];
  private storageKey = 'tasks';

  constructor() {
    this.loadTasks();
  }

  private loadTasks() {
    const savedTasks = localStorage.getItem(this.storageKey);
    if (savedTasks) {
      try {
        this.tasks = JSON.parse(savedTasks);
      } catch (e) {
        console.error('Failed to parse tasks from localStorage', e);
        this.tasks = [];
      }
    }
  }

  private saveTasks() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.tasks));
  }

  addTask(text: string): Task {
    if (!text.trim()) {
      throw new Error('Task text cannot be empty');
    }
    const newTask: Task = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
    };
    this.tasks.push(newTask);
    this.saveTasks();
    return newTask;
  }

  toggleTask(id: string): Task | undefined {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      this.saveTasks();
    }
    return task;
  }

  deleteTask(id: string): boolean {
    const initialLength = this.tasks.length;
    this.tasks = this.tasks.filter(t => t.id !== id);
    if (this.tasks.length !== initialLength) {
      this.saveTasks();
      return true;
    }
    return false;
  }

  getTasks(): Task[] {
    return [...this.tasks];
  }
}
