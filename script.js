const addTaskForm = document.getElementById("addTask")
const addTaskTitle = document.getElementById("taskTitleInput")
const addTaskDesc = document.getElementById("taskDescInput")
const submitMessage = document.getElementById("submitMessage")
const toDoListContainer = document.getElementById("toDoListContainer")
const toDoList = document.getElementById("toDoList");
const viewBtns = document.querySelectorAll(".viewBtn"); 

const serchForm = document.getElementById("serchForm"); 
const searchInput = document.getElementById("serchInput");
const searchBtn = document.getElementById("submitButton");
const searchMessage = document.getElementById("searchMessage");
const cancelSearch = document.getElementById("cancelSearch");

let toDo = [];
let orgTodo = [];

addTaskForm.addEventListener("submit",function(event){
    event.preventDefault();
    stopSearch();

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
            isDone:false,
        }
        addTask(task);//toDo.push(task);
        renderList();
        resetForm(); //addTaskTitle.value=""; addTaskDesc.value="";
        orgTodo = toDo
    }

}) 
//  demo 
addTask({id:generateID(),title:"Jag",desc:"Min",isDone:false})
addTask({id:generateID(),title:"Ska",desc:"Kompis",isDone:false})
addTask({id:generateID(),title:"Dricka",desc:"Fet",isDone:false})
addTask({id:generateID(),title:"Öl",desc:"Janne",isDone:false})
addTask({id:generateID(),title:"Med",desc:"!",isDone:false})
orgTodo = toDo;

function addTask(taskObj){
    toDo.push(taskObj);
    sortList();
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
        task.isDone? h2.classList.add("complete"): h2.classList.remove("complete")

        const p = document.createElement("p");
        p.setAttribute("class","taskDesc");
        p.innerText=task.desc;
        task.isDone? p.classList.add("complete"): p.classList.remove("complete")


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
            task.isDone = !task.isDone;
            //  Oscars förklaring 
            // if(task.isDone===true){
            //     task.isDone=false;
            // }else if(task.isDone===false){
            //     task.isDone=true;
            // }
            
            if (task.isDone) {
                h2.classList.add("complete");
                p.classList.add("complete");
            } else {
                h2.classList.remove("complete");
                p.classList.remove("complete");
            }
            sortList()
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
    });    
} 


function sortList() {
    toDo = toDo.sort((a, b) => {
        return (a.isDone === b.isDone) ? 0 : (a.isDone ? 1 : -1);
    });
    renderList();
}

viewBtns.forEach(btn=>{
    btn.addEventListener("click",()=>{
        if(btn.checked=true){
            const whichButton = Array.from(viewBtns).indexOf(btn);

            switch(whichButton){
                case 0:
                    toDo = orgTodo
                    break; 
                case 1: 
                    toDo = orgTodo.filter(item=>item.isDone===false);
                    break; 
                case 2: 
                    toDo = orgTodo.filter(item=>item.isDone===true);
                    break; 
            }
            renderList();
        }
    })
})


serchForm.addEventListener("submit",(e)=>{
    e.preventDefault();

    const searchQuery = searchInput.value.trim().toLowerCase(); 
    searchInput.value="";

    if(searchQuery===""){
        searchMessage.innerText="ERROR! Search input must not be empty"
        searchMessage.style.color="red"; 
    }else{

        toDo = toDo.filter(task=>task.title.toLowerCase().includes(searchQuery))
        renderList();
        cancelSearch.classList.remove("hidden")

        if(toDo.length===0){
            searchMessage.innerText=`ERROR! No tasks contains ${searchQuery}`
            searchMessage.style.color="red";
            setTimeout(() => {
                toDo=orgTodo;
                renderList();
            }, 3000); 
        }else{
            searchMessage.innerText="Search query submitted"
            searchMessage.style.color="lightgreen"; 
        }
    }

    if(searchMessage.innerText.trim()!==""){
        setTimeout(() => {
            searchMessage.innerText="";
        }, 3000);
    }
})

cancelSearch.addEventListener("click",()=>{
    stopSearch();
})

function stopSearch(){
    toDo=orgTodo; 
    sortList();
    renderList(); 
    cancelSearch.classList.add("hidden");
}

// searchInput.addEventListener("input",()=>{
//     const searchQuery = searchInput.value.trim(); 

//     if(searchQuery===""){
//         cancelSearch.classList.add("hidden")
//     }else{
//         cancelSearch.classList.remove("hidden")
//     }

// })