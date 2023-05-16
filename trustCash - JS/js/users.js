"use strict";
import * as vars from "./global.js";
const { localID, USERS_KEY } = vars;
const body = document.querySelector("body");
const spinner = document.querySelector("#spinner");
const backBtn = document.querySelector("#back");
backBtn.addEventListener("click", () => {
  location.href = "main.html";
});
//
window.addEventListener("load", function () {
  spinner.classList.remove("hide");
  async function getUsers() {
    const response = await fetch(USERS_KEY);
    const data = await response.json();
    data.forEach((user) => {
      const markup = `
      <div class="d-flex align-items-center gap-3 mt-5 mb-5 ">
      <img src="images/user.png" class="border border-secondary p-2" width="50" height="50" />
      <h3>${user.name} ${user.id == localID ? "(You)" : ""}</h3>
    </div>
      `;
      body.insertAdjacentHTML("afterbegin", markup);
    });
    spinner.classList.add("hide");
  }
  getUsers();
});
