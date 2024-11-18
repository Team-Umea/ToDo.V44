const body = document.body;

const email = getEmailFromLocalStorage();
const password = getPasswordFromLocalStorage();
let passChangeCode;
let selectedOrganization;
let forms = [];
let submitMessages = [];

let inputs = [];
let labels = [];
let buttons = [];
let wrappers = [];
let uls = [];

// const IP = "https://todobackend-vuxr.onrender.com/";
const IP = "http://localhost:3000/";
const getOrgsEndPoint = IP + "getAllOrgs";
const getUsersOrgsEndPoint = IP + "usersOrgs";
const joinOrgEndPoint = IP + "joinOrg";
const leaveOrgEndPoint = IP + "leaveOrg";
const createOrganizationEndPoint = IP + "createOrg";
const deleteOrgEndPoint = IP + "deleteOrg";
const changeOrgPasswordEndPoint = IP + "changeOrgPassword";

function init() {
  createUsersOrgs();
  createJoinOrgForm();
  createNewOrgForm();
  inputEvents();
  formEvent();
  buttonEvents();
}

init();

function createJoinOrgForm() {
  const h1 = document.createElement("h1");
  const container = document.createElement("div");
  const orgForm = document.createElement("form");
  const header = document.createElement("p");
  const orgName = document.createElement("input");
  const cancelPassWordBtn = document.createElement("button");
  const organizations = document.createElement("ul");
  const btn = document.createElement("button");
  const formMessage = document.createElement("p");

  h1.innerText = `Welcome ${extractUser(email)} to organizations`;

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

  body.appendChild(h1);
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
  const toggle = document.createElement("img");
  const label = document.createElement("label");

  input.setAttribute("placeholder", placeholder);
  input.setAttribute("id", id);
  input.setAttribute("class", "passwordInput");
  input.setAttribute("type", "password");

  label.setAttribute("for", id);
  label.setAttribute("id", `${id}Label`);

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

async function createUsersOrgs() {
  const orgs = await getUsersOrgs();

  if (orgs && orgs.length > 0) {
    const orgsHeader = document.createElement("h2");
    const orgsContainer = document.createElement("div");
    const orgsUl = document.createElement("ul");

    orgsHeader.innerText = "Your organizations";
    orgsHeader.setAttribute("class", "orgsHeader");

    orgsContainer.setAttribute("class", "usersOrgsContainer");
    orgsUl.setAttribute("class", "usersOrgsUl");
    orgs.reverse().forEach((org) => {
      const organizationName = org.name;
      const organizationPassword = org.password;
      const organizationDate = org.date;
      const organizationAdmin = org.isAdmin ? "You" : extractUser(org.admin);
      const organizationMembers = org.members;

      const orgLi = document.createElement("li");
      const orgInfoContainer = document.createElement("div");
      const orgName = document.createElement("h3");
      orgInfoContainer.setAttribute("class", "orgInfoContainer");
      orgName.innerText = capitalize(organizationName);

      createIconContainer(orgInfoContainer, "../icons/calendar.svg", `${organizationName} created at ${organizationDate}`, `${organizationName} created at ${organizationDate}`, organizationDate, "Left");

      createIconContainer(orgInfoContainer, "../icons/person.svg", `${organizationAdmin} is ${organizationName} admin`, `${organizationAdmin} is ${organizationName} admin`, organizationAdmin, "Left");

      createIconContainer(orgInfoContainer, "../icons/group.svg", `${organizationName} has ${organizationMembers} members`, `${organizationName} has ${organizationMembers} members`, organizationMembers, "Right");

      orgInfoContainer.children[1].classList.add("centerIcon");

      const btnContainer = document.createElement("div");
      const selectBtn = document.createElement("button");
      const leaveBtn = document.createElement("button");
      const deleteBtn = document.createElement("button");
      const resetOrgPasswordBtn = document.createElement("button");

      btnContainer.setAttribute("class", "orgsUlBtnContainer");

      selectBtn.innerText = "Select";
      selectBtn.setAttribute("class", "btn btnGreen");
      usersOrgsButtonEvent(0, selectBtn, undefined, false, [organizationName, organizationPassword]);

      leaveBtn.innerText = "Leave";
      leaveBtn.setAttribute("class", "btn btnYellow");
      usersOrgsButtonEvent(1, leaveBtn, deleteBtn, true, [organizationName]);

      deleteBtn.innerText = "Delete";
      org.isAdmin ? deleteBtn.setAttribute("class", "btn btnRed") : deleteBtn.setAttribute("class", "btn btnRed hidden");
      usersOrgsButtonEvent(2, deleteBtn, leaveBtn, true, [organizationName]);

      resetOrgPasswordBtn.innerText = "Reset Password";
      org.isAdmin ? resetOrgPasswordBtn.setAttribute("class", "btn btnGrey") : resetOrgPasswordBtn.setAttribute("class", "btn btnGrey hidden");
      resetOrgPasswordBtn.addEventListener("click", () => {
        deleteBtn.innerText = "Delete";
        leaveBtn.innerText = "Leave";
        orgLi.lastElementChild.classList.remove("hidden");
      });

      btnContainer.appendChild(selectBtn);
      btnContainer.appendChild(leaveBtn);
      btnContainer.appendChild(deleteBtn);
      btnContainer.appendChild(resetOrgPasswordBtn);

      orgLi.appendChild(orgInfoContainer);
      orgLi.appendChild(orgName);
      orgLi.appendChild(btnContainer);
      createResetOrgPasswordForm(orgLi, org.name);
      orgsUl.appendChild(orgLi);
    });

    const leftBtn = document.createElement("button");
    const rightBtn = document.createElement("button");

    leftBtn.setAttribute("class", "carousel-button left");
    leftBtn.innerHTML = "&#10094;";

    rightBtn.setAttribute("class", "carousel-button right");
    rightBtn.innerHTML = "&#10095;";

    orgsContainer.appendChild(orgsUl);
    orgsContainer.appendChild(leftBtn);
    orgsContainer.appendChild(rightBtn);

    body.insertBefore(orgsHeader, body.children[2]);
    body.insertBefore(orgsContainer, body.children[3]);

    initOrgsCarousel(orgsUl, orgsUl.children, leftBtn, rightBtn);
  }
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

function initOrgsCarousel(carousel, items, nextButton, prevButton) {
  let currentIndex = 0;
  let visibleImagesCount = 1;

  function updateCarousel() {
    const width = items[0].clientWidth;
    carousel.style.transform = `translateX(${-currentIndex * width}px)`;
  }

  nextButton.addEventListener("click", () => {
    if (currentIndex < items.length - visibleImagesCount) {
      currentIndex += 1;
    }
    updateCarousel();
  });

  prevButton.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex -= 1;
    }
    updateCarousel();
  });
}

