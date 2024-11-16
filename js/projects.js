const body = document.body;

const email = getEmailFromLocalStorage();
const password = getPasswordFromLocalStorage();
const organization = getOrgFromLocalStorage();
// let passChangeCode;

let form;
let submitMessage;

let inputs = [];
let labels = [];

// const IP = "https://todobackend-vuxr.onrender.com/";
const IP = "http://localhost:3000/";
const createProjectEndPoint = IP + "createProject";
const getOrgsProjectsEndPoint = IP + "getOrgsProjects";

function init() {
  createSignInAuth();
  createUlFromProjects();
  formEvent();
  noWhiteSpaceInput();
}

init();

function createSignInAuth() {
  const container = document.createElement("div");
  const projectForm = document.createElement("form");
  const header = document.createElement("p");
  const proName = document.createElement("input");
  const btn = document.createElement("button");
  const proMessage = document.createElement("p");

  container.setAttribute("class", "authContainer");

  header.innerText = "Create new project";
  header.setAttribute("class", "formHeader");

  proName.setAttribute("placeholder", "Project name");
  proName.setAttribute("class", "m-1rem");

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

  body.appendChild(container);
}

async function createUlFromProjects() {
  const projects = await getOrgsProjects();

  if (projects.length) {
    const container = document.createElement("ul");
    container.setAttribute("class", "projectsUl");
    projects.forEach((pro) => {
      const li = document.createElement("li");
      const proName = document.createElement("p");

      li.addEventListener("click", () => {
        saveProToLocalStorage(pro);
        redirectToAnotherPage("todo.html");
      });

      proName.innerText = pro;

      li.appendChild(proName);
      container.appendChild(li);
    });
    body.appendChild(container);
  }
}

function createInputPasswordToggle(parent, id, placeholder, hidden) {
  const wrapper = document.createElement("div");
  const input = document.createElement("input");
  const toggle = document.createElement("span");
  const label = document.createElement("label");

  input.setAttribute("placeholder", placeholder);
  input.setAttribute("id", id);
  input.setAttribute("class", "passwordInput");
  input.setAttribute("type", "password");

  label.setAttribute("for", id);

  toggle.innerHTML = "&#128065";
  toggle.addEventListener("click", (e) => {
    e.preventDefault();
    const toggleIcon = this;

    const type = input.getAttribute("type") === "password" ? "text" : "password";
    input.setAttribute("type", type);
    toggleIcon.innerHTML = type === "password" ? "\u{1F641}" : "\u{1F60E}";
  });

  if (hidden) {
    wrapper.setAttribute("class", "passwordWrapper hidden");
  } else {
    wrapper.setAttribute("class", "passwordWrapper");
  }

  wrapper.appendChild(input);
  wrapper.appendChild(toggle);

  inputs.push(input);
  labels.push(label);
  wrappers.push(wrapper);

  parent.appendChild(wrapper);
  parent.appendChild(label);
}

function formEvent() {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = inputs[0].value;

    if (name) {
      clearInputs();
      resetLables();
      saveProToLocalStorage(name);
      setTimeout(() => {
        createProject(name);
      }, 200);
    } else {
      setSubmitMessage("Enter a project name");
    }
  });
}

function checkPasswordLength(value, label) {
  if (value.length < 8) {
    label.innerText = "Password must be atleast 8 characters";
  } else {
    label.innerText = "";
  }
}

function checkPasswordMatch(value1, value2, label) {
  if (value1 !== value2) {
    label.innerText = "Passwords must match";
  } else {
    label.innerText = "";
  }
}

function resetLables() {
  labels.forEach((label) => (label.innerText = ""));
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

function redirectToAnotherPage(path) {
  window.location.href = path;
}

function saveProToLocalStorage(name) {
  localStorage.setItem("chutodopro", JSON.stringify({ key: name }));
}

async function createProject(name) {
  try {
    const respone = await fetch(createProjectEndPoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password, name: name, org: organization }),
    });
    if (respone.ok) {
      const status = await respone.json();
      if (status.ok) {
        redirectToAnotherPage(status.path);
      }
    }
  } catch (error) {
    console.error("Error: ", error);
  }
}

async function getOrgsProjects() {
  try {
    const respone = await fetch(getOrgsProjectsEndPoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password, org: organization }),
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
