import { TaskList } from './src/components/TaskList';

const taskList = new TaskList();
const taskForm = document.getElementById('task-form') as HTMLFormElement;
const taskInput = document.getElementById('task-input') as HTMLInputElement;
const taskListElement = document.getElementById('task-list') as HTMLUListElement;

function renderTasks() {
    taskListElement.innerHTML = '';
    const tasks = taskList.getTasks();

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text">${task.text}</span>
            <button class="delete-btn" aria-label="Delete task">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </button>
        `;

        const checkbox = li.querySelector('.task-checkbox') as HTMLInputElement;
        checkbox.addEventListener('change', () => {
            taskList.toggleTask(task.id);
            renderTasks();
        });

        const deleteBtn = li.querySelector('.delete-btn') as HTMLButtonElement;
        deleteBtn.addEventListener('click', () => {
            taskList.deleteTask(task.id);
            renderTasks();
        });

        taskListElement.appendChild(li);
    });
}

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = taskInput.value.trim();
    if (text) {
        try {
            taskList.addTask(text);
            taskInput.value = '';
            renderTasks();
        } catch (error) {
            alert(error instanceof Error ? error.message : 'An error occurred');
        }
    }
});

// Initial render
renderTasks();
