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
}
addTask("städa");
addTask("städa");
addTask("sdsa");
addTask("städa");
addTask("städa");

console.log(toDo);
function deleteTask(id) {
   toDo.splice(id,1);
   console.log(toDo);
   
}
// deleteTask(2);
console.log(toDo);

function logButton() {
    console.log(toDo.reverse());
    
}