function usersOrgsButtonEvent(index, btn, linkedBtn, confirm, orgInfo) {
  btn.addEventListener("click", () => {
    const btnText = btn.innerText;
    switch (index) {
      case 0:
        saveOrgToLocalStorage(orgInfo[0]);
        saveOrgPasswordToLocalStorage(orgInfo[1]);
        setTimeout(() => {
          redirectToAnotherPage("projects.html");
        }, 100);
        break;
      case 1:
        if (confirm) {
          if (btnText === "Leave") {
            btn.innerText = "Confirm";
            linkedBtn.innerText = "Delete";
          } else if (btnText === "Confirm") {
            leaveOrganization(orgInfo[0]);
            btn.innerText = "Leave";
          }
        }
        break;
      case 2:
        if (confirm) {
          if (btnText === "Delete") {
            btn.innerText = "Confirm";
            linkedBtn.innerText = "Leave";
          } else if (btnText === "Confirm") {
            deleteOrganization(orgInfo[0]);
            btn.innerText = "Delete";
          }
        }
        break;
      case 3:
        break;
    }
  });
}

function createResetOrgPasswordForm(parent, orgName) {
  const container = document.createElement("div");
  const resetForm = document.createElement("form");
  const cancelBtn = document.createElement("button");
  const btn = document.createElement("button");
  const formMessage = document.createElement("p");

  container.setAttribute("class", "authContainer orgsUlPassContainer hidden");

  btn.innerText = "Reset Password";
  btn.setAttribute("type", "submit");
  btn.setAttribute("class", "submitBtn");

  cancelBtn.innerText = "Cancel";
  cancelBtn.setAttribute("type", "button");
  cancelBtn.setAttribute("class", "btn cancelBtn");

  formMessage.setAttribute("class", "submitMessage");

  const passwordID = `${orgName}orgPassword`;
  const confirmPasswordID = `${orgName}orgConfirmPassword`;

  createInputPasswordToggle(resetForm, passwordID, "Chose a password", false, true);
  createInputPasswordToggle(resetForm, confirmPasswordID, "Confirm password", false, true);

  const passwordInput = resetForm.querySelector(`#${passwordID}`);
  const confirmPasswordInput = resetForm.querySelector(`#${confirmPasswordID}`);

  const passwordLabel = resetForm.querySelector(`#${passwordID}Label`);
  const confirmPasswordLabel = resetForm.querySelector(`#${confirmPasswordID}Label`);

  cancelBtn.addEventListener("click", () => {
    passwordInput.value = "";
    confirmPasswordInput.value = "";
    passwordLabel.innerText = "";
    confirmPasswordLabel, (innerText = "");
    container.classList.add("hidden");
  });

  passwordInput.addEventListener("input", () => {
    formMessage.innerText = "";
    passwordInput.value = removeWhiteSpace(passwordInput.value);
    const orgPassword = passwordInput.value;
    checkPasswordLength(orgPassword, passwordLabel);
  });

  confirmPasswordInput.addEventListener("input", () => {
    formMessage.innerText = "";
    confirmPasswordInput.value = removeWhiteSpace(confirmPasswordInput.value);
    const orgPassword = passwordInput.value;
    const orgConfirmPassword = confirmPasswordInput.value;
    checkPasswordMatch(orgPassword, orgConfirmPassword, confirmPasswordLabel);
  });

  resetForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const orgPassword = passwordInput.value;
    const orgConfirmPassword = confirmPasswordInput.value;
    if (orgPassword.length > 7 && orgPassword === orgConfirmPassword) {
      changeOrganizationPassword(orgName, orgPassword, orgConfirmPassword);
    } else {
      formMessage.innerText = "Passwords must match and be atleast 8 characters";
    }
  });

  resetForm.appendChild(cancelBtn);
  resetForm.appendChild(btn);
  container.appendChild(resetForm);
  container.appendChild(formMessage);

  parent.appendChild(container);
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
            clearInputs();
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

