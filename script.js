//Variables & Elements
let modalWindow = document.getElementById("modal-window");
let overlayWindow = document.getElementById("overlay-window");

let closeButton = document.getElementsByClassName("close")[0];
let addTransactionButton = document.getElementById("add-transaction");
let enterTransactionButton = document.getElementById("enter-transaction");
let deleteButton = document.getElementById("delete-button");
let expenses = [];
let savings = [];

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
  // Create a new expense object early in the function
  const newExpense = {
    id: generateId(), // Generate a unique ID
    description,
    amount: parseFloat(amount), // Ensure the amount is parsed to a float
    category,
    date,
  };

  // Validate the description to avoid invalid data
  if (description === '[object MouseEvent]' || !description) {
    console.error("Invalid description: Please provide a valid description.");
    return; // Exit early if invalid
  }


  // Validate the amount to ensure it's a valid number
  if (isNaN(newExpense.amount)) {
    console.error("Invalid amount: Please provide a valid number.");
    return; // Exit early if invalid
  }

  // Validate category
  if (!category.trim()) {
    console.error("Invalid category: Please provide a valid category.");
    return; // Exit early
  }

  // Validate date
  if (!date.trim()) {
    console.error("Invalid date: Please provide a valid date.");
    return; // Exit early
  }

  

  // If all validations pass, add the new expense to the array and re-render the table
  expenses.push(newExpense); // Add to the expenses array
  renderExpenses(); // Re-render the table to reflect the new addition
};


const renderExpenses = () => {
  const tableBody = document.getElementById('expenseTable').querySelector('tbody');
  tableBody.innerHTML = ''; // Clear existing content

  expenses.forEach((expense) => {
      const row = document.createElement('tr');

      row.innerHTML = `
          <td>${expense.description}</td>
          <td>$${expense.amount.toFixed(2)}</td>
          <td>${expense.category}</td>
          <td>${expense.date}</td>
          <td>${expense.id}</td>
          <td><button id="delete-button" onclick="deleteExpense('${expense.id}')">Delete</button></td>
      `;

      tableBody.appendChild(row);
  });
};


const deleteExpense = (expenseId) => {
  expenses = expenses.filter((expense) => expense.id !== expenseId); // Remove the expense with the given ID
  renderExpenses(); // Re-render the table to reflect changes
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

addTransactionButton.addEventListener('click', function(e) {
  modalWindow.style.display = "flex";
  overlayWindow.style.display = "block";
});

deleteButton.addEventListener('click', deleteExpense);