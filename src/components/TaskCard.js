import { deleteTask, updateTask, markAsComplete } from "../utils/storage";

export function createTaskCard(task) {
    const tasksContainer = document.getElementById("task-container");
    const card = document.createElement('div');
    card.className = `p-4 bg-white rounded-lg mx-1 shadow-md ${task.completed ? 'completed' : ''}`;
    card.setAttribute('data-id', task.id);

    card.innerHTML = `
        <h2 class="text-lg font-semibold">${task.title}</h2>
        <p class="text-sm text-gray-600">${task.description}</p>
        <div class="mt-4 flex items-center justify-between text-sm text-gray-500">
          <div><span class="font-bold">Deadline:</span> ${task.date}, ${task.time}</div>
          <div><span class="font-bold">Priority:</span> ${task.priority}</div>
        </div>
        <div class="mt-4 flex space-x-3">
          <button class="delete-btn bg-[#fa564d] text-white px-3 py-1 rounded hover:bg-[#fc3f35]">
            <img src="../src/assets/icons/delete-icon.svg" class="w-6 h-6" alt="">
          </button>
          <button class="update-btn bg-[#fad75a] text-white px-3 py-1 rounded hover:bg-[#fccf28]">
            <img src="../src/assets/icons/update-icon.svg" class="w-6 h-6" alt="">
          </button>
          <button class="complete-btn bg-[#dcdcde] text-white px-3 py-1 rounded hover:bg-[#d2d2d4]">
            <img src="../src/assets/icons/check-icon.svg" class="w-6 h-6" alt="">
          </button>
        </div>
      `;

    // Add event listeners for buttons
    const deleteBtn = card.querySelector('.delete-btn');
    const updateBtn = card.querySelector('.update-btn');
    const completeBtn = card.querySelector('.complete-btn');

    deleteBtn.addEventListener('click', () => deleteTask(task.id, card));
    updateBtn.addEventListener('click', () => updateTask(task.id));
    completeBtn.addEventListener('click', () => markAsComplete(task.id, card));

    tasksContainer.appendChild(card);
}
