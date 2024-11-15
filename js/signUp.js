const body = document.body;
const email = getEmailFromLocalStorage();

let form;
let inputs = [];
let labels = [];
let wrappers = [];
let submitMessage;

function init() {
  createSignUpAuth();
  formEvents();
  inputEvents();
}

init();

// const IP = "https://todobackend-vuxr.onrender.com/";
const IP = "http://localhost:3000/";
const addUserEndPoint = IP + "addUser";

function createSignUpAuth() {
  const signUpContainer = document.createElement("div");
  const signUpForm = document.createElement("form");
  const emailHolder = document.createElement("p");
  const signUpBtn = document.createElement("button");
  const signUpMessage = document.createElement("p");

  signUpContainer.setAttribute("class", "signUpContainer authContainer");

  emailHolder.innerText = email;

  emailHolder.setAttribute("class", "emailHolder");

  signUpBtn.innerText = "Skapa konto";
  signUpBtn.setAttribute("type", "submit");
  signUpBtn.setAttribute("class", "submitBtn");

  signUpMessage.setAttribute("class", "submitMessage");

  submitMessage = signUpMessage;
  form = signUpForm;

  signUpForm.appendChild(emailHolder);
  createInputPasswordToggle(signUpForm, "password", "Ange ett lösenord", false);
  createInputPasswordToggle(signUpForm, "confirmPassword", "Bekräfta lösenord", false);
  signUpForm.appendChild(signUpBtn);
  signUpContainer.appendChild(signUpForm);
  signUpContainer.appendChild(signUpMessage);

  body.appendChild(signUpContainer);
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

function formEvents() {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const password = inputs[0].value;
    const confirmPassword = inputs[1].value;

    if (password.length > 7 && password === confirmPassword) {
      addUser(email, password, confirmPassword);
      resetLables();
    } else {
      setSubmitMessage("Lösenorden måste vara samma och minst vara 8 tecken långa");
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

function inputEvents() {
  const passwordLabel = labels[0];
  const confirmPasswordLabel = labels[1];

  inputs.forEach((input) => {
    const index = Array.from(inputs).indexOf(input);
    input.addEventListener("input", () => {
      const password = inputs[0].value;
      const confirmPassword = inputs[1].value;
      setSubmitMessage("");
      switch (index) {
        case 0:
          checkPasswordLength(password, passwordLabel);
          break;
        case 1:
          checkPasswordMatch(password, confirmPassword, confirmPasswordLabel);
          break;
      }
    });
  });
  noWhiteSpaceInput();
}

function checkPasswordLength(value, label) {
  if (value.length < 8) {
    label.innerText = "Lösenordet måste vara minst 8 tecken långt";
  } else {
    label.innerText = "";
  }
}

function checkPasswordMatch(value1, value2, label) {
  if (value1 !== value2) {
    label.innerText = "Lösenorden måste vara samma";
  } else {
    label.innerText = "";
  }
}

function resetLables() {
  labels.forEach((label) => (label.innerText = ""));
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

function savePasswordToLocalStorage(password) {
  localStorage.setItem("chutodopassword", JSON.stringify({ key: password }));
}

function redirectToAnotherPage(path) {
  window.location.href = path;
}

async function addUser(email, password, confirmPassword) {
  try {
    const response = await fetch(addUserEndPoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password, confirmPassword: confirmPassword }),
    });
    if (response.ok) {
      const status = await response.json();
      if (status.ok) {
        savePasswordToLocalStorage(password);
        redirectToAnotherPage(status.path);
      }
    }
  } catch (error) {
    console.log("Error: ", error);
  }
}