function clearInputs() {
  inputs.forEach((input) => (input.value = ""));
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

function saveOrgToLocalStorage(name) {
  removeFromLocalStorage("chutodopro");
  localStorage.setItem("chutodoorg", JSON.stringify({ key: name }));
}

function saveOrgPasswordToLocalStorage(pass) {
  localStorage.setItem("chutodoorgpassword", JSON.stringify({ key: pass }));
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

async function getUsersOrgs() {
  try {
    const response = await fetch(getUsersOrgsEndPoint, {
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
        saveOrgToLocalStorage(status.password);
        saveOrgPasswordToLocalStorage(orgPassword);
        setTimeout(() => {
          redirectToAnotherPage(status.path);
        }, 100);
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
        saveOrgPasswordToLocalStorage(status.password);
        setTimeout(() => {
          redirectToAnotherPage(status.path);
        }, 100);
      }
    }
  } catch (error) {
    console.error("Error: ", error);
  }
}

async function leaveOrganization(name) {
  try {
    const response = await fetch(leaveOrgEndPoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password, orgName: name }),
    });
    if (response.ok) {
      const status = await response.json();
      if (status.ok) {
        const pro = "chutodopro";
        const org = "chutodoorg";
        removeFromLocalStorage(pro);
        removeFromLocalStorage(org);
        setTimeout(() => {
          reloadPage();
        }, 100);
      }
    }
  } catch (error) {
    console.error("Error: ", error);
  }
}

async function deleteOrganization(name) {
  try {
    const response = await fetch(deleteOrgEndPoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password, orgName: name }),
    });
    if (response.ok) {
      const status = await response.json();
      if (status.ok) {
        const pro = "chutodopro";
        const org = "chutodoorg";
        removeFromLocalStorage(pro);
        removeFromLocalStorage(org);
        setTimeout(() => {
          reloadPage();
        }, 100);
      }
    }
  } catch (error) {
    console.error("Error: ", error);
  }
}

async function changeOrganizationPassword(name, orgPassword, confirmOrgPassword) {
  try {
    const response = await fetch(changeOrgPasswordEndPoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password, orgName: name, orgPassword: orgPassword, confirmOrgPassword: confirmOrgPassword }),
    });
    if (response.ok) {
      const status = await response.json();
      if (status.ok) {
        saveOrgToLocalStorage(name);
        saveOrgPasswordToLocalStorage(orgPassword);
        setTimeout(() => {
          redirectToAnotherPage(status.path);
        }, 100);
      }
    }
  } catch (error) {
    console.error("Error: ", error);
  }
}
