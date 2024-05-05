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

//Re-Add Function Here:
// Function to handle form submission with validation
// Function to handle form submission with validation



const validationCheck = function(description, amountInput, category, date){
    // Validation checks with early return on failure
    if (typeof description == "Number" || description !== "string") { // Ensure description is not empty
      alert("Please enter a description for the expense.");
      return; // Exit early if invalid
    }
  
    // Parse the amount and ensure it's a valid number
    const amount = parseFloat(amountInput); // Convert to a float
    if (isNaN(amount)) { // Check for valid number
      alert("Please enter a valid number for the amount.");
      deleteExpense();
      return; // Exit early
    }
  
    if (!category) { // Ensure category is not empty
      alert("Please enter a category for the expense.");
      deleteExpense();
      return; // Exit early
    }
  
    if (!date) { // Ensure date is not empty
      alert("Please enter a valid date for the expense.");
      deleteExpense();
      return; // Exit early
    }
}


const handleFormSubmit = (event) => {
  event.preventDefault(); // Prevent default form behavior (like page reload)

  // Get the form input values by ID
  const description = document.getElementById('description').value.trim();
  const amountInput = document.getElementById('amount').value.trim(); // Use trim to remove spaces
  const category = document.getElementById('category').value.trim();
  const date = document.getElementById('date').value; // Retrieve the date as a string
  
  validationCheck(description, amountInput, category, date); //

  // If all validations pass, create a new expense object
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

enterTransactionButton.addEventListener('click', addExpense);
addTransactionButton.addEventListener('click', function (){
  modalWindow.style.display = "none";
  overlayWindow.style.display = "none";
} );
closeButton.addEventListener('click', closeModalWindow);




const deleteExpense = (expenseId) => {
  const confirmation = confirm("Are you sure you want to delete this expense?");
  if (confirmation) {
    expenses = expenses.filter((expense) => expense.id !== expenseId);
    renderExpenses();
  }
};




