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

function getStorageKey() {
  const year = date.getFullYear();
  const month = date.getMonth();
  return `${year}-${month}`;
}

function loadHabits() {
  habits = JSON.parse(localStorage.getItem(getStorageKey())) || [];
}

function saveHabits() {
  localStorage.setItem(getStorageKey(), JSON.stringify(habits));
}

function renderCalendar() {
  loadHabits();

  const year = date.getFullYear();
  const month = date.getMonth();
  const today = new Date();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  currentMonth.textContent = `${monthNames[month]} ${year}`;

  daysRow.innerHTML = `<th>Habits</th>`;
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
    daysRow.innerHTML += `<th class="${isToday ? 'today-highlight-header' : ''}">${day}</th>`;
  }
  daysRow.innerHTML += `<th>Total</th>`;

  habitRows.innerHTML = "";
  habits.forEach((habit, habitIndex) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>
        <div class="habit-name-container">
          <span class="habit-name">${habit.name}</span>
          <button class="edit-habit" onclick="editHabit(${habitIndex})">Edit</button>
          <button class="remove-habit" onclick="removeHabit(${habitIndex})">Remove</button>
        </div>
      </td>
    `;
    let completed = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const cell = document.createElement("td");
      cell.className = habit.days.includes(day) ? "complete" : "incomplete";
      cell.textContent = habit.days.includes(day) ? "✔" : "";
      cell.addEventListener("click", () => toggleDay(habitIndex, day));
      row.appendChild(cell);
      completed += habit.days.includes(day) ? 1 : 0;
    }

    const totalCell = document.createElement("td");
    totalCell.textContent = completed;
    row.appendChild(totalCell);
    habitRows.appendChild(row);
  });
}

function toggleDay(habitIndex, day) {
  const habit = habits[habitIndex];
  if (habit.days.includes(day)) {
    habit.days = habit.days.filter(d => d !== day);
  } else {
    habit.days.push(day);
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

function removeHabit(habitIndex) {
  if (confirm(`Are you sure you want to remove the habit: "${habits[habitIndex].name}"?`)) {
    habits.splice(habitIndex, 1);
    saveHabits();
    renderCalendar();
  }
}

function editHabit(habitIndex) {
  const newHabitName = prompt("Edit habit name:", habits[habitIndex].name);
  if (newHabitName) {
    habits[habitIndex].name = newHabitName;
    saveHabits();
    renderCalendar();
  }
}

clearDataBtn.addEventListener("click", () => {
  if (confirm("Clear all data?")) {
    habits = [];
    localStorage.removeItem(getStorageKey());
    renderCalendar();
  }
});

prevMonth.addEventListener("click", () => {
  date.setMonth(date.getMonth() - 1);
  renderCalendar();
});

nextMonth.addEventListener("click", () => {
  date.setMonth(date.getMonth() + 1);
  renderCalendar();
});

addHabitBtn.addEventListener("click", addHabit);

renderCalendar();
