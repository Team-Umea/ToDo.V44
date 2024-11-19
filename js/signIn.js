const body = document.body;

const email = getEmailFromLocalStorage();
let passChangeCode;

let form;
let message;

let inputs = [];
let labels = [];
let buttons = [];
let wrappers = [];

function init() {
  createSignInAuth();
  buttonEvents();
  noWhiteSpaceInput();
  formEvent();
}

init();

// const IP = "https://todobackend-vuxr.onrender.com/";
const IP = "http://localhost:3000/";
const signInEndPoint = IP + "signIn";
const getUsersEndPoint = IP + "users";
const getPasswordChangeCodeEndPoint = IP + "sendPasswordChangeCode";
const changePasswordEndPoint = IP + "changePassword";

function createSignInAuth() {
  const signInContainer = document.createElement("div");
  const signInForm = document.createElement("form");
  const emailHolder = document.createElement("p");
  const code = document.createElement("input");
  const cancelResetBtn = document.createElement("button");
  const resetPassWordBtn = document.createElement("button");
  const signInBtn = document.createElement("button");
  const signInMessage = document.createElement("p");

  signInContainer.setAttribute("class", "signUpContainer authContainer");

  emailHolder.innerText = email;
  emailHolder.setAttribute("class", "emailHolder");

  code.setAttribute("placeholder", "Enter verification code sent to your email");
  code.setAttribute("class", "hidden m-1rem");
  code.setAttribute("type", "number");

  cancelResetBtn.setAttribute("class", "cancelBtn btn hidden");
  cancelResetBtn.innerText = "Cancel";

  resetPassWordBtn.innerText = "Reset Password";
  resetPassWordBtn.setAttribute("class", "btn");
  resetPassWordBtn.setAttribute("type", "button");

  signInBtn.innerText = "Sign In";
  signInBtn.setAttribute("type", "submit");
  signInBtn.setAttribute("class", "submitBtn");

  signInMessage.setAttribute("class", "submitMessage");

  message = signInMessage;
  form = signInForm;

  buttons.push(resetPassWordBtn);
  buttons.push(cancelResetBtn);
  buttons.push(signInBtn);

  signInForm.appendChild(emailHolder);
  signInForm.appendChild(code);
  createInputPasswordToggle(signInForm, "password", "Enter your password", false);
  createInputPasswordToggle(signInForm, "confirmPassword", "Confirm new password", true);
  signInForm.appendChild(cancelResetBtn);
  signInForm.appendChild(resetPassWordBtn);
  signInForm.appendChild(signInBtn);
  signInContainer.appendChild(signInForm);
  signInContainer.appendChild(signInMessage);

  inputs.push(code);

  body.appendChild(signInContainer);
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

function hideResetEls(resetBtn, cancelBtn, signInBtn) {
  inputs.forEach((input) => {
    const index = Array.from(inputs).indexOf(input);
    switch (index) {
      case 0:
        input.placeholder = "Enter your password";
        break;
      case 1:
        input.classList.add("hidden");
        break;
      case 2:
        input.classList.add("hidden");
        break;
    }
  });

  toggleWrappers(false);
  resetBtn.setAttribute("type", "button");
  resetBtn.innerText = "Reset Password";
  cancelBtn.classList.add("hidden");
  signInBtn.classList.remove("hidden");
  inputEvents(false);
  resetLables();
}

function showResetEls(resetBtn, cancelBtn, signInBtn) {
  inputs.forEach((input) => {
    const index = Array.from(inputs).indexOf(input);
    switch (index) {
      case 0:
        input.placeholder = "Chose new password";
        break;
      case 1:
        input.classList.remove("hidden");
        break;
      case 2:
        input.classList.remove("hidden");
        break;
    }
  });

  toggleWrappers(true);
  resetBtn.setAttribute("type", "submit");
  resetBtn.innerText = "Confirm New Password";
  cancelBtn.classList.remove("hidden");
  signInBtn.classList.add("hidden");
  inputEvents(true);
  resetLables();
  resetInputs();
}

function inputEvents(addEvent) {
  const passwordLabel = labels[0];
  const confirmPasswordLabel = labels[1];

  function handleInput(index) {
    return function () {
      const password = inputs[0].value;
      const confirmPassword = inputs[1].value;

      if (index === 0) {
        checkPasswordLength(password, passwordLabel);
      } else if (index === 1) {
        checkPasswordMatch(password, confirmPassword, confirmPasswordLabel);
      }

      setFormMessage("");
    };
  }

  inputs.forEach((input, index) => {
    const boundHandler = handleInput(index).bind(input);

    if (addEvent) {
      input.addEventListener("input", boundHandler);
      input.boundHandler = boundHandler;
    } else {
      if (input.boundHandler) {
        input.removeEventListener("input", input.boundHandler);
      }
    }
  });
}

function toggleWrappers(show) {
  show ? wrappers[1].classList.remove("hidden") : wrappers[1].classList.add("hidden");
}

function buttonEvents() {
  const resetBtn = buttons[0];
  const cancelBtn = buttons[1];
  const signInBtn = buttons[2];

  resetBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const password = inputs[0].value;
    const confirmPassword = inputs[1].value;
    const code = inputs[2].value;
    const btnText = resetBtn.innerText;
    if (btnText === "Reset Password") {
      getPasswordChangeCode(email);
      showResetEls(resetBtn, cancelBtn, signInBtn);
    } else {
      if (password.length > 7) {
        if (password === confirmPassword) {
          if (code.length === 6) {
            changePassword(email, password, confirmPassword, code);
          } else {
            setFormMessage("Code must be 6 digits");
          }
        } else {
          setFormMessage("Passwords must match");
        }
      } else {
        setFormMessage("Passwords must be atleast 8 characters");
      }
    }
  });

  cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    hideResetEls(resetBtn, cancelBtn, signInBtn);
    resetInputs();
  });
}

