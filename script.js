
const textInput = document.getElementById("textInput");
const list = document.getElementById("toDoList");

let toDo = [];

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
   toDo = toDo.filter((task) => task.id !== id);

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
        text += `<li><p>${task.taskName}</p><button onclick="deleteTask(${task.id})">delete</button><button onclick="completeTask(${task.id})">klar</button></li>`;

    });
    list.innerHTML = text;
}
    console.log(toDo);


