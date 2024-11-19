const body = document.body;
const projectsContainer = document.createElement("ul");
const filterContainer = document.createElement("div");

const email = getEmailFromLocalStorage();
const password = getPasswordFromLocalStorage();
const organization = getOrgFromLocalStorage();
const organizationPassword = getOrgPasswordFromLocalStorage();

let form;
let submitMessage;

let inputs = [];
let labels = [];
const sortBtns = [];
const trashBins = [];

let localProjects = [];
let localProjectsUnsorted = [];

// const IP = "https://todobackend-vuxr.onrender.com/";
const IP = "http://localhost:3000/";
const getOrgsProjectsEndPoint = IP + "getOrgsProjects";
const getOrgAdminEndPoint = IP + "getOrgAdmin";
const createProjectEndPoint = IP + "createProject";
const deleteProjectEndPoint = IP + "deleteProject";

function init() {
  assignProjects();
  createNewProjectForm();
  formEvent();
  buttonEvents();
  noWhiteSpaceInput();
}

init();

async function assignProjects() {
  const fetchedProjects = await getOrgsProjects();
  localProjects = fetchedProjects.map((project) => {
    return { ...project, visible: true };
  });
  localProjectsUnsorted = localProjects;
  renderProjectsUl();
}

function createNewProjectForm() {
  const h1 = document.createElement("h1");
  const container = document.createElement("div");
  const projectForm = document.createElement("form");
  const header = document.createElement("p");
  const proName = document.createElement("input");
  const btn = document.createElement("button");
  const proMessage = document.createElement("p");

  h1.innerText = `Welcome ${extractUser(email)} to projects in ${capitalize(organization)}`;

  container.setAttribute("class", "formContainer");

  header.innerText = `Create new project in ${capitalize(organization)}`;
  header.setAttribute("class", "formHeader");

  proName.setAttribute("placeholder", "Project name");
  proName.setAttribute("class", "m-1rem");

  proName.addEventListener("input", () => {
    setSubmitMessage("");
  });

  btn.innerText = "Create";
  btn.setAttribute("type", "submit");
  btn.setAttribute("class", "submitBtn");

  proMessage.setAttribute("class", "submitMessage");

  submitMessage = proMessage;
  form = projectForm;
  inputs.push(proName);

  projectForm.appendChild(header);
  projectForm.appendChild(proName);
  projectForm.appendChild(btn);
  container.appendChild(projectForm);
  container.appendChild(proMessage);

  body.appendChild(h1);
  body.appendChild(container);
}

