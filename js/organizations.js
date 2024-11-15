const body = document.body;

const email = getEmailFromLocalStorage();
const password = getPasswordFromLocalStorage();
let passChangeCode;
let selectedOrganization;
// let form;
let forms = [];
let submitMessages = [];

let inputs = [];
let labels = [];
let buttons = [];
let wrappers = [];
let uls = [];

function init() {
  createJoinOrgForm();
  createNewOrgForm();
  inputEvents();
  formEvent();
  buttonEvents();
}

init();

// const IP = "https://todobackend-vuxr.onrender.com/";
const IP = "http://localhost:3000/";
const getOrgsEndPoint = IP + "getAllOrgs";
const joinOrgEndPoint = IP + "joinOrg";
const createOrganizationEndPoint = IP + "createOrg";
// const getPasswordChangeCodeEndPoint = IP + "sendPasswordChangeCode";
// const changePasswordEndPoint = IP + "changePassword";

function createJoinOrgForm() {
  const container = document.createElement("div");
  const orgForm = document.createElement("form");
  const header = document.createElement("p");
  const orgName = document.createElement("input");
  const cancelPassWordBtn = document.createElement("button");
  const organizations = document.createElement("ul");
  const btn = document.createElement("button");
  const formMessage = document.createElement("p");

  container.setAttribute("class", "authContainer");

  header.innerText = "Join organization";
  header.setAttribute("class", "formHeader");

  orgName.setAttribute("placeholder", "Search by organization name");
  orgName.setAttribute("class", "m-1rem");

  cancelPassWordBtn.innerText = "Cancel";
  cancelPassWordBtn.setAttribute("class", "btn cancelBtn hidden");
  cancelPassWordBtn.setAttribute("type", "button");

  organizations.setAttribute("class", "orgUl hidden");

  orgName.addEventListener("input", () => {
    const searchQuery = orgName.value.toLowerCase();
    searchOrganizations(organizations, searchQuery);
  });

  btn.innerText = "Search and click on organization to select";
  btn.setAttribute("type", "submit");
  btn.setAttribute("class", "submitBtn");

  formMessage.setAttribute("class", "submitMessage");

  submitMessages.push(formMessage);
  form = orgForm;

  inputs.push(orgName);
  uls.push(organizations);
  buttons.push(cancelPassWordBtn);
  buttons.push(btn);
  forms.push(orgForm);

  orgForm.appendChild(header);
  orgForm.appendChild(orgName);
  createInputPasswordToggle(orgForm, "orgName", "Enter organization password", true, false);
  orgForm.appendChild(cancelPassWordBtn);
  orgForm.appendChild(organizations);
  orgForm.appendChild(btn);
  container.appendChild(orgForm);
  container.appendChild(formMessage);

  body.appendChild(container);

  const orgPassword = wrappers[0];
  orgPassword.classList.add("m-1rem");
}

function createNewOrgForm() {
  const container = document.createElement("div");
  const orgForm = document.createElement("form");
  const header = document.createElement("p");
  const orgName = document.createElement("input");
  const btn = document.createElement("button");
  const formMessage = document.createElement("p");

  container.setAttribute("class", "authContainer");

  header.innerText = "Create new organization";
  header.setAttribute("class", "formHeader");

  orgName.setAttribute("placeholder", "Name of organization");
  orgName.setAttribute("class", "m-1rem");

  btn.innerText = "Create";
  btn.setAttribute("type", "submit");
  btn.setAttribute("class", "submitBtn");

  formMessage.setAttribute("class", "submitMessage");

  submitMessages.push(formMessage);
  forms.push(orgForm);
  buttons.push(btn);
  inputs.push(orgName);

  orgForm.appendChild(header);
  orgForm.appendChild(orgName);
  createInputPasswordToggle(orgForm, "password", "Chose a password", false, true);
  createInputPasswordToggle(orgForm, "confirmPassword", "Confirm password", false, true);
  orgForm.appendChild(btn);
  container.appendChild(orgForm);
  container.appendChild(formMessage);

  body.appendChild(container);
}

function createInputPasswordToggle(parent, id, placeholder, hidden, addLabel) {
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
  if (addLabel) {
    labels.push(label);
  }
  wrappers.push(wrapper);

  parent.appendChild(wrapper);
  if (addLabel) {
    parent.appendChild(label);
  }
}

