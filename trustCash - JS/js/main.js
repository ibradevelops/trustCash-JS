"use strict";
import * as vars from "./global.js";
const { localID, BUDGET_KEY, USERS_KEY } = vars;
const mainTitle = document.querySelector("#main-title");
const spinner = document.querySelector("#spinner");
const spinnerSecondary = document.querySelector("#spinner-seconday");
const logoutBtn = document.querySelector("#logout-btn");
//
mainTitle.classList.add("hide");
logoutBtn.addEventListener("click", () => {
  location.href = "index.html";
  localStorage.removeItem("id");
});
//
const calcResults = document.querySelector("article");
const input = document.querySelector('input[type="number"]');
const calcBtn = document.querySelector("#calc-btn");

async function getTheUsersFromLogin() {
  try {
    spinner.classList.remove("hide");
    // GET
    const response = await fetch(`${USERS_KEY}/${localID}`);
    const data = await response.json();
    if (data.length === 0) return;
    mainTitle.classList.remove("hide");
    spinner.classList.add("hide");
    mainTitle.textContent = `👋 Welcome Back ${data?.name || "❓"}`;
    //
    calcBtn.addEventListener("click", () => {
      const inputValue = Number(input.value);
      if (!inputValue) return;
      if (inputValue <= 0) {
        alert("Salary Must Be Higher Than 0. 💸");
        input.value = "";
        return;
      }
      const calculatingDeductions = function (parametar) {
        return `${((inputValue * parametar) / 100).toFixed(2)}`;
      };
      const calculatingNetSalary = function () {
        let sum =
          inputValue -
          (inputValue * 10 +
            inputValue * 12 +
            inputValue * 18.5 +
            inputValue * 0.5) /
            100;
        return sum.toFixed(2);
      };
      //
      calcResults.innerHTML = "";
      const markup = `
      <table class="table">
      <tr>
        <th>Gross Salary</th>
        <td>${inputValue} BAM</td>
      </tr>
      <tr>
        <th>Tax 10%</th>
        <td>${calculatingDeductions(10)} BAM</td>
      </tr>
      <tr>
        <th>Health Insurance 12%</th>
        <td>${calculatingDeductions(12)} BAM</td>
      </tr>
      <tr>
        <th>Pension Insurance 18.5%</th>
        <td>${calculatingDeductions(18.5)} BAM</td>
      </tr>
      <tr>
        <th>Employment Contribution 0.5%</th>
        <td>${calculatingDeductions(0.5)} BAM</td>
      </tr>
      <tr>
        <th>Net Salary</th>
        <td>${calculatingNetSalary()} BAM</td>
      </tr>
    </table>
      `;
      calcResults.insertAdjacentHTML("afterbegin", markup);
      input.value = "";
      const serverBody = {
        grossSalary: inputValue,
        tax: calculatingDeductions(10),
        healthInsurance: calculatingDeductions(12),
        pensionInsurance: calculatingDeductions(18.5),
        employmentContribution: calculatingDeductions(0.5),
        netSalary: calculatingNetSalary(),
      };
      //
      async function sendingMovements() {
        try {
          const response = await fetch(`${BUDGET_KEY}/${localID}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...serverBody }),
          });
        } catch (e) {
          console.log(e);
        }
      }
      sendingMovements();
    });
  } catch (e) {
    console.log(e);
  }
}
getTheUsersFromLogin();

async function displayBudget() {
  try {
    spinnerSecondary.classList.remove("hide");
    const response = await fetch(`${BUDGET_KEY}/${localID}`);
    const data = await response.json();
    if (data.grossSalary === 0) {
      calcResults.innerHTML = "";
      return;
    }
    //prettier-ignore
    const {grossSalary,tax,healthInsurance,pensionInsurance,employmentContribution,netSalary} = data;
    const markup = `
      <table class="table">
      <tr>
        <th>Gross Salary</th>
        <td>${grossSalary} BAM</td>
      </tr>
      <tr>
        <th>Tax 10%</th>
        <td>${tax} BAM</td>
      </tr>
      <tr>
        <th>Health Insurance 12%</th>
        <td>${healthInsurance} BAM</td>
      </tr>
      <tr>
        <th>Pension Insurance 18.5%</th>
        <td>${pensionInsurance} BAM</td>
      </tr>
      <tr>
        <th>Employment Contribution 0.5%</th>
        <td>${employmentContribution} BAM</td>
      </tr>
      <tr>
        <th>Net Salary</th>
        <td>${netSalary} BAM</td>
      </tr>
    </table>
      `;
    spinnerSecondary.classList.add("hide");
    calcResults.insertAdjacentHTML("afterbegin", markup);
  } catch (e) {
    console.log(e);
  }
}
displayBudget();
