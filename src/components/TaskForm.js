import { saveTask } from "../utils/storage";
import { createTaskCard } from "./taskcard";

export function handleFormSubmit() {
    const form = document.querySelector("form");

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const task = {
            id: Date.now(),
            title: document.getElementById("title").value.trim(),
            description: document.getElementById("description").value.trim(),
            priority: document.getElementById("date").value,
            time: document.getElementById("time").value,
            completed: false
        };

        saveTask(task);
        createTaskCard(task);
        form.reset();
    })
}