async function searchOrganizations(parent, searchQuery) {
  parent.innerHTML = "";
  const orgNames = await getOrgs();
  const anyMatchingOrgs = orgNames.find((org) => org.toLowerCase().includes(searchQuery));
  if (anyMatchingOrgs && searchQuery !== "") {
    parent.classList.remove("hidden");

    orgNames.forEach((org) => {
      const inSensitveOrg = org.toLowerCase();
      if (inSensitveOrg.includes(searchQuery)) {
        const li = document.createElement("li");
        li.innerText = org;

        li.addEventListener("click", () => {
          selectedOrganization = org;
          const submitBtn = buttons[1];
          submitBtn.innerText = `Join ${org}`;
        });

        parent.appendChild(li);
      }
    });
  } else {
    parent.classList.add("hidden");
  }
}

function toggleJoinForm(btn, enterPassword) {
  const searchInput = inputs[0];
  const passwordInput = inputs[1];
  const orgPassword = wrappers[0];
  const organizations = uls[0];
  const cancelPassWord = buttons[0];
  if (enterPassword) {
    searchInput.value = "";
    searchInput.classList.add("hidden");
    organizations.classList.add("hidden");
    cancelPassWord.classList.remove("hidden");
    orgPassword.classList.remove("hidden");
    btn.innerText = "Join";
  } else {
    passwordInput.value = "";
    searchInput.classList.remove("hidden");
    cancelPassWord.classList.add("hidden");
    orgPassword.classList.add("hidden");
    btn.innerText = "Search and click on organization to select";
    selectedOrganization = undefined;
  }
}

function formEvent() {
  forms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const index = Array.from(forms).indexOf(form);
      switch (index) {
        case 0:
          const btn = buttons[1];
          const btnText = btn.innerText;
          if (selectedOrganization && btnText !== "Join") {
            toggleJoinForm(btn, true);
          } else {
            if (btnText !== "Search and click on organization to select" && selectedOrganization) {
              const orgPassword = inputs[1].value;
              joinOrganization(selectedOrganization, orgPassword);
            }
          }
          break;
        case 1:
          const name = inputs[2].value;
          const password = inputs[3].value;
          const confirmPassword = inputs[4].value;

          if (password.length > 7 && password === confirmPassword) {
            createOrganization(name, password, confirmPassword);
            resetLables();
          } else {
            setSubmitMessage(1, "Passwords must match and be atleast 8 characters");
          }
          break;
      }
    });
  });
}

function inputEvents() {
  const passwordLabel = labels[0];
  const confirmPasswordLabel = labels[1];

  inputs.forEach((input) => {
    const index = Array.from(inputs).indexOf(input);
    input.addEventListener("input", () => {
      const password = inputs[3].value;
      const confirmPassword = inputs[4].value;
      switch (index) {
        case 0:
          setSubmitMessage(0, "");
          break;
        case 3:
          checkPasswordLength(password, passwordLabel);
          setSubmitMessage(1, "");
          break;
        case 4:
          checkPasswordMatch(password, confirmPassword, confirmPasswordLabel);
          setSubmitMessage(1, "");
          break;
      }
    });
  });
  noWhiteSpaceInput();
}

function buttonEvents() {
  buttons.forEach((btn) => {
    const index = Array.from(buttons).indexOf(btn);
    btn.addEventListener("click", (e) => {
      switch (index) {
        case 0:
          const submitBtn = buttons[1];
          toggleJoinForm(submitBtn, false);
          break;
        // case 1:
        // break;
        default:
          break;
      }
    });
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

function setSubmitMessage(index, msg) {
  submitMessages[index].innerText = msg;
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

function redirectToAnotherPage(path) {
  window.location.href = path;
}

function saveOrgToLocalStorage(name) {
  localStorage.setItem("chutodoorg", JSON.stringify({ key: name }));
}

async function getOrgs() {
  try {
    const response = await fetch(getOrgsEndPoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    });
    if (response.ok) {
      const status = await response.json();
      if (status.ok) {
        return status.orgs;
      }
    }
  } catch (error) {
    console.error(error);
  }
}

async function joinOrganization(orgName, orgPassword) {
  try {
    const response = await fetch(joinOrgEndPoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password, orgName: orgName, orgPassword: orgPassword }),
    });
    if (response.ok) {
      const status = await response.json();
      if (status.ok) {
        saveOrgToLocalStorage(selectedOrganization);
        redirectToAnotherPage(status.path);
      }
    }
  } catch (error) {
    console.error("Error: ", error);
  }
}

async function createOrganization(name, orgPassword, confirmPassword) {
  try {
    const response = await fetch(createOrganizationEndPoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: name, orgPassword: orgPassword, confirmPassword: confirmPassword, email: email }),
    });
    if (response.ok) {
      const status = await response.json();
      if (status.ok) {
        saveOrgToLocalStorage(name);
        redirectToAnotherPage(status.path);
      }
    }
  } catch (error) {
    console.error("Error: ", error);
  }
}