function formEvent() {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const password = inputs[0].value;
    if (checkCredentials(email, password)) {
      signIn(email, password);
    }
  });
}

function setFormMessage(msg) {
  message.innerText = msg;
}

function resetLables() {
  labels.forEach((label) => (label.innerText = ""));
}

function resetInputs() {
  inputs.forEach((input) => (input.value = ""));
}

function placePasswordInInput() {
  const passwordEl = inputs[0];
  const password = inputs[0].value;
  passwordEl.value = password;
}

function noWhiteSpaceInput() {
  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      input.value = removeWhiteSpace(input.value);
    });
  });
}

function removeWhiteSpace(str) {
  return str.replace(/\s+/g, "");
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

function redirectToAnotherPage(path) {
  window.location.href = path;
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

function savePasswordToLocalStorage(password) {
  localStorage.setItem("chutodopassword", JSON.stringify({ key: password }));
}

async function checkCredentials(emailToSubmit) {
  const users = await getUsers();
  const user = users.filter((email) => email === emailToSubmit);
  if (user) {
    return true;
  }
  return false;
}

async function getPasswordChangeCode(email) {
  try {
    fetch(getPasswordChangeCodeEndPoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    });
  } catch (error) {
    console.log("Error", error);
  }
}

async function changePassword(email, password, confirmPassword, code) {
  try {
    const response = await fetch(changePasswordEndPoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password, confirmPassword: confirmPassword, code: code }),
    });
    if (response.ok) {
      const status = await response.json();
      if (status.ok) {
        const resetBtn = buttons[0];
        const cancelBtn = buttons[1];
        const signInBtn = buttons[2];
        hideResetEls(resetBtn, cancelBtn, signInBtn);
      }
    }
  } catch (error) {
    console.log("Error", error);
  }
}

async function signIn(email, password) {
  try {
    const response = await fetch(signInEndPoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
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
    console.log("Error", error);
  }
}

async function getUsers() {
  try {
    const res = await fetch(getUsersEndPoint);
    return (users = await res.json());
  } catch (error) {
    console.log("There was a problem fetching users");
  }
}