function toggleFilterProjectsContainer() {
  if (localProjects && localProjects.length) {
    filterContainer.innerHTML = "";
    const container = document.createElement("div");

    const sortContainer = document.createElement("div");
    const searchContainer = document.createElement("div");
    const sortHeader = document.createElement("h2");
    const searchHeader = document.createElement("h2");

    const allBtn = document.createElement("input");
    const newBtn = document.createElement("input");
    const oldBtn = document.createElement("input");
    const tasksBtn = document.createElement("input");
    const nameBtn = document.createElement("input");
    const usersProjectsBtn = document.createElement("input");

    const allBtnLabel = document.createElement("label");
    const newBtnLabel = document.createElement("label");
    const oldBtnLabel = document.createElement("label");
    const tasksBtnLabel = document.createElement("label");
    const nameBtnLabel = document.createElement("label");
    const usersProjectsBtnLabel = document.createElement("label");

    const searchwrapper = document.createElement("div");
    const searchInput = document.createElement("input");
    const cancelSearchBtn = document.createElement("button");

    container.setAttribute("class", "filterProjects");
    sortContainer.setAttribute("class", "sortProjects");
    searchContainer.setAttribute("class", "searchProjects");

    sortHeader.innerText = "Sort Order";
    searchHeader.innerText = "Search Projects";

    allBtn.setAttribute("checked", true);

    allBtn.setAttribute("id", "allProjectsBtn");
    newBtn.setAttribute("id", "newProjectsBtn");
    oldBtn.setAttribute("id", "oldProjectsBtn");
    tasksBtn.setAttribute("id", "tasksProjectsBtn");
    nameBtn.setAttribute("id", "projectNameBtn");
    usersProjectsBtn.setAttribute("id", "usersProjectsBtn");

    allBtn.setAttribute("type", "radio");
    newBtn.setAttribute("type", "radio");
    oldBtn.setAttribute("type", "radio");
    tasksBtn.setAttribute("type", "radio");
    nameBtn.setAttribute("type", "radio");
    usersProjectsBtn.setAttribute("type", "radio");

    allBtn.setAttribute("name", "sortProjectsBtn");
    newBtn.setAttribute("name", "sortProjectsBtn");
    oldBtn.setAttribute("name", "sortProjectsBtn");
    tasksBtn.setAttribute("name", "sortProjectsBtn");
    nameBtn.setAttribute("name", "sortProjectsBtn");
    usersProjectsBtn.setAttribute("name", "sortProjectsBtn");

    sortBtns.push(allBtn);
    sortBtns.push(newBtn);
    sortBtns.push(oldBtn);
    sortBtns.push(tasksBtn);
    sortBtns.push(nameBtn);
    sortBtns.push(usersProjectsBtn);

    allBtnLabel.innerText = "View All";
    newBtnLabel.innerText = "Lastest";
    oldBtnLabel.innerText = "Oldest";
    tasksBtnLabel.innerText = "Number of Tasks";
    nameBtnLabel.innerText = "Alphabetical Order";
    usersProjectsBtnLabel.innerText = "Your Projects";

    allBtnLabel.setAttribute("for", "allProjectsBtn");
    newBtnLabel.setAttribute("for", "newProjectsBtn");
    oldBtnLabel.setAttribute("for", "oldProjectsBtn");
    tasksBtnLabel.setAttribute("for", "tasksProjectsBtn");
    nameBtnLabel.setAttribute("for", "projectNameBtn");
    usersProjectsBtnLabel.setAttribute("for", "usersProjectsBtn");

    sortContainer.appendChild(allBtn);
    sortContainer.appendChild(allBtnLabel);

    sortContainer.appendChild(newBtn);
    sortContainer.appendChild(newBtnLabel);

    sortContainer.appendChild(oldBtn);
    sortContainer.appendChild(oldBtnLabel);

    sortContainer.appendChild(tasksBtn);
    sortContainer.appendChild(tasksBtnLabel);

    sortContainer.appendChild(nameBtn);
    sortContainer.appendChild(nameBtnLabel);

    sortContainer.appendChild(usersProjectsBtn);
    sortContainer.appendChild(usersProjectsBtnLabel);

    searchInput.setAttribute("placeholder", "Search by project name");
    searchInput.addEventListener("input", () => {
      const searchQuery = searchInput.value.trim().toLowerCase();
      searchInput.value = searchQuery;

      if (searchQuery !== "") {
        localProjects.forEach((org) => (!org.name.includes(searchQuery) ? (org.visible = false) : (org.visible = true)));
        renderProjectsUl();
      } else {
        localProjects.forEach((org) => (org.visible = true));
        renderProjectsUl();
      }
    });

    cancelSearchBtn.innerText = "Cancel Search";
    cancelSearchBtn.setAttribute("class", "btn");

    searchwrapper.appendChild(searchInput);
    searchwrapper.appendChild(cancelSearchBtn);

    searchContainer.appendChild(searchwrapper);

    container.appendChild(sortHeader);
    container.appendChild(sortContainer);
    container.appendChild(searchHeader);
    container.appendChild(searchContainer);

    filterContainer.appendChild(container);
  } else {
    filterContainer.innerHTML = "";
  }
}

function positonBodyElements() {
  if (localProjects && localProjects.length > 0) {
    body.setAttribute("class", "alignTop");
  } else {
    body.setAttribute("class", "alignCenter");
  }
}

