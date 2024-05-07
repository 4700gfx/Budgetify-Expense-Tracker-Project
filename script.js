//Variables & Elements

//Main Windows
let modalWindow = document.getElementById("modal-window");
let overlayWindow = document.getElementById("overlay-window");

//Dashboard Elements
let expectedBudget = document.getElementById("expected-budget");
let currentBudget = document.getElementById("current-budget");
let totalBalance = document.getElementById("total-balance");

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

//Function to Update Total Savings 
//ADD FUNCTIONALITY FOR ALL CATEGORIES
const updateTotals = function() {
  // Ensure categoryMap.Savings and its total property exist
  if (categoryMap.Savings && typeof categoryMap.Savings.total === 'number') {
    const totalSavingsElement = document.getElementById('total-savings'); // Get the span by ID
    const formattedTotal = `$ ${categoryMap.Savings.total.toFixed(2)}`; // Format with dollar sign and two decimal places

    totalSavingsElement.textContent = formattedTotal; // Update the text content of the span
  } else {
    console.error("Savings total is undefined or not a number."); // Log an error if Savings doesn't exist
  }
};


//ID Generator Function
const generateId = () => '_' + Math.random().toString(36).substr(2, 9);


//Close Window Function
const closeModalWindow = () => {
  if (expenses.length === 0) {
    alert("Please enter an Expense")
  } else{
    modalWindow.style.display = "none";
    overlayWindow.style.display = "none";
  }

}

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
  expenses.push(newExpense); // Add to the expenses array


 // Check if the category already exists in the map
 if (categoryMap[category]) {
  // Add the expense amount to the existing category array
  categoryMap[category].amounts.push(newExpense.amount);

  // Update the total for the category
  categoryMap[category].total += newExpense.amount;
} else {
  // If the category doesn't exist, create a new entry
  categoryMap[category] = {
    amounts: [newExpense.amount], // Create a new array with the expense amount
    total: newExpense.amount,     // Set the initial total
  };
}


  renderExpenses(); // Re-render the table to reflect the new addition
  console.log(categoryMap.Savings.total);
  updateTotals(); // Update the totals for newly
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

// Function to filter expenses by ID and Render the Filtered Results
const filterExpensesById = (query) => {
  // Convert query to lowercase for case-insensitive matching
  const lowerCaseQuery = query.toLowerCase();

  // Filter the expenses by ID
  const filteredExpenses = expenses.filter((expense) => {
    return expense.id.toLowerCase().includes(lowerCaseQuery);
  });

  // Render the filtered results
  renderExpenses(filteredExpenses);
};



//Function to Delete an Expense
const deleteExpense = (expenseId) => {
  // Find the expense to delete
  const expenseToDelete = expenses.find((expense) => expense.id === expenseId);

  if (expenseToDelete) {
    // Remove the expense from the main expenses array
    expenses = expenses.filter((expense) => expense.id !== expenseId);

    // Update the corresponding category in categoryMap
    if (categoryMap[expenseToDelete.category]) {
      // Subtract the deleted expense's amount from the category's total
      categoryMap[expenseToDelete.category].total -= expenseToDelete.amount;

      // Remove the deleted expense's amount from the category's array
      categoryMap[expenseToDelete.category].amounts = categoryMap[expenseToDelete.category].amounts.filter(
        (amount) => amount !== expenseToDelete.amount
      );
    }

    renderExpenses(); // Re-render the table to reflect the deletion
    updateTotals();  // Update the total savings
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
  const category = document.getElementById('category').value;
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


//Event Handlers for the Search Bar Events
document.getElementById('searchBar').addEventListener('input', (event) => {
  const query = event.target.value; // Get the current search query
  filterExpensesById(query); // Call the filter function
});
