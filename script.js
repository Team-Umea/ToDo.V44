
const textInput = document.getElementById("textInput");
const list = document.getElementById("toDoList");

const toDo = [];

let idCounter = 0;
function addTask(task) {
    const newTask = {
        id: idCounter,
        taskName: task,
        isDone: false
    };
    idCounter++;
    toDo.push(newTask);
    renderList();
}
addTask("städa");

function deleteTask(id) {
   toDo.splice(id,1);
   renderList();
}

function completeTask(id) {
    id = parseInt(id);
    for (let i = 0; i < toDo.length; i++) {
       if (toDo[i].id === id) {
        toDo[i].isDone = true;
       }
    }
    renderList();
}

function renderList() {
    let text = "";

    toDo.forEach( (task) => {
        text += `<li>${task.taskName}</li>`;
    });
    list.innerHTML = text;
}