async function renderProjectsUl() {
  const orgAdmin = await getOrgAdmin();
  if (localProjects.length === 0 || filterContainer.innerHTML === "") {
    toggleFilterProjectsContainer();
  }
  if (localProjects && localProjects.length) {
    projectsContainer.innerHTML = "";
    projectsContainer.setAttribute("class", "projectsUl");
    localProjects.forEach((pro) => {
      if (pro.visible) {
        const projectName = pro.name;
        const projectDate = pro.date;
        const projetsTasks = pro.tasks;
        const projectCreator = pro.creator === email ? "You" : extractUser(pro.creator);

        const li = document.createElement("li");
        const topContainer = document.createElement("div");
        const selectBtn = document.createElement("button");
        const proName = document.createElement("h2");
        const trashBin = document.createElement("img");
        const projectInfoContainer = document.createElement("div");

        topContainer.setAttribute("class", "topContainer");
        projectInfoContainer.setAttribute("class", "projectInfoContainer");

        li.setAttribute("class", "projectLi");

        selectBtn.setAttribute("class", "btn btnGreen");
        selectBtn.innerText = "Select";
        selectBtn.addEventListener("click", () => {
          saveProToLocalStorage(projectName);
          setTimeout(() => {
            redirectToAnotherPage("todo.html");
          }, 100);
        });

        proName.innerText = capitalize(projectName);

        if (orgAdmin === email || projectCreator === "You") {
          trashBin.setAttribute("src", "../icons/trashBin.svg");
          trashBin.setAttribute("alt", "Delete project");
          trashBin.setAttribute("title", "Delete project");
          trashBins.push(trashBin);
          trashBin.addEventListener("click", () => {
            const src = trashBin.getAttribute("src");
            if (src.includes("trash")) {
              resetTrashBins();
              trashBin.setAttribute("src", "../icons/checkmark.svg");
              trashBin.setAttribute("alt", "Confirm delete");
              trashBin.setAttribute("title", "Confirm delete");
            } else {
              removeFromLocalStorage("chutodopro");
              setTimeout(() => {
                deleteProject(projectName);
                updateLocalProjects();
              }, 100);
            }
          });
        } else {
          trashBin.classList.add("hidden");
        }

        topContainer.appendChild(selectBtn);
        topContainer.appendChild(proName);
        topContainer.appendChild(trashBin);

        createIconContainer(projectInfoContainer, "../icons/calendar.svg", `${capitalize(projectName)} create at ${projectDate}`, `${capitalize(projectName)} create at ${projectDate}`, projectDate, "Left");

        createIconContainer(projectInfoContainer, "../icons/task.svg", `Project ${projectName} has ${projetsTasks} tasks`, `Project ${projectName} has ${projetsTasks} tasks`, projetsTasks, "Left");

        createIconContainer(projectInfoContainer, "../icons/person.svg", `${projectCreator} created ${capitalize(projectName)}`, `${projectCreator} created ${capitalize(projectName)}`, projectCreator, "Right");

        projectInfoContainer.children[1].classList.add("centerIcon");

        li.appendChild(topContainer);
        li.appendChild(projectInfoContainer);
        projectsContainer.appendChild(li);
      }
    });
    body.appendChild(projectsContainer);
  }
  positonBodyElements();
}

function resetTrashBins() {
  trashBins.forEach((trashBin) => {
    trashBin.setAttribute("src", "../icons/trashBin.svg");
    trashBin.setAttribute("alt", "Delete project");
    trashBin.setAttribute("title", "Delete project");
  });
}

function createIconContainer(parent, src, alt, title, text, dir) {
  const container = document.createElement("div");
  const desc = document.createElement("p");
  const icon = document.createElement("img");

  container.setAttribute("class", `iconContainer iconContainer${dir}`);
  container.setAttribute("title", title);

  desc.innerText = text;

  icon.setAttribute("src", src);
  icon.setAttribute("alt", alt);

  container.appendChild(icon);
  container.appendChild(desc);

  parent.appendChild(container);
}

function formEvent() {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = inputs[0].value;

    if (name) {
      clearInputs();
      setTimeout(() => {
        createProject(name);
        updateLocalProjects();
      }, 100);
    } else {
      setSubmitMessage("Enter a project name");
    }
  });
}

