const API_URL = "http://localhost:8000";
const wrapper = document.querySelector(".wrapper");
const form = document.querySelector(".form");
const createBtn = document.querySelector(".create-btn");
const fnameInput = document.querySelector(".fname");
const usernameInput = document.querySelector(".username");
const passwordInput = document.querySelector(".password");
const imageInput = document.querySelector(".image");

const DEFAULT_IMAGE_URL =
  "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/271deea8-e28c-41a3-aaf5-2913f5f48be6/de7834s-6515bd40-8b2c-4dc6-a843-5ac1a95a8b55.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzI3MWRlZWE4LWUyOGMtNDFhMy1hYWY1LTI5MTNmNWY0OGJlNlwvZGU3ODM0cy02NTE1YmQ0MC04YjJjLTRkYzYtYTg0My01YWMxYTk1YThiNTUuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.BopkDn1ptIwbmcKHdAOlYHyAOOACXW0Zfgbs0-6BY-E";

async function fetchData(url) {
  const response = await fetch(`${url}/users`);
  response
    .json()
    .then((data) => createCard(data))
    .catch((err) => console.log(err));
}

fetchData(API_URL);

async function createUser(api) {
  const response = await fetch(`${api}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fname: fnameInput.value,
      username: usernameInput.value,
      password: passwordInput.value,
      image: imageInput.value.trim() || DEFAULT_IMAGE_URL,
    }),
  });
  response
    .json()
    .then(() => fetchData(API_URL))
    .catch((err) => console.log(err));
}

async function updateUser(id) {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fname: fnameInput.value,
      username: usernameInput.value,
      password: passwordInput.value,
      image: imageInput.value.trim() || DEFAULT_IMAGE_URL,
    }),
  });
  response
    .json()
    .then(() => fetchData(API_URL))
    .catch((err) => console.log(err));
}

function deleteUser(id) {
  fetch(`${API_URL}/users/${id}`, {
    method: "DELETE",
  })
    .then(() => fetchData(API_URL))
    .catch((err) => console.log(err));
}

function createCard(data) {
  while (wrapper.firstChild) {
    wrapper.firstChild.remove();
  }
  data.payload?.forEach((user) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.id = user.id;
    card.innerHTML = `
    <img src=${user.image} alt="">
    <div class="card__info">
    <h1>${user.fname}</h1>
    <h3>${user.username}</h3>
    <div class="card__btns">
    <button class="edit-btn">Edit</button>
    <button class="delete-btn">Delete</button>
    </div>
    </div>
    `;
    wrapper.appendChild(card);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (createBtn.textContent === "Add User") {
    createUser(API_URL);
  } else {
    const id = createBtn.dataset.id;
    updateUser(id);
    createBtn.textContent = "Add User";
  }
  fnameInput.value = "";
  usernameInput.value = "";
  passwordInput.value = "";
  imageInput.value = "";
});

wrapper.addEventListener("click", (e) => {
  if (e.target.className === "delete-btn") {
    const id = e.target.closest(".card").dataset.id;
    deleteUser(id);
  } else if (e.target.className === "edit-btn") {
    const card = e.target.closest(".card");
    const id = card.dataset.id;
    const fname = card.querySelector("h1").textContent;
    const username = card.querySelector("h3").textContent;
    const image = card.querySelector("img").src; // Use .src to get the image URL
    fnameInput.value = fname;
    usernameInput.value = username;
    imageInput.value = image;
    createBtn.textContent = "Update User";
    createBtn.dataset.id = id;
  }
});
