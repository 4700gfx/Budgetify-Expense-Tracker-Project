//Variables & Elements
let modalWindow = document.getElementById("modal-window");
let overlayWindow = document.getElementById("overlay-window");

let closeButton = document.getElementsByClassName("close")[0];
let addTransactionButton = document.getElementById("add-transaction");
let enterTransactionButton = document.getElementById("enter-transaction");

let expenses = [];

//Transactions Functions 

const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

const closeModalWindow = () => {
  if (expenses.length === 0) {
    alert("Please enter an Expense")
  } else{
    modalWindow.style.display = "none";
    overlayWindow.style.display = "none";
  }

}


const addExpense = (description, amount, category, date) => {
  const newExpense = {
      id: generateId(),
      description,
      amount: parseFloat(amount),
      category,
      date,
  };

  expenses.push(newExpense);
  renderExpenses(); // Re-render the table
};

const renderExpenses = () => {
  const tableBody = document.getElementById('expenseTable').querySelector('tbody');
  tableBody.innerHTML = ''; // Clear existing content

  expenses.forEach((expense) => {
      const row = document.createElement('tr');

      row.innerHTML = `
          <td>${expense.description}</td>
          <td>${expense.amount.toFixed(2)}</td>
          <td>${expense.category}</td>
          <td>${expense.date}</td>
          <td><button onclick="deleteExpense('${expense.id}')">Delete</button></td>
      `;

      tableBody.appendChild(row);
  });
};


//EVent Handlers for Transaction
document.getElementById('expenseForm').addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent default form submission

  const description = document.getElementById('description').value;
  const amount = document.getElementById('amount').value;
  const category = document.getElementById('category').value;
  const date = document.getElementById('date').value;

  addExpense(description, amount, category, date); // Add the expense

  e.target.reset(); // Clear the form

});

enterTransactionButton.addEventListener('click', addExpense);

closeButton.addEventListener('click', closeModalWindow);