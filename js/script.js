const body = document.body;

let form;
let submitBtn;
let submitMessage;
const inputs = [];
const labels = [];

// const IP = "https://todobackend-vuxr.onrender.com/";
const IP = "http://localhost:3000/";
const getVerCodeEndPoint = IP + "sendVerCode";
const verifyEmailEndPoint = IP + "verifyEmail";
const getUsersEndPoint = IP + "users";
const signInEndPoint = IP + "signIn";
const getOrgsProjectsEndPoint = IP + "getOrgsProjects";
const getTasksEndPoint = IP + "tasks";

async function init() {
  const email = getEmailFromLocalStorage();
  const password = getPasswordFromLocalStorage();
  const organization = getOrgFromLocalStorage();
  const organizationPassword = getOrgPasswordFromLocalStorage();
  const project = getProFromLocalStorage();

  if (email && password) {
    if (organization && organizationPassword) {
      const isAllowedToLoadOrgsProjects = await getOrgsProjects(email, password, organization, organizationPassword);
      const users = await getUsers();
      const userExists = users.includes(email);
      if (userExists) {
        if (project && isAllowedToLoadOrgsProjects) {
          const isAllowedToLoadProject = await getTasksFromServer(email, password, organization, organizationPassword, project);
          if (isAllowedToLoadProject) {
            redirectToAnotherPage("todo.html");
          } else {
            redirectToAnotherPage("projects.html");
          }
        } else if (isAllowedToLoadOrgsProjects) {
          redirectToAnotherPage("projects.html");
        } else {
          redirectToAnotherPage("organizations.html");
        }
      } else {
        redirectToAnotherPage("signUp.html");
      }
    } else {
      const attemptSignIn = await signIn(email, password);
      if (attemptSignIn.valid === true) {
        redirectToAnotherPage(attemptSignIn.path);
      } else {
        createEmailAuth();
        formEvents();
        inputEvents();
      }
    }
  } else if (email) {
    const valueOfExists = await userExistsOnServer();
    if (valueOfExists) {
      redirectToAnotherPage("signIn.html");
    } else {
      redirectToAnotherPage("signUp.html");
    }
  } else {
    createEmailAuth();
    formEvents();
    inputEvents();
  }
}

init();

function createEmailAuth() {
  const emailContainer = document.createElement("div");
  const emailForm = document.createElement("form");
  const emailInput = document.createElement("input");
  const emailLabel = document.createElement("label");
  const codeInput = document.createElement("input");
  const codeLabel = document.createElement("label");
  const emailSubmitBtn = document.createElement("button");
  const submitMessageEl = document.createElement("p");

  const emailID = "email";
  const codeID = "code";

  emailContainer.setAttribute("class", "emailContainer authContainer");
  emailInput.setAttribute("placeholder", "Enter email");
  emailInput.setAttribute("id", emailID);

  emailLabel.setAttribute("for", emailID);

  codeInput.setAttribute("id", codeID);
  codeInput.setAttribute("placeholder", "Enter verification code sent to your email");
  codeInput.setAttribute("class", "hidden");
  codeInput.setAttribute("type", "number");

  codeLabel.setAttribute("for", codeID);

  emailSubmitBtn.innerText = "Continue";
  emailSubmitBtn.setAttribute("type", "submit");
  emailSubmitBtn.setAttribute("class", "submitBtn");

  form = emailForm;
  submitBtn = emailSubmitBtn;
  submitMessage = submitMessageEl;

  inputs.push(emailInput);
  inputs.push(codeInput);

  labels.push(emailLabel);
  labels.push(codeLabel);

  emailForm.appendChild(emailInput);
  emailForm.appendChild(emailLabel);
  emailForm.appendChild(codeInput);
  emailForm.appendChild(codeLabel);
  emailForm.appendChild(emailSubmitBtn);

  emailContainer.appendChild(emailForm);
  emailContainer.appendChild(submitMessageEl);

  body.appendChild(emailContainer);
}

