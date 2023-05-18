"use strict";
import * as vars from "./global.js";
const { localID, BUDGET_KEY, USERS_KEY } = vars;
const spinner = document.querySelector("#spinner");
const goBackBtn = document.querySelector("#back-btn");
const userBio = document.querySelector("#user-bio");

goBackBtn.addEventListener("click", () => {
  location.href = "main.html";
});

window.addEventListener("keydown", function (e) {
  if (e.code === "Space") {
    e.preventDefault();
  }
});

window.addEventListener("load", () => {
  spinner.classList.remove("hide");
  async function getUsers() {
    try {
      const response = await fetch(USERS_KEY);
      const data = await response.json();
      const cur = data.find((val) => val.id === localID);
      const date = new Date(cur.createdAt * 1000).toLocaleDateString();
      const markup = `
      <h3 class="text-center">Created At <br/> ${date}</h3>
    <img src="images/user.png" alt="User Logo" />
    <h1 id="user-name"
    class="position-relative me-3">
    ${cur.name}
      <img
        class="position-absolute top-0 start-100 ms-3"
        src="images/edit-icon.png"
        alt="Edit Icon"
        width="25"
        height="25"
        id="edit-icon"
        title="Edit"
        title="Edit"
      />
      <img
      class="position-absolute top-0 start-100 ms-3 hide"
      src="images/save-icon.png"
      alt="Edit Icon"
      width="25"
      height="25"
      id="save-icon"
      title="Save"
    />
    </h1>
  </span>
  <h5 class="text-danger text-uppercase" id="del">Delete your Account</h5>
    `;
      spinner.classList.add("hide");
      userBio.insertAdjacentHTML("afterbegin", markup);
      const delBtn = document.querySelector("#del");
      const editBtn = document.querySelector("#edit-icon");
      const saveBtn = document.querySelector("#save-icon");
      const userName = document.querySelector("#user-name");
      //
      editBtn.addEventListener("click", () => {
        userName.contentEditable = true;
        saveBtn.classList.remove("hide");
        editBtn.classList.add("hide");
        userName.classList.add("editing");
      });
      saveBtn.addEventListener("click", () => {
        async function checkName() {
          const response = await fetch(USERS_KEY);
          const data = await response.json();
          if (
            data.find(
              (u) => u.name === userName.textContent.replaceAll("\n", "").trim()
            )
          ) {
            alert(
              "Već postoji korisnik sa ovim imenom.\nMolimo Vas pokušajte drugo ime."
            );
            return;
          } else {
            userName.contentEditable = false;
            saveBtn.classList.add("hide");
            editBtn.classList.remove("hide");
            userName.classList.remove("editing");
            //
            async function editName() {
              const response = await fetch(`${USERS_KEY}/${localID}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  name: userName.textContent.replaceAll("\n", "").trim(),
                }),
              });
            }
            editName();
          }
        }
        checkName();
      });
      delBtn.addEventListener("click", () => {
        const promptValue = prompt(
          'Da li ste sigurni da želite obrisati nalog?\nUkoliko jeste, molimo Vas da u polje unesete "DA",\n i Vaš nalog će biti obrisan.'
        );
        if (promptValue !== "DA") return;
        // Brisanje korisnika iz USERS i BUDGET tabele
        async function delUser() {
          const response = await Promise.all([
            fetch(`${USERS_KEY}/${localID}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            }),
            fetch(`${BUDGET_KEY}/${localID}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            }),
          ]);
          localStorage.removeItem("id");
          location.href = "index.html";
        }
        delUser();
      });
    } catch (e) {
      console.log(e);
    }
  }
  getUsers();
});
