
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

    if (title === "" || desc === "") { 
        submitMessage.innerText="ERROR! Both fields must not be empty"
        submitMessage.style.color="red"; 
    } else {
        if(event.submitter.id === document.getElementById('submit').id){
            userMessage("Success!");
    
            const task = {
                id:generateID(),
                title:title,
                desc:desc,
                isDone:false
            }
            addTask(task);//toDo.push(task);
            renderList();
            resetForm(); //addTaskTitle.value=""; addTaskDesc.value="";
        } else if (event.submitter.id === document.getElementById('editTask').id) {
            userMessage("Success!");

            const task = {
                id: document.getElementById('currentStatus').value.id,
                title:title,
                desc:desc,
                isDone:document.getElementById('currentStatus').value.isDone
            }

            editTask(task);
            renderList();
            resetForm();
            
        }
    }
    resetStatus();
    localStorage.setItem('tasks', JSON.stringify(toDo));
    console.log(localStorage);
})

function editTask(specificTask){
    toDo = toDo.map(task => {
        if(task.id === specificTask.id){
            return { ...task, title: specificTask.title, desc: specificTask.desc }; // Replace title and description!!
        }
        return task;
    })
}

//Error handling
function userMessage (param){
    submitMessage.innerText=param;
    submitMessage.style.color="green"; 
    setTimeout(()=>{
        submitMessage.innerText="";
    },3000)
}

function addTask(taskObj){
    toDo.push(taskObj);
}

function resetForm(){
    addTaskTitle.value="";
    addTaskDesc.value="";
}

function generateID(){
    if(toDo.length>0){
        return sortedList = toDo.sort((a,b)=>a.id-b.id)[toDo.length-1].id+1;
    }else{
        return 0;
    }
}

function deleteTask(id) {
   toDo = toDo.filter((task) => task.id !== id);
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


//Resets classes and status message
function resetStatus(){
    const editTaskBtn = document.getElementById('editTask');
    const currentStatus = document.getElementById('currentStatus');

    currentStatus.setAttribute('class','hidden');
    currentStatus.innerText = "";
    currentStatus.removeAttribute('value');

    editTaskBtn.setAttribute('class','hidden');
}

function renderList() {
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
        
        taskEditBtn.addEventListener('click',()=>{
            addTaskTitle.value = task.title;
            addTaskDesc.value = task.desc;
            
            const editTaskBtn = document.getElementById('editTask');
            const currentStatus = document.getElementById('currentStatus');

            currentStatus.removeAttribute('class','hidden');
            currentStatus.innerText = `You are editing task... ${task.title}`;
            currentStatus.value = {id: task.id, isDone: task.isDone};

            editTaskBtn.removeAttribute('class','hidden');
        })

        li.appendChild(h2);
        li.appendChild(p);
        li.appendChild(taskDeleteBtn);
        li.appendChild(taskCompleteBtn);
        li.appendChild(taskEditBtn);

        toDoList.appendChild(li);
    });
}