function formEvents() {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const buttonText = submitBtn.innerText;
    const email = inputs[0].value;
    const code = inputs[1].value;
    if (buttonText === "Continue") {
      showCodeEls();
      setBtnText("Verify email");
      getVerCode(email);
    } else if (buttonText === "Verify email") {
      verifyEmail(email, code);
      setTimeout(() => {
        setSubmitMessage("Invalid code");
      }, 3000);
    }
  });
}

function showCodeEls() {
  const codeInput = inputs[1];
  codeInput.classList.remove("hidden");
}

function setBtnText(text) {
  submitBtn.innerText = text;
}

function setSubmitMessage(msg) {
  submitMessage.innerText = msg;
}

function inputEvents() {
  const emailLabel = labels[0];
  const codeLabel = labels[1];

  inputs.forEach((input) => {
    const index = Array.from(inputs).indexOf(input);

    input.addEventListener("input", () => {
      const value = input.value;
      setSubmitMessage("");
      switch (index) {
        case 0:
          checkEmail(value, emailLabel);
          break;
        case 1:
          checkVerCode(value, codeLabel);
          break;
      }
    });
  });

  noWhiteSpaceInput();
}

function checkEmail(value, label) {
  if (!value.includes(".") || !value.includes("@")) {
    label.innerText = "Enter a valid email";
  } else {
    label.innerText = "";
  }
}

function checkVerCode(value, label) {
  if (value.length !== 6 || isNaN(Number(value))) {
    label.innerText = "Code must be 6 digits";
  } else {
    label.innerText = "";
  }
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

function redirectToAnotherPage(path) {
  window.location.href = path;
}

function saveEmailToLocalStorage(email) {
  localStorage.setItem("chutodoemail", JSON.stringify({ key: email }));
}

function savePasswordToLocalStorage(password) {
  localStorage.setItem("chutodopassword", JSON.stringify({ key: password }));
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

function getProFromLocalStorage() {
  const orgData = localStorage.getItem("chutodopro");
  if (orgData) {
    const parsedData = JSON.parse(orgData);
    return parsedData.key;
  } else {
    return null;
  }
}

async function getVerCode(email) {
  try {
    fetch(getVerCodeEndPoint, {
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

async function verifyEmail(email, code) {
  try {
    const response = await fetch(verifyEmailEndPoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, code: code }),
    });
    if (response.ok) {
      const status = await response.json();
      if (status.ok) {
        saveEmailToLocalStorage(email);
        redirectToAnotherPage(status.path);
      }
    }
  } catch (error) {
    console.log("Error", error);
  }
}

async function userExistsOnServer() {
  const emailToTest = getEmailFromLocalStorage();
  if (emailToTest !== null) {
    const users = await getUsers();
    if (users.includes(emailToTest)) {
      return true;
    }
  }
  return false;
}

async function getUsers() {
  try {
    const res = await fetch(getUsersEndPoint);
    const temp = await res.json();
    console.log("Temp: ", temp);
    return temp;
  } catch (error) {
    console.log("There was a problem fetching users");
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
        return { valid: true, path: status.path };
      }
    }
    return { valid: false, path: undefined };
  } catch (error) {
    console.log("Error", error);
  }
  return { valid: false, path: undefined };
}

async function getOrgsProjects(email, password, orgName, orgPassword) {
  try {
    const respone = await fetch(getOrgsProjectsEndPoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password, orgName: orgName, orgPassword: orgPassword }),
    });
    if (respone.ok) {
      const status = await respone.json();
      if (status.ok) {
        return true;
      }
    }
  } catch (error) {
    console.error("Error: ", error);
  }
}

async function getTasksFromServer(email, password, orgName, orgPassword, project) {
  try {
    const respone = await fetch(getTasksEndPoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password, orgName: orgName, orgPassword, proName: project }),
    });
    if (respone.ok) {
      const status = await respone.json();
      if (status.ok) {
        return true;
      }
    }
  } catch (error) {
    console.error("Error: ", error);
  }
}
