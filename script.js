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
    id: generateId(), // Generate unique ID
    description,
    amount, // Validated and parsed
    category,
    date,
  };

  addExpense(newExpense); // Add the validated expense to the array


};

// Event listener for form submission
enterTransactionButton.addEventListener('click', handleFormSubmit);

// Function to add an expense to the array and render the table
const addExpense = (expense) => {
  expenses.push(expense); // Add to the expense list
  renderExpenses(); // Update the table with the new expense
};

// Function to render the expense table
const renderExpenses = () => {
  const tableBody = document.getElementById('expenseTable').querySelector('tbody');
  tableBody.innerHTML = ''; // Clear existing content

  expenses.forEach((expense) => {
      const row = document.createElement('tr');

    row.innerHTML = `
      <td>${expense.description}</td>
      <td>${Number(expense.amount)}</td> <!-- ToFixed ensures two decimal places -->
      <td>${expense.category}</td>
      <td>${expense.date}</td>
      <td>${expense.id}</td>
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




const deleteExpense = (expenseId) => {
  const confirmation = confirm("Are you sure you want to delete this expense?");
  if (confirmation) {
    expenses = expenses.filter((expense) => expense.id !== expenseId);
    renderExpenses();
  }
};




