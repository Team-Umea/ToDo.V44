
// const textInput = document.getElementById("textInput");
const addTaskForm = document.getElementById("addTask")
const addTaskTitle = document.getElementById("taskTitleInput")
const addTaskDesc = document.getElementById("taskDescInput")
const submitMessage = document.getElementById("submitMessage")
const list = document.getElementById("toDoList");

let toDo = [];

addTaskForm.addEventListener("submit",function(event){
    event.preventDefault();

    const title = addTaskTitle.value.trim();
    const desc = addTaskDesc.value.trim();

    if(title===""||desc===""){ 
        submitMessage.innerText="ERROR! Both fields must not be empty"
        submitMessage.style.color="red"; 

    }else{
        //append to toDo;

        addTaskTitle.value="";
        addTaskDesc.value="";

        submitMessage.innerText="Success"
        submitMessage.style.color="green"; 

        setTimeout(()=>{
            submitMessage.innerText="";
        },3000)

        const task = {
            id:generateID(),
            title:title,
            desc:desc,
            isDone:false
        }
        addTask(task);
        renderList();
    }

})

function addTask(taskObj){
    toDo.push(taskObj);
}




// let idCounter = 0;
function generateID(){
    if(toDo.length>0){
        return sortedList = toDo.sort((a,b)=>a.id-b.id)[toDo.length-1].id+1;
    }else{
        return 0;
    }
}

// function addTask(task) {
//     const newTask = {
//         id: generateID(),
//         taskName: task,
//         isDone: false
//     };
//     // idCounter++;
//     toDo.push(newTask);
//     renderList();
// }
// addTask("städa");

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
        text += `<li><p>${task.title}</p><button onclick="deleteTask(${task.id})">delete</button><button onclick="completeTask(${task.id})">klar</button></li>`;

    });
    list.innerHTML = text;
}


