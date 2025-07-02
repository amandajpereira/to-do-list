"use strict";
// Lista de tarefas
let tasks = [];
// Referências aos elementos HTML
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task');
const taskList = document.getElementById('task-list');
const filterButtons = document.querySelectorAll('[data-filter]');
// Carregar tarefas salvas do localStorage
window.onload = () => {
    const saved = localStorage.getItem('tasks');
    if (saved)
        tasks = JSON.parse(saved);
    renderTasks();
};
// Salvar no localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
// Criar nova tarefa
function addTask() {
    const description = taskInput.value.trim();
    if (!description)
        return;
    const newTask = {
        id: Date.now(),
        description,
        done: false,
    };
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskInput.value = '';
}
// Renderizar lista de tarefas
function renderTasks(filter = 'all') {
    taskList.innerHTML = '';
    const filteredTasks = tasks.filter(task => {
        if (filter === 'done')
            return task.done;
        if (filter === 'todo')
            return !task.done;
        return true;
    });
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = task.done ? 'done' : '';
        const span = document.createElement('span');
        span.textContent = task.description;
        span.onclick = () => toggleDone(task.id);
        const delBtn = document.createElement('button');
        delBtn.textContent = '🗑️';
        delBtn.onclick = () => deleteTask(task.id);
        li.appendChild(span);
        li.appendChild(delBtn);
        taskList.appendChild(li);
    });
}
// Alternar status de concluída
function toggleDone(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.done = !task.done;
        saveTasks();
        renderTasks();
    }
}
// Deletar tarefa
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
}
// Eventos
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', e => {
    if (e.key === 'Enter')
        addTask();
});
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        renderTasks(filter);
    });
});
