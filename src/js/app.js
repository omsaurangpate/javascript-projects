document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const tasksContainer = document.querySelector('#task-container');
    const filterButton = document.querySelector('#filter-btn');
    const filterPopup = document.querySelector('#filter-popup');
    const editSequenceButton = document.querySelector('#edit-sequence-btn');

    let isEditSequenceMode = false; // Track if edit sequence mode is active

    // Load tasks from localStorage on page load
    showDate();
    loadTasks();

    function showDate() {
        const dateTime = document.querySelector('#date-time');
        const date = new Date();
        const options = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-IN', options);

        dateTime.innerHTML = `${formattedDate}`;
    }

    // PopUp
    function showTaskPopup() {
        const popup = document.getElementById('task-popup');
        popup.classList.remove('hidden');
        popup.classList.add('visible');

        // Hide after 2 seconds
        setTimeout(() => {
            popup.classList.remove('visible');
            popup.classList.add('hidden');
        }, 3000);
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const title = document.getElementById('title').value.trim();
        const description = document.getElementById('description').value.trim();
        const priority = document.getElementById('priority').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;

        // Clear previous error messages and styles
        clearErrors();

        // Validate form fields
        let isValid = true;

        if (!title) {
            showError('title', 'Title is required');
            isValid = false;
        }

        if (!description) {
            showError('description', 'Description is required');
            isValid = false;
        }

        if (!priority) {
            showError('priority', 'Priority is required');
            isValid = false;
        }

        if (!date) {
            showError('date', 'Date is required');
            isValid = false;
        }

        if (!time) {
            showError('time', 'Time is required');
            isValid = false;
        }

        // If form is valid, proceed with task creation
        if (isValid) {
            // Create task object
            const task = {
                id: Date.now(), // Unique ID for each task
                title,
                description,
                priority,
                date,
                time,
                completed: false, // Default status
            };

            // Save task to localStorage
            saveTask(task);

            // Show Popup
            showTaskPopup();

            // Create and display the task card
            createTaskCard(task);

            // Reset the form
            form.reset();
        }
    });

    // Function to show error message and add red border
    function showError(fieldId, message) {
        const inputField = document.getElementById(fieldId);
        const errorMessage = document.createElement('p');

        // Add red border to the input field
        inputField.classList.add('border-red-500');

        // Create and style the error message
        errorMessage.textContent = message;
        errorMessage.classList.add('text-red-500', 'text-sm', 'mt-1');

        // Insert the error message after the input field
        inputField.parentNode.insertBefore(errorMessage, inputField.nextSibling);
    }

    // Function to clear previous error messages and styles
    function clearErrors() {
        const errorMessages = document.querySelectorAll('.text-red-500');
        const inputFields = document.querySelectorAll('input, textarea, select');

        // Remove all error messages
        errorMessages.forEach((message) => message.remove());

        // Remove red borders from all input fields
        inputFields.forEach((field) => field.classList.remove('border-red-500'));
    }

    // Function to save task to localStorage
    function saveTask(task) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Function to load tasks from localStorage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach((task) => createTaskCard(task));
    }

    // Function to create a task card
    function createTaskCard(task) {
        const card = document.createElement('div');
        card.className = `p-4 bg-opacity-50 border border-gray-300 bg-white/20 backdrop-blur-md rounded mx-1 shadow-md ${task.completed ? 'completed' : ''}`;
        card.setAttribute('data-id', task.id);
        card.draggable = isEditSequenceMode; // Make card draggable in edit sequence mode

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

        // Add drag-and-drop event listeners
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragover', handleDragOver);
        card.addEventListener('drop', handleDrop);

        tasksContainer.appendChild(card);
    }

    // Function to delete a task with Telegram-like animation
    function deleteTask(id, card) {
        card.classList.add('delete-animation');
        card.addEventListener('animationend', () => {
            let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            tasks = tasks.filter((task) => task.id !== id);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            card.remove();
        });
    }

    // Function to update a task
    function updateTask(id) {
        const form = document.querySelector("form");
        form.scrollIntoView({ behavior: "smooth" });
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const task = tasks.find((task) => task.id === id);

        if (task) {
            // Populate the form with the task data
            document.getElementById('title').value = task.title;
            document.getElementById('description').value = task.description;
            document.getElementById('priority').value = task.priority;
            document.getElementById('date').value = task.date;
            document.getElementById('time').value = task.time;
        }

        // Delete the old task
        deleteTask(id, document.querySelector(`[data-id="${id}"]`));
    }

    // Function to mark a task as complete with animation
    function markAsComplete(id, card) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const task = tasks.find((task) => task.id === id);
        task.completed = true;

        localStorage.setItem('tasks', JSON.stringify(tasks));

        // Change the complete button background to green
        const completeBtn = card.querySelector('.complete-btn');
        completeBtn.classList.remove('bg-[#dcdcde]', 'hover:bg-[#d2d2d4]');
        completeBtn.classList.add('bg-green-500', 'hover:bg-green-600');

        // Add complete animation to the card
        card.classList.add('complete-animation');
        // Remove the card after 4 seconds
        setTimeout(() => {
            deleteTask(id, document.querySelector(`[data-id="${id}"]`));
        }, 5000);
    }

    // Toggle filter popup visibility
    filterButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent the click from propagating to the document
        filterPopup.classList.toggle('hidden');
    });

    // Close filter popup when clicking outside
    document.addEventListener('click', () => {
        filterPopup.classList.add('hidden');
    });

    // Prevent the popup from closing when clicking inside it
    filterPopup.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Apply filter when "Apply Filter" button is clicked
    document.getElementById('apply-filter').addEventListener('click', () => {
        const priority = document.getElementById('priority-filter').value;
        const date = document.getElementById('date-filter').value;

        // Filter tasks based on priority and date
        filterTasks(priority, date);

        // Close the filter popup
        filterPopup.classList.add('hidden');
    });

    // Function to filter tasks
    function filterTasks(priority, date) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        let filteredTasks = tasks;

        // Filter by priority
        if (priority) {
            filteredTasks = filteredTasks.filter((task) => task.priority === priority);
        }

        // Filter by date
        if (date) {
            filteredTasks = filteredTasks.filter((task) => task.date === date);
        }

        // Render the filtered tasks
        renderTasks(filteredTasks);
    }

    // Function to render tasks
    function renderTasks(tasks) {
        const tasksContainer = document.querySelector('.flex-1.overflow-y-auto.space-y-3');
        tasksContainer.innerHTML = ''; // Clear existing tasks
        tasks.forEach((task) => createTaskCard(task));
    }


    // Toggle edit sequence mode
    editSequenceButton.addEventListener('click', () => {
        isEditSequenceMode = !isEditSequenceMode;
        editSequenceButton.textContent = isEditSequenceMode ? 'Save Sequence' : 'Edit Sequence';

        // Enable/disable drag-and-drop for all cards
        const cards = document.querySelectorAll('#task-container > div');
        cards.forEach((card) => {
            if (isEditSequenceMode) {
                card.classList.add('edit-sequence-mode');
                card.style.cursor = 'grab';
                card.setAttribute('draggable', 'true');

                // Attach both desktop and mobile event listeners
                card.addEventListener('dragstart', handleDragStart);
                card.addEventListener('dragover', handleDragOver);
                card.addEventListener('drop', handleDrop);

                card.addEventListener('touchstart', handleTouchStart);
                card.addEventListener('touchmove', handleTouchMove);
                card.addEventListener('touchend', handleTouchEnd);
            } else {
                card.classList.remove('edit-sequence-mode');
                card.style.cursor = 'default';
                card.removeAttribute('draggable');

                // Remove event listeners
                card.removeEventListener('dragstart', handleDragStart);
                card.removeEventListener('dragover', handleDragOver);
                card.removeEventListener('drop', handleDrop);

                card.removeEventListener('touchstart', handleTouchStart);
                card.removeEventListener('touchmove', handleTouchMove);
                card.removeEventListener('touchend', handleTouchEnd);
            }
        });

        if (!isEditSequenceMode) {
            saveTaskSequence();
        }
    });

    // Drag-and-drop event handlers (Desktop)
    let draggedCard = null;

    function handleDragStart(e) {
        draggedCard = this;
        e.dataTransfer.effectAllowed = 'move';
    }

    function handleDragOver(e) {
        e.preventDefault();
        if (draggedCard !== this) {
            const rect = this.getBoundingClientRect();
            const offset = e.clientY - rect.top;
            if (offset < rect.height / 2) {
                this.parentNode.insertBefore(draggedCard, this);
            } else {
                this.parentNode.insertBefore(draggedCard, this.nextSibling);
            }
        }
    }

    function handleDrop(e) {
        e.preventDefault();
    }

    // Touch event handlers (Mobile)
    let touchStartY = 0;
    let currentCard = null;

    function handleTouchStart(e) {
        touchStartY = e.touches[0].clientY;
        currentCard = this;
        this.style.opacity = '0.5'; // Add visual feedback
    }

    function handleTouchMove(e) {
        e.preventDefault();
        const touchY = e.touches[0].clientY;
        const targetCard = document.elementFromPoint(e.touches[0].clientX, touchY);

        if (targetCard && targetCard !== currentCard && targetCard.parentNode === currentCard.parentNode) {
            const rect = targetCard.getBoundingClientRect();
            if (touchY < rect.top + rect.height / 2) {
                targetCard.parentNode.insertBefore(currentCard, targetCard);
            } else {
                targetCard.parentNode.insertBefore(currentCard, targetCard.nextSibling);
            }
        }
    }

    function handleTouchEnd(e) {
        this.style.opacity = '1'; // Reset visual feedback
        saveTaskSequence();
    }

    // Function to save the new task sequence to localStorage
    function saveTaskSequence() {
        const tasksContainer = document.querySelector('#task-container');
        const cards = tasksContainer.querySelectorAll('div[data-id]');
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

        const newTasks = Array.from(cards).map((card) => {
            const taskId = Number(card.getAttribute('data-id'));
            return tasks.find((task) => task.id === taskId);
        });

        localStorage.setItem('tasks', JSON.stringify(newTasks));
    }

});
