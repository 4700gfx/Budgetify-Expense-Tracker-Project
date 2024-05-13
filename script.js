//Variables & Elements

//Main Windows
let modalWindow = document.getElementById("modal-window");
let overlayWindow = document.getElementById("overlay-window");

//Dashboard Elements
let expectedBudget = document.getElementById("expected-budget");
let currentBudget = document.getElementById("current-budget");

//Button Elements 
let closeButton = document.getElementsByClassName("close")[0];
let addTransactionButton = document.getElementById("add-transaction");
let enterTransactionButton = document.getElementById("enter-transaction");
let deleteButton = document.getElementById("delete-button");

//Intial Arrays and Objects 
let expenses = [];
let savings = [];
let totalBudget = 0;
let totalCurrentBudgetAmount = 0;

const categoryMap = {};


//Transactions Functions 

//Close Window Function
const closeModalWindow = () => {
  if (expenses.length === 0) {
    alert("Please enter an Expense")
  } else{
    modalWindow.style.display = "none";
    overlayWindow.style.display = "none";
  }

}




//Function to Update Total Savings 
const updateTotals = () => {
  const categorySelect = document.getElementById('category');
  const selectedOption = categorySelect.options[categorySelect.selectedIndex];
  const categoryText = selectedOption.textContent.trim(); // Get the text of the selected option

  // Find the corresponding total element based on the selected category text
  let totalElement = null;
  let categoriesToUpdate = []; // Array to store categories for combined totals
  if (categoryText === "Subscriptions" || categoryText === "Bills") {
    totalElement = document.getElementById("total-expenses");
    categoriesToUpdate = ["Subscriptions", "Bills"];
  } else if (categoryText === "ACH/Direct Deposit" || categoryText === "Savings") {
    totalElement = document.getElementById("total-savings");
    categoriesToUpdate = ["ACH/Direct Deposit", "Savings"];
  } else {
    console.error(`UI element for category ${categoryText} not found.`);
    return; // Exit the function if category element is not found
  }

  // Get the total for the selected categories from expenses array
  let total = 0;
  expenses.forEach(expense => {
    if (categoriesToUpdate.includes(expense.category)) {
      total += parseFloat(expense.amount);
    }
  });

  // Update the total element with the formatted updated total amount
  totalElement.textContent = `$ ${total.toFixed(2)}`;
};



//ID Generator Function
const generateId = () => '_' + Math.random().toString(36).substr(2, 9);




//Function to Add Expeneses to Arrays and Objects
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
  expenses.push(newExpense);

  // Update the categoryMap with the new expense
  if (categoryMap[category]) {
    categoryMap[category].amounts.push(newExpense.amount); // Add the amount
    categoryMap[category].total += newExpense.amount; // Update the total
  } else {
    // Create a new category entry if it doesn't exist
    categoryMap[category] = {
      amounts: [newExpense.amount], // Create an array with the initial amount
      total: newExpense.amount,     // Set the initial total
    };
  }

  renderExpenses(); // Re-render the table
  updateTotals();  // Update the category totals in the UI
};


// Function to Render the Expenses on The Table and Display Categories
const renderExpenses = (filteredExpenses = expenses) => {
  const tableBody = document.getElementById('expenseTable').querySelector('tbody');
  tableBody.innerHTML = ''; // Clear existing content

  filteredExpenses.forEach((expense) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${expense.description}</td>
      <td>$${expense.amount.toFixed(2)}</td>
      <td>${expense.category}</td>
      <td>${expense.date}</td>
      <td>${expense.id}</td>
      <td><button onclick="deleteExpense('${expense.id}')">Delete</button></td> <!-- Delete button -->
    `;

    tableBody.appendChild(row); // Add the row to the table
  });
};




//Function to Delete an Expense
const deleteExpense = (expenseId) => {
  // Find the expense to delete
  const expenseIndex = expenses.findIndex((expense) => expense.id === expenseId);

  if (expenseIndex !== -1) {
    const expenseToDelete = expenses[expenseIndex];
    const category = expenseToDelete.category;
    const amount = expenseToDelete.amount;

    // Remove the expense from the main expenses array
    expenses.splice(expenseIndex, 1);

    // Update the corresponding category in categoryMap
    if (categoryMap[category]) {
      const amountIndex = categoryMap[category].amounts.indexOf(amount);
      if (amountIndex !== -1) {
        categoryMap[category].amounts.splice(amountIndex, 1); // Remove the specific amount
        categoryMap[category].total -= amount; // Adjust the total
      }
    }

    // Update the total amount in the UI
    if (category === "ACH/Deposit" || category === "Savings") {
      const totalSavingsElement = document.getElementById("total-savings");
      totalSavingsElement.textContent = `$ ${(parseFloat(totalSavingsElement.textContent.replace("$", "")) - amount).toFixed(2)}`;
    } else if (category === "Bills" || category === "Subscriptions") {
      const totalExpensesElement = document.getElementById("total-expenses");
      totalExpensesElement.textContent = `$ ${(parseFloat(totalExpensesElement.textContent.replace("$", "")) - amount).toFixed(2)}`;
    }

    renderExpenses(); // Re-render the table
    updateTotals();  // Update the category totals in the UI
  } else {
    console.error("Expense not found. Cannot delete.");
  }
};


// Function to get Grand Total Amounts from the Category Map
const getGrandTotal = () => {
  let grandTotal = 0; // Initialize the grand total

  // Loop through all keys in the categoryMap
  for (const category in categoryMap) {
    if (categoryMap.hasOwnProperty(category)) { // Ensure it's a valid key
      // Get the array of amounts for the current category
      const amounts = categoryMap[category];

      // Calculate the total for this category
      const categoryTotal = amounts.reduce((sum, amount) => sum + amount, 0);

      // Add the category total to the grand total
      grandTotal += categoryTotal;
    }
  }

  return grandTotal; // Return the grand total
};


//Event Handlers 

//Intial Input Form Handler
document.getElementById('expenseForm').addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent default form submission

  const description = document.getElementById('description').value;
  const amount = document.getElementById('amount').value;
  const categorySelect = document.getElementById('category');
  const category = categorySelect.options[categorySelect.selectedIndex].textContent.trim();
  const date = document.getElementById('date').value;

  addExpense(description, amount, category, date); // Add the expense

  e.target.reset(); // Clear the form

});


// Event Handlers for the Buttons Events 
enterTransactionButton.addEventListener('click', addExpense);

closeButton.addEventListener('click', closeModalWindow);

addTransactionButton.addEventListener('click', function(e) {
  modalWindow.style.display = "flex";
  overlayWindow.style.display = "block";
});

deleteButton.addEventListener('click', deleteExpense);