function buttonEvents() {
  sortBtns.forEach((btn) => {
    const index = Array.from(sortBtns).indexOf(btn);
    btn.addEventListener("click", () => {
      switch (index) {
        case 0:
          localProjects = localProjectsUnsorted;
          break;
        case 1:
          localProjects = localProjects.sort((a, b) => {
            const dateA = parseDate(a.date);
            const dateB = parseDate(b.date);
            return dateB - dateA;
          });
          break;
        case 2:
          localProjects = localProjects.sort((a, b) => {
            const dateA = parseDate(a.date);
            const dateB = parseDate(b.date);
            return dateA - dateB;
          });
          break;
        case 3:
          localProjects = localProjects.sort((a, b) => b.tasks - a.tasks);
          break;
        case 4:
          localProjects = localProjects.sort((a, b) => {
            const isADigits = /^\d+$/.test(a.name);
            const isBDigits = /^\d+$/.test(b.name);

            if (isADigits && isBDigits) return 0;
            if (isADigits) return 1;
            if (isBDigits) return -1;

            return a.name.localeCompare(b.name);
          });
          break;
        case 5:
          if (email) {
            localProjects = localProjects.sort((a, b) => {
              const includesA = a.creator.includes(email);
              const includesB = b.creator.includes(email);

              if (includesA && !includesB) return -1;
              if (!includesA && includesB) return 1;

              return a.creator.localeCompare(b.creator);
            });
          }
          break;
      }
      renderProjectsUl();
    });
  });
}

function setSubmitMessage(msg) {
  submitMessage.innerText = msg;
}

function removeWhiteSpace(str) {
  return str.replace(/\s+/g, "");
}

function noWhiteSpaceInput() {
  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      input.value = removeWhiteSpace(input.value);
    });
  });
}

function clearInputs() {
  inputs.forEach((input) => (input.value = ""));
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

function getOrgPasswordFromLocalStorage() {
  const passwordData = localStorage.getItem("chutodoorgpassword");
  if (passwordData) {
    const parsedData = JSON.parse(passwordData);
    return parsedData.key;
  } else {
    return null;
  }
}

function saveProToLocalStorage(name) {
  localStorage.setItem("chutodopro", JSON.stringify({ key: name }));
}

function removeFromLocalStorage(key) {
  if (localStorage.getItem(key) !== null) {
    localStorage.removeItem(key);
  }
}

function redirectToAnotherPage(path) {
  window.location.href = path;
}

function reloadPage() {
  location.reload();
}

function extractUser(email) {
  if (email) {
    const priorAt = email.split("@")[0];
    if (priorAt.includes(".")) {
      const firstName = capitalize(priorAt.split(".")[0]).replace(/[^a-zA-Z]/g, "");
      const lastName = capitalize(priorAt.split(".")[1]).replace(/[^a-zA-Z]/g, "");
      return `${firstName} ${lastName}`;
    } else {
      return capitalize(priorAt);
    }
  } else {
    return "";
  }
}

function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1);
}

function parseDate(dateString) {
  const [datePart, timePart] = dateString.split(" - ");
  const [day, month, year] = datePart.split("/").map(Number);
  const [hours, minutes] = timePart.split(":").map(Number);

  return new Date(2000 + year, month - 1, day, hours, minutes);
}

function updateLocalProjects() {
  assignProjects();
}

async function getOrgsProjects() {
  try {
    const respone = await fetch(getOrgsProjectsEndPoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password, orgName: organization, orgPassword: organizationPassword }),
    });
    if (respone.ok) {
      const status = await respone.json();
      if (status.ok) {
        return status.projects;
      }
    }
  } catch (error) {
    console.error("Error: ", error);
  }
}

async function getOrgAdmin() {
  try {
    const respone = await fetch(getOrgAdminEndPoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password, orgName: organization, orgPassword: organizationPassword }),
    });
    if (respone.ok) {
      const status = await respone.json();
      if (status.ok) {
        return status.orgAdmin;
      }
    }
  } catch (error) {
    console.error("Error: ", error);
  }
}

async function createProject(name) {
  try {
    const respone = await fetch(createProjectEndPoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password, orgName: organization, orgPassword: organizationPassword, proName: name }),
    });
    if (respone.ok) {
      const status = await respone.json();
      if (status.ok) {
        saveProToLocalStorage(name);
        setTimeout(() => {
          // redirectToAnotherPage(status.path);
        }, 100);
      }
    }
  } catch (error) {
    console.error("Error: ", error);
  }
}

async function deleteProject(name) {
  try {
    const respone = await fetch(deleteProjectEndPoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password, orgName: organization, orgPassword: organizationPassword, proName: name }),
    });
    if (respone.ok) {
      const status = await respone.json();
      if (status.ok) {
        const key = "chutodopro";
        removeFromLocalStorage(key);
        setTimeout(() => {
          renderProjectsUl();
        }, 100);
      }
    }
  } catch (error) {
    console.error("Error: ", error);
  }
}
