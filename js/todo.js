const addTaskForm = document.getElementById("addTask");
const addTaskTitle = document.getElementById("taskTitleInput");
const addTaskDesc = document.getElementById("taskDescInput");
const submitMessage = document.getElementById("submitMessage");
const toDoListContainer = document.getElementById("toDoListContainer");
const toDoList = document.getElementById("toDoList");
const viewBtns = document.querySelectorAll(".viewBtn");
const tag1 = document.getElementById("tag1");
const tag2 = document.getElementById("tag2");
const tag3 = document.getElementById("tag3");
const searchInput = document.getElementById("searchInput");
const searchMessage = document.getElementById("searchMessage");
const cancelSearch = document.getElementById("cancelSearch");

let toDo = [];
const email = getEmailFromLocalStorage();
const password = getPasswordFromLocalStorage();
const organization = getOrgFromLocalStorage();
const project = getProFromLocalStorage();

// const IP = "https://todobackend-vuxr.onrender.com/";
const IP = "http://localhost:3000/";
const getTasksEndPoint = IP + "tasks";
const addTaskEndPoint = IP + "addTask";
const deleteTaskEndPoint = IP + "deleteTask";
const editTaskEndPoint = IP + "editTask";
const completeTaskEndPoint = IP + "completeTask";

async function load() {
  toDo = await getTasksFromServer();
  console.log("Todos: ", toDo);
  toDo.forEach((task) => (task.visible = true));
  updateToDo();
}

load();

addTaskForm.addEventListener("submit", function (event) {
  event.preventDefault();
  stopSearch();

  const title = addTaskTitle.value.trim();
  const desc = addTaskDesc.value.trim();

  const tempTags = [tag1, tag2, tag3];
  const tags = [];
  tempTags.forEach((tag) => {
    if (tag.checked) {
      tags.push(tag.value);
    }
  });

  if (title === "" || desc === "") {
    submitMessage.innerText = "ERROR! Both fields must not be empty";
    submitMessage.style.color = "red";
  } else {
    if (event.submitter.id === document.getElementById("submit").id) {
      userMessage("Success!");

      const task = {
        title: title,
        desc: desc,
        tags: tags,
      };

      addTask(task);
      addTaskOnServer(task);
    } else if (event.submitter.id === document.getElementById("editTask").id) {
      userMessage("Success!");

      const task = {
        id: document.getElementById("currentStatus").value.id,
        title: title,
        desc: desc,
        tags: tags,
        isDone: document.getElementById("currentStatus").value.isDone,
        visible: document.getElementById("currentStatus").value.visible,
      };

      editTask(task);
      editTaskOnServer(checkTaskTags(task));
    }
  }
  resetForm();
  resetStatus();
});

function updateToDo() {
  sortList();
  renderList();
}

function addTask(task) {
  const newTask = { ...task, id: generateTaskID(), isDone: false, visible: true };
  const taskExists = toDo.find((t) => t.title === task.title);
  if (!taskExists) {
    toDo.push(newTask);
  }
  updateToDo();
}

function deleteTask(id) {
  toDo = toDo.filter((task) => task.id !== id);
  updateToDo();
}

function completeTask(id) {
  toDo.map((task) => {
    if (task.id === id) {
      return { ...task, isDone: !task.isDone };
    }
    return task;
  });
  updateToDo();
}

function checkTaskTags(task) {
  const tempTags = [tag1, tag2, tag3];
  const tags = [];
  tempTags.forEach((tag) => {
    if (tag.checked) {
      tags.push(tag.value);
    }
  });
  return { ...task, tags: tags };
}

function editTask(specificTask) {
  const tempTags = [tag1, tag2, tag3];
  toDo = toDo.map((task) => {
    if (task.id === specificTask.id) {
      const tags = [];
      tempTags.forEach((tag) => {
        if (tag.checked) {
          tags.push(tag.value);
        }
      });
      return { ...task, title: specificTask.title, desc: specificTask.desc, tags: tags };
    }
    return task;
  });
  updateToDo();
}

