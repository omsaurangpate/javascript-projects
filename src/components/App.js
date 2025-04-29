import { createTaskCard } from "./taskcard";
import { saveTask, loadTasks } from "../utils/storage";

export function initializeApp() {
    document.addEventListener("DOMContentLoaded", () => {
        loadTasks();
    })
}
