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
const getUsersEndPoint = IP + "users";
const addUserEndPoint = IP + "addUser";

function createSignUpAuth() {
  const signUpContainer = document.createElement("div");
  const signUpForm = document.createElement("form");
  const userName = document.createElement("input");
  const userNameLabel = document.createElement("label");
  const emailHolder = document.createElement("p");
  const signUpBtn = document.createElement("button");
  const signUpMessage = document.createElement("p");

  signUpContainer.setAttribute("class", "signUpContainer authContainer");

  emailHolder.innerText = email;
  emailHolder.setAttribute("class", "emailHolder");

  const userNameID = "userName";
  userName.setAttribute("placeholder", "Chose a user name");
  userName.setAttribute("id", userNameID);

  userNameLabel.setAttribute("for", userNameID);

  inputs.push(userName);
  labels.push(userNameLabel);

  signUpBtn.innerText = "Create Account";
  signUpBtn.setAttribute("type", "submit");
  signUpBtn.setAttribute("class", "submitBtn");

  signUpMessage.setAttribute("class", "submitMessage");

  submitMessage = signUpMessage;
  form = signUpForm;

  signUpForm.appendChild(emailHolder);
  signUpForm.appendChild(userName);
  signUpForm.appendChild(userNameLabel);
  createInputPasswordToggle(signUpForm, "password", "Chose password", false);
  createInputPasswordToggle(signUpForm, "confirmPassword", "Confirm pasword", false);
  signUpForm.appendChild(signUpBtn);
  signUpContainer.appendChild(signUpForm);
  signUpContainer.appendChild(signUpMessage);

  body.appendChild(signUpContainer);
}

function createInputPasswordToggle(parent, id, placeholder, hidden) {
  const wrapper = document.createElement("div");
  const input = document.createElement("input");
  const toggle = document.createElement("img");
  const label = document.createElement("label");

  input.setAttribute("placeholder", placeholder);
  input.setAttribute("id", id);
  input.setAttribute("class", "passwordInput");
  input.setAttribute("type", "password");

  label.setAttribute("for", id);

  toggle.setAttribute("src", "../icons/eyeon.svg");
  toggle.setAttribute("alt", "Show password");
  toggle.setAttribute("title", "Show password");
  toggle.addEventListener("click", () => {
    const type = input.getAttribute("type") === "password" ? "text" : "password";
    input.setAttribute("type", type);
    if (type === "password") {
      toggle.setAttribute("src", "../icons/eyeon.svg");
      toggle.setAttribute("alt", "Show password");
      toggle.setAttribute("title", "Show password");
    } else {
      toggle.setAttribute("src", "../icons/eyeoff.svg");
      toggle.setAttribute("alt", "Hide password");
      toggle.setAttribute("title", "Hide password");
    }
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

    const userName = inputs[0].value;
    const password = inputs[1].value;
    const confirmPassword = inputs[2].value;

    if (userName !== "" && password.length > 7 && password === confirmPassword && email) {
      signUp(email, userName, password, confirmPassword);
      resetLables();
    } else {
      setSubmitMessage("User name cannot be empty and passwords must match and be atleast 8 characters");
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
  const userNameLabel = labels[0];
  const passwordLabel = labels[1];
  const confirmPasswordLabel = labels[2];

  inputs.forEach((input) => {
    const index = Array.from(inputs).indexOf(input);
    input.addEventListener("input", () => {
      const userName = inputs[0].value;
      const password = inputs[1].value;
      const confirmPassword = inputs[2].value;
      setSubmitMessage("");
      switch (index) {
        case 0:
          checkUserName(userName, userNameLabel);
          break;
        case 1:
          checkPasswordLength(password, passwordLabel);
          break;
        case 2:
          checkPasswordMatch(password, confirmPassword, confirmPasswordLabel);
          break;
      }
    });
  });
  noWhiteSpaceInput();
}

function checkUserName(value, label) {
  if (value !== "") {
    const isUnique = checkUniqueUserName(value);

    if (!isUnique) {
      label.innerText = "User name already exists";
    } else {
      label.innerText = "User name is avaliable";
    }
  } else {
    label.innerText = "";
  }
}

async function checkUniqueUserName(newUserName) {
  const user = await getUsers();
  const userNames = user.map((user) => user.userName.toLowerCase());
  const isUnique = !userNames.includes(newUserName.toLowerCase());
  return isUnique;
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

async function getUsers() {
  try {
    const response = await fetch(getUsersEndPoint);
    if (response.ok) {
      return (users = await response.json());
    }
  } catch (error) {
    console.log("There was a problem fetching users");
  }
}

async function signUp(email, userName, password, confirmPassword) {
  try {
    const response = await fetch(addUserEndPoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, userName: userName, password: password, confirmPassword: confirmPassword }),
    });
    if (response.ok) {
      const status = await response.json();
      if (status.ok) {
        savePasswordToLocalStorage(password);
        setTimeout(() => {
          redirectToAnotherPage(status.path);
        }, 100);
      }
    }
  } catch (error) {
    console.log("Error: ", error);
  }
}
