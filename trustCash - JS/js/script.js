"use strict";
import * as vars from "./global.js";
const { BUDGET_KEY, USERS_KEY } = vars;
const spinner = document.querySelector("#spinner");
const loginBtn = document.querySelector("#login-btn");
const registerBtn = document.querySelector("#register-btn");
const inputName = document.querySelector("#input-name");
const inputPassword = document.querySelector("#input-password");
// POST -  Registracija korisnika na register dugme
registerBtn.addEventListener("click", function () {
  if (!inputName.value || !inputPassword.value) {
    alert("Molimo vas unesite valjane podatke. ❌");
    return;
  }
  async function sendToUsers() {
    try {
      // GET - Dobavljanje korisnika iz Users Baze radi provjere identicnosti
      spinner.classList.remove("hide");
      const responseGet = await fetch(USERS_KEY);
      const data = await responseGet.json();
      const sameUser = data.find((u) => u.name === inputName.value);
      if (sameUser) {
        spinner.classList.add("hide");
        clearInputs();
        alert(
          "Već postoji korisnik sa istim imenom.\nMolimo Vas unesite drugo ime. 🙂"
        );
        return;
      }
      // POST - Slanje Korisnika u Users Bazu
      const responsePost = await fetch(USERS_KEY, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: inputName.value,
          password: inputPassword.value,
        }),
      });
      const serverBody = {
        grossSalary: 0,
        tax: 0,
        healthInsurance: 0,
        pensionInsurance: 0,
        employmentContribution: 0,
        netSalary: 0,
      };
      // POST-Slanje korisnika u Budget bazu
      const responseBudget = await fetch(BUDGET_KEY, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...serverBody }),
      });
      spinner.classList.add("hide");
      alert("Registracija uspješna. ✔️");
      clearInputs();
    } catch (e) {
      console.log(e);
    }
  }
  sendToUsers();
});

// Loginovanje korisnika
loginBtn.addEventListener("click", function () {
  if (!inputName.value || !inputPassword.value) {
    alert("Molimo vas unesite valjane podatke ❌");
    return;
  }
  spinner.classList.remove("hide");
  //
  // GET, pozivanje servera sa korisnicima, radi provjere imena
  async function getTheUsers() {
    try {
      const responseGet = await fetch(USERS_KEY);
      const data = await responseGet.json();
      spinner.classList.add("hide");
      //
      if (
        data.find(
          (u) =>
            u.name === inputName.value && u.password !== inputPassword.value
        )
      ) {
        clearInputs();
        alert("Lozinka neispravna 🔑");
        return;
      }
      //
      const user = data.find(
        (u) => u.name === inputName.value && u.password === inputPassword.value
      );
      if (!user) {
        clearInputs();
        alert(
          "Korisnik ne postoji. 👤\nUkoliko niste registrovani, molimo Vas da to učinite."
        );
        return;
      }
      const { id } = user;
      localStorage.setItem("id", JSON.stringify(id));
      location.href = "main.html";
      clearInputs();
    } catch (e) {
      console.log(e);
    }
  }
  getTheUsers();
});

function clearInputs() {
  [inputName, inputPassword].map((input) => {
    input.value = "";
  });
}

[inputPassword, inputName].map((input) =>
  input.addEventListener("keydown", function (e) {
    if (e.code === "Space") {
      e.preventDefault();
    }
  })
);