function resetStatus() {
  const editTaskBtn = document.getElementById("editTask");
  const currentStatus = document.getElementById("currentStatus");

  currentStatus.setAttribute("class", "hidden");
  currentStatus.innerText = "";
  currentStatus.removeAttribute("value");

  editTaskBtn.setAttribute("class", "hidden");
}

function userMessage(param) {
  submitMessage.innerText = param;
  submitMessage.style.color = "green";
  setTimeout(() => {
    submitMessage.innerText = "";
  }, 3000);
}

function resetForm() {
  addTaskTitle.value = "";
  addTaskDesc.value = "";
}

function sortList() {
  if (toDo) {
    toDo = toDo.sort((a, b) => {
      return a.isDone === b.isDone ? 0 : a.isDone ? 1 : -1;
    });
  }
}

function renderList() {
  toDoList.innerHTML = "";
  if (toDo) {
    sortList();
    toDo.forEach((task) => {
      if (task.visible) {
        const li = document.createElement("li");
        li.setAttribute("class", "taskItem");

        const h2 = document.createElement("h2");
        h2.setAttribute("class", "taskTitle");
        h2.innerText = task.title;
        task.isDone ? h2.classList.add("complete") : h2.classList.remove("complete");

        const p = document.createElement("p");
        p.setAttribute("class", "taskDesc");
        p.innerText = task.desc;
        task.isDone ? p.classList.add("complete") : p.classList.remove("complete");

        const tagsWrapper = document.createElement("div");
        tagsWrapper.setAttribute("class", "taskTagsWrapper");
        if (task.tags !== undefined && task.tags.length > 0) {
          const startText = document.createElement("p");
          startText.innerText = "Tags: ";
          startText.setAttribute("class", "taskTag");
          tagsWrapper.appendChild(startText);
          task.tags.forEach((tag) => {
            let newTag = document.createElement("p");
            newTag.setAttribute("class", "taskTag");
            newTag.innerText = String.fromCodePoint(tag);
            tagsWrapper.appendChild(newTag);
          });
        }

        const taskDeleteBtn = document.createElement("button");
        taskDeleteBtn.setAttribute("class", "taskDeleteBtn");
        taskDeleteBtn.innerText = "Delete";

        taskDeleteBtn.addEventListener("click", function () {
          li.remove();
          deleteTask(task.id);
          deleteTaskOnServer(task.id);
        });

        const taskCompleteBtn = document.createElement("button");
        taskCompleteBtn.setAttribute("class", "taskCompleteBtn");
        taskCompleteBtn.innerText = "Complete";

        taskCompleteBtn.addEventListener("click", function () {
          task.isDone = !task.isDone;
          if (task.isDone) {
            h2.classList.add("complete");
            p.classList.add("complete");
          } else {
            h2.classList.remove("complete");
            p.classList.remove("complete");
          }
          completeTask(task.id);
          completeTaskOnServer(task.id);
        });
        const taskEditBtn = document.createElement("button");
        taskEditBtn.setAttribute("class", "taskEditBtn");
        taskEditBtn.innerText = "Edit";

        taskEditBtn.addEventListener("click", () => {
          addTaskTitle.value = task.title;
          addTaskDesc.value = task.desc;

          const editTaskBtn = document.getElementById("editTask");
          const currentStatus = document.getElementById("currentStatus");

          currentStatus.removeAttribute("class", "hidden");
          currentStatus.innerText = `You are editing task... ${task.title}`;
          currentStatus.value = { id: task.id, isDone: task.isDone };

          editTaskBtn.removeAttribute("class", "hidden");
        });

        li.appendChild(h2);
        li.appendChild(p);
        li.appendChild(tagsWrapper);
        li.appendChild(taskCompleteBtn);
        li.appendChild(taskEditBtn);
        li.appendChild(taskDeleteBtn);

        toDoList.appendChild(li);
      }
    });
  }
}

viewBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.checked) {
      const whichButton = Array.from(viewBtns).indexOf(btn);
      switch (whichButton) {
        case 0:
          toDo.forEach((task) => (task.visible = true));
          break;
        case 1:
          toDo.forEach((task) => {
            if (!task.isDone) {
              task.visible = true;
            } else {
              task.visible = false;
            }
          });
          break;
        case 2:
          toDo.forEach((task) => {
            if (task.isDone) {
              task.visible = true;
            } else {
              task.visible = false;
            }
          });
          break;
      }
      renderList();
    }
  });
});

searchInput.addEventListener("input", () => {
  const searchQuery = searchInput.value.trim().toLowerCase();

  if (searchQuery === "") {
    searchMessage.innerText = "ERROR! Search input must not be empty";
    searchMessage.style.color = "red";
  } else {
    toDo.forEach((task) => {
      if (task.title.includes(searchQuery)) {
        task.visible = true;
      } else {
        task.visible = false;
      }
    });

    const matchingTasks = toDo.filter((task) => task.visible);

    if (matchingTasks && matchingTasks.length > 0) {
      renderList();
      cancelSearch.classList.remove("hidden");
      searchMessage.innerText = "Search query submitted";
      searchMessage.style.color = "lightgreen";
    } else {
      searchMessage.innerText = `ERROR! No tasks contains ${searchQuery}`;
      searchMessage.style.color = "red";
      cancelSearch.classList.add("hidden");
      setTimeout(() => {
        stopSearch();
      }, 3000);
    }
  }
  if (searchMessage.innerText.trim() !== "") {
    setTimeout(() => {
      searchMessage.innerText = "";
    }, 2300);
  }
});

cancelSearch.addEventListener("click", () => {
  stopSearch();
});

function stopSearch() {
  toDo.forEach((task) => (task.visible = true));
  sortList();
  renderList();
  searchInput.value = "";
  cancelSearch.classList.add("hidden");
}

function generateTaskID() {
  if (toDo.length > 0) {
    return toDo.sort((a, b) => a.id - b.id)[toDo.length - 1].id + 1;
  } else {
    return 0;
  }
}

function getEmailFromLocalStorage() {
  const emailData = localStorage.getItem("chutodoemail");
  if (emailData) {
    const parsedData = JSON.parse(emailData);
    return parsedData.key;
  } else {
    return null;
  }
}

function getPasswordFromLocalStorage() {
  const passwordData = localStorage.getItem("chutodopassword");
  if (passwordData) {
    const parsedData = JSON.parse(passwordData);
    return parsedData.key;
  } else {
    return null;
  }
}

function getOrgFromLocalStorage() {
  const orgData = localStorage.getItem("chutodoorg");
  if (orgData) {
    const parsedData = JSON.parse(orgData);
    return parsedData.key;
  } else {
    return null;
  }
}

function getProFromLocalStorage() {
  const orgData = localStorage.getItem("chutodopro");
  if (orgData) {
    const parsedData = JSON.parse(orgData);
    return parsedData.key;
  } else {
    return null;
  }
}

async function getTasksFromServer() {
  try {
    const respone = await fetch(getTasksEndPoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password, orgName: organization, proName: project }),
    });
    if (respone.ok) {
      const status = await respone.json();
      if (status.ok) {
        return status.tasks;
      }
    }
  } catch (error) {
    console.error("Error: ", error);
  }
}

async function addTaskOnServer(task) {
  try {
    const response = await fetch(addTaskEndPoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password, orgName: organization, proName: project, task: task }),
    });
  } catch (error) {
    console.log("Error", error);
  }
}

async function deleteTaskOnServer(id) {
  try {
    const response = await fetch(deleteTaskEndPoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password, orgName: organization, proName: project, id: id }),
    });
  } catch (error) {
    console.log("Error", error);
  }
}

async function editTaskOnServer(task) {
  try {
    const response = await fetch(editTaskEndPoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password, orgName: organization, proName: project, task: task }),
    });
  } catch (error) {
    console.log("Error", error);
  }
}

async function completeTaskOnServer(id) {
  try {
    const response = await fetch(completeTaskEndPoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password, orgName: organization, proName: project, completeTaskID: id }),
    });
  } catch (error) {
    console.log("Error", error);
  }
}
