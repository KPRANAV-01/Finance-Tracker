let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

const list = document.getElementById("transaction-list");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expenses");
const balanceEl = document.getElementById("balance");
const form = document.getElementById("transaction-form");
const desc = document.getElementById("desc");
const amount = document.getElementById("amount");
const chartCanvas = document.getElementById("chart");
let chart;

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = desc.value;
  const amt = +amount.value;

  const transaction = {
    id: Date.now(),
    text,
    amount: amt
  };

  transactions.push(transaction);
  updateLocal();
  init();
  desc.value = "";
  amount.value = "";
});

function updateLocal() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateLocal();
  init();
}

function init() {
  list.innerHTML = "";
  let income = 0, expense = 0;

  transactions.forEach(tx => {
    const sign = tx.amount < 0 ? "-" : "+";
    const li = document.createElement("li");
    li.className = tx.amount < 0 ? "expense" : "income";
    li.innerHTML = `${tx.text} <span>${sign}₹${Math.abs(tx.amount)}</span>
    <button onclick="deleteTransaction(${tx.id})">❌</button>`;
    list.appendChild(li);

    if (tx.amount < 0) expense += tx.amount;
    else income += tx.amount;
  });

  incomeEl.innerText = `₹${income}`;
  expenseEl.innerText = `₹${Math.abs(expense)}`;
  balanceEl.innerText = `₹${income + expense}`;

  drawChart(income, Math.abs(expense));
}

function drawChart(income, expense) {
  if (chart) chart.destroy();
  chart = new Chart(chartCanvas, {
    type: 'doughnut',
    data: {
      labels: ["Income", "Expenses"],
      datasets: [{
        data: [income, expense],
        backgroundColor: ['green', 'red']
      }]
    }
  });
}

// Dark Mode Toggle
document.getElementById("toggle-dark").onclick = () => {
  document.body.classList.toggle("dark");
};

init();
