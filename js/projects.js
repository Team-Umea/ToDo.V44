const body = document.body;
const projectsContainer = document.createElement("ul");

const email = getEmailFromLocalStorage();
const password = getPasswordFromLocalStorage();
const organization = getOrgFromLocalStorage();
const organizationPassword = getOrgPasswordFromLocalStorage();

let form;
let submitMessage;

let inputs = [];
let labels = [];
const trashBins = [];

// const IP = "https://todobackend-vuxr.onrender.com/";
const IP = "http://localhost:3000/";
const getOrgsProjectsEndPoint = IP + "getOrgsProjects";
const getOrgAdminEndPoint = IP + "getOrgAdmin";
const createProjectEndPoint = IP + "createProject";
const deleteProjectEndPoint = IP + "deleteProject";

function init() {
  createNewProjectForm();
  createUlFromProjects();
  formEvent();
  noWhiteSpaceInput();
}

init();

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

async function createUlFromProjects() {
  const projects = await getOrgsProjects();
  const orgAdmin = await getOrgAdmin();

  projectsContainer.innerHTML = "";

  if (projects && projects.length) {
    projectsContainer.classList.remove("hidden");
    projectsContainer.setAttribute("class", "projectsUl");
    projects.forEach((pro) => {
      const projectName = pro.name;
      const projectDate = pro.date;
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
            deleteProject(projectName);
          }
        });
      } else {
        trashBin.classList.add("hidden");
      }

      topContainer.appendChild(selectBtn);
      topContainer.appendChild(proName);
      topContainer.appendChild(trashBin);

      createIconContainer(projectInfoContainer, "../icons/calendar.svg", `${capitalize(projectName)} create at ${projectDate}`, `${capitalize(projectName)} create at ${projectDate}`, projectDate, "Left");

      createIconContainer(projectInfoContainer, "../icons/person.svg", `${projectCreator} created ${capitalize(projectName)}`, `${projectCreator} created ${capitalize(projectName)}`, projectCreator, "Right");

      li.appendChild(topContainer);
      li.appendChild(projectInfoContainer);
      projectsContainer.appendChild(li);
    });
    body.appendChild(projectsContainer);
  } else {
    projectsContainer.classList.add("hidden");
  }
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
      createProject(name);
    } else {
      setSubmitMessage("Enter a project name");
    }
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
          redirectToAnotherPage(status.path);
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
          createUlFromProjects();
        }, 100);
      }
    }
  } catch (error) {
    console.error("Error: ", error);
  }
}
