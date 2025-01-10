// Initialization
const habitTable = document.getElementById("habit-table");
const daysRow = document.getElementById("days-row");
const habitRows = document.getElementById("habit-rows");
const currentMonth = document.getElementById("current-month");
const prevMonth = document.getElementById("prev-month");
const nextMonth = document.getElementById("next-month");

const addHabitBtn = document.getElementById("add-habit");
const clearDataBtn = document.getElementById("clear-data");

let habits = [];
let date = new Date();

// Helper function to get the current month and year key for local storage
function getStorageKey() {
  const year = date.getFullYear();
  const month = date.getMonth();
  return `${year}-${month}`;
}

// Load habits from local storage for the current month
function loadHabits() {
  const storageKey = getStorageKey();
  habits = JSON.parse(localStorage.getItem(storageKey)) || [];
}

// Save habits to local storage for the current month
function saveHabits() {
  const storageKey = getStorageKey();
  localStorage.setItem(storageKey, JSON.stringify(habits));
}

// Render Calendar
function renderCalendar() {
  loadHabits();

  // Get the current month and year
  const year = date.getFullYear();
  const month = date.getMonth();

  // Display the month name
  const monthNames = [
    "January", "February", "March", "April", "May", "June", "July", "August",
    "September", "October", "November", "December",
  ];
  currentMonth.textContent = `${monthNames[month]} ${year}`;

  // Set up days of the month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  daysRow.innerHTML = `<th>Habits</th>`;
  for (let day = 1; day <= daysInMonth; day++) {
    daysRow.innerHTML += `<th>${day}</th>`;
  }
  daysRow.innerHTML += `<th>Total Completed</th>`; // Add extra column for completed habits count

  // Render the habits
  habitRows.innerHTML = "";
  habits.forEach((habit, habitIndex) => {
    const row = document.createElement("tr");
    row.classList.add("habit-row"); // Add class for hover effect
    
    // Habit name with edit/remove buttons
    row.innerHTML = `
      <td>
        <div class="habit-name-container">
          <span class="habit-name">${habit.name}</span>
          <button class="edit-habit" onclick="editHabit(${habitIndex})">Edit</button>
          <button class="remove-habit" onclick="removeHabit(${habitIndex})">Remove</button>
        </div>
      </td>
    `;
    
    let completedCount = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const cell = document.createElement("td");
      cell.classList.add("normal-cell");
      if (habit.days.includes(day)) {
        cell.textContent = "✔";
        cell.classList.add("complete");
        completedCount++;
      } else {
        cell.classList.add("incomplete");
      }
      // Add edit functionality (click to toggle completed status)
      cell.addEventListener("click", () => toggleDay(habitIndex, day));
      row.appendChild(cell);
    }

    // Add total completed habits for this row
    const totalCompletedCell = document.createElement("td");
    totalCompletedCell.textContent = completedCount;
    row.appendChild(totalCompletedCell);
    
    habitRows.appendChild(row);
  });
}

function toggleDay(habitIndex, day) {
  const habit = habits[habitIndex];
  if (habit.days.includes(day)) {
    habit.days = habit.days.filter(d => d !== day); // Remove completion
  } else {
    habit.days.push(day); // Add completion
  }
  saveHabits();
  renderCalendar();
}

function addHabit() {
  const habitName = prompt("Enter new habit name:");
  if (habitName) {
    habits.push({ name: habitName, days: [] });
    saveHabits();
    renderCalendar();
  }
}

function clearData() {
  if (confirm("Are you sure you want to clear all data?")) {
    habits = [];
    const storageKey = getStorageKey();
    localStorage.removeItem(storageKey);
    renderCalendar();
  }
}

// Function to remove a habit entirely
function removeHabit(habitIndex) {
  if (confirm(`Are you sure you want to remove the habit: "${habits[habitIndex].name}"?`)) {
    habits.splice(habitIndex, 1);
    saveHabits();
    renderCalendar();
  }
}

// Function to edit a habit's name
function editHabit(habitIndex) {
  const newHabitName = prompt("Edit habit name:", habits[habitIndex].name);
  if (newHabitName) {
    habits[habitIndex].name = newHabitName;
    saveHabits();
    renderCalendar();
  }
}

// Event Listeners
addHabitBtn.addEventListener("click", addHabit);
clearDataBtn.addEventListener("click", clearData);

prevMonth.addEventListener("click", () => {
  date.setMonth(date.getMonth() - 1);
  renderCalendar();
});

nextMonth.addEventListener("click", () => {
  date.setMonth(date.getMonth() + 1);
  renderCalendar();
});

// Initial Render
renderCalendar();
