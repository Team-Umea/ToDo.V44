const toDo = [];

function addTask(task,id) {
    const newTask = {
        "id": id,
        "taskName": task,
        "isDone": false
    };
    toDo.push(newTask);
}
addTask("städa",toDo.length);
addTask("städa",toDo.length);
addTask("städa",toDo.length);
addTask("städa",toDo.length);
addTask("städa",toDo.length);

console.log(toDo);

