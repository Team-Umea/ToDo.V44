
// const textInput = document.getElementById("textInput");
const addTaskForm = document.getElementById("addTask")
const addTaskTitle = document.getElementById("taskTitleInput")
const addTaskDesc = document.getElementById("taskDescInput")
const submitMessage = document.getElementById("submitMessage")
const toDoListContainer = document.getElementById("toDoListContainer")
const toDoList = document.getElementById("toDoList");

let toDo = [];

addTaskForm.addEventListener("submit",function(event){
    event.preventDefault();

    const title = addTaskTitle.value.trim();
    const desc = addTaskDesc.value.trim();

    if(title===""||desc===""){ 
        submitMessage.innerText="ERROR! Both fields must not be empty"
        submitMessage.style.color="red"; 

    }else{

        submitMessage.innerText="Success"
        submitMessage.style.color="green"; 

        setTimeout(()=>{
            submitMessage.innerText="";
        },1500)

        const task = {
            id:generateID(),
            title:title,
            desc:desc,
            isDone:false
        }
        addTask(task);//toDo.push(task);
        renderList();
        resetForm(); //addTaskTitle.value=""; addTaskDesc.value="";
    }

})

function addTask(taskObj){
    toDo.push(taskObj);
}

function resetForm(){
    addTaskTitle.value="";
    addTaskDesc.value="";
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

//    renderList();
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

    // const toDoListContainer = document.getElementById("toDoListContainer")
    // const toDoList = document.getElementById("toDoList");

    toDoList.innerHTML=""; //reset ul

    toDo.forEach((task) => {

        //Created html li element with class of taskItem
        const li = document.createElement("li");
        li.setAttribute("class","taskItem");

        const h2 = document.createElement("h2");
        h2.setAttribute("class","taskTitle");
        h2.innerText=task.title;

        const p = document.createElement("p");
        p.setAttribute("class","taskDesc");
        p.innerText=task.desc;

        const taskDeleteBtn = document.createElement("button");
        taskDeleteBtn.setAttribute("class","taskDeleteBtn");
        taskDeleteBtn.innerText="Delete"; //later add x mark

        taskDeleteBtn.addEventListener("click",function(){
            li.remove();
            deleteTask(task.id); //call delete function to remove task from toDo arrray
        })

        const taskCompleteBtn = document.createElement("button");
        taskCompleteBtn.setAttribute("class","taskCompleteBtn");
        taskCompleteBtn.innerText="Complete"; 

        taskCompleteBtn.addEventListener("click",function(){
            h2.style.color="green";
            p.style.color="green";
        })

        const taskEditBtn = document.createElement("button");
        taskEditBtn.setAttribute("class","taskEditBtn");
        taskEditBtn.innerText="Edit"; 

        li.appendChild(h2);
        li.appendChild(p);
        li.appendChild(taskDeleteBtn);
        li.appendChild(taskCompleteBtn);
        li.appendChild(taskEditBtn);

        toDoList.appendChild(li);






        // const li = document.createElement("li");
        // const li = document.createElement("li");
        // const li = document.createElement("li");
        // const li = document.createElement("li");
        // const li = document.createElement("li");


        // <li class="taskItem">
        //     <p class="taskTitle">Title</p>
        //     <p class="taskTitle">Desc</p>
        //     <button class="taskDeleteBtn">Delete</button>
        //     <button class="taskCompleteBtn">Compelte</button>
        //     <button class="taskEditBtn">Edit</button>
        // </li>
    });
}


