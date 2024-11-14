const body = document.body;

const email = getEmailFromLocalStorage;

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

function init() {
  if (userExistsOnServer() === true) {
    redirectToAnotherPage("signIn.html");
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
  emailInput.setAttribute("placeholder", "Ange en mejladress");
  emailInput.setAttribute("id", emailID);

  emailLabel.setAttribute("for", emailID);

  codeInput.setAttribute("id", codeID);
  codeInput.setAttribute("placeholder", "Ange verifieringskoden som skickats till din mejl");
  codeInput.setAttribute("class", "hidden");

  codeLabel.setAttribute("for", codeID);

  emailSubmitBtn.innerText = "Gå vidare";
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
    if (buttonText === "Gå vidare") {
      showCodeEls();
      setBtnText("Verifiera mejl");
      getVerCode(email);
    } else if (buttonText === "Verifiera mejl") {
      verifyEmail(email, code);
      setTimeout(() => {
        setSubmitMessage("Koden stämmer inte");
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
    label.innerText = "Ange en giltig mejladress";
  } else {
    label.innerText = "";
  }
}

function checkVerCode(value, label) {
  if (value.length !== 6 || isNaN(Number(value))) {
    label.innerText = "Koden ska bestå av 6 siffor";
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
        redirectToAnotherPage(status.path);
      }
      // else {
      //   setSubmitMessage("Koden stämmer inte");
      // }
    }
  } catch (error) {
    console.log("Error", error);
  }
}

async function userExistsOnServer() {
  const emailToTest = getEmailFromLocalStorage();

  if (emailToTest !== null) {
    const users = await getUsers();
    if (Array.from(users).includes(emailToTest)) {
      return true;
    }
  }
  return false;
}

async function getUsers() {
  try {
    const res = await fetch(getUsersEndPoint);
    return (users = await res.json());
  } catch (error) {
    console.log("There was a problem fetching users");
  }
}

function removeWhiteSpace(str) {
  return str.replace(/\s+/g, "");
}

function redirectToAnotherPage(path) {
  window.location.href = path;
}

function saveEmailToLocalStorage(email) {
  clearLocalStorage();
  localStorage.setItem("email", JSON.stringify({ key: email }));
}

function getEmailFromLocalStorage() {
  const emailData = localStorage.getItem("email");
  if (emailData) {
    const parsedData = JSON.parse(emailData);
    return parsedData.key;
  } else {
    return null;
  }
}

function clearLocalStorage() {
  if (typeof Storage !== "undefined") {
    localStorage.clear();
  }
}
