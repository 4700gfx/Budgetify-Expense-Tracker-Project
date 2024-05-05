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

// Function to handle form submission with validation
const handleFormSubmit = (event) => {
  event.preventDefault(); // Prevent the default form submission behavior
  
  // Get the input values from the form
  const descriptionInput = document.getElementById('description').value;
  const amountInput = document.getElementById('amount').value;
  const categoryInput = document.getElementById('category').value;
  const dateInput = document.getElementById('date').value;

  // Validation checks
  if (!descriptionInput.trim()) {
    alert("Please enter a description for the expense."); // Alert if no description
    return; // Exit the function
  }

  if (!amountInput.trim() || isNaN(parseFloat(amountInput))) {
    alert("Please enter a valid amount for the expense."); // Alert if no valid amount
    return; // Exit the function
  }

  if (!categoryInput.trim()) {
    alert("Please enter a category for the expense."); // Alert if no category
    return; // Exit the function
  }

  if (!dateInput.trim()) {
    alert("Please enter a date for the expense."); // Alert if no date
    return; // Exit the function
  }

  // If all validations pass, create the new expense
  const description = descriptionInput.trim(); // Ensure non-empty description
  const amount = parseFloat(amountInput); // Convert to a float
  const category = categoryInput.trim(); // Ensure non-empty category
  const date = dateInput; // Ensure non-empty date

  const newExpense = {
    id: generateId(), // Assuming a function to generate unique IDs
    description,
    amount,
    category,
    date,
  };

  addExpense(newExpense); // Add the expense to the list
  event.target.reset(); // Clear the form fields after successful submission
};

// Add the event listener to the form
document.getElementById('expenseForm').addEventListener('submit', handleFormSubmit);

// Function to add an expense to the array and render the updated table
const addExpense = (expense) => {
  expenses.push(expense); // Add to the expense array
  renderExpenses(); // Re-render the table
};

// Function to render expenses in the table
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
addTransactionButton.addEventListener('click', function (){
  modalWindow.style.display = "none";
  overlayWindow.style.display = "none";
} );
closeButton.addEventListener('click', closeModalWindow);









// document.getElementById('expenseForm').addEventListener('submit', (e) => {
//   e.preventDefault(); // Prevent default form submission

//   const description = document.getElementById('description').value;
//   const amount = document.getElementById('amount').value;
//   const category = document.getElementById('category').value;
//   const date = document.getElementById('date').value;

//   if (amount  === undefined){
//     alert("Please enter an Expense")
//   } else if (description.value == undefined) {
//     description.value = "New Expense"
//   }

//   addExpense(description, amount, category, date); // Add the expense

//   e.target.reset(); // Clear the form

// });