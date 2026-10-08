// Original "No" button behavior: it moves away so it cannot be clicked.
const noBtn = document.querySelector('.no-btn');
const wrapper = document.querySelector('.wrapper');

if (noBtn && wrapper) {
  const escapeNoButton = () => {
    const padding = 12;
    const maxX = Math.max(padding, wrapper.clientWidth - noBtn.offsetWidth - padding);
    const maxY = Math.max(padding, wrapper.clientHeight - noBtn.offsetHeight - padding);
    noBtn.style.left = `${Math.floor(Math.random() * maxX)}px`;
    noBtn.style.top = `${Math.floor(Math.random() * maxY)}px`;
  };

  noBtn.addEventListener('pointerenter', escapeNoButton);
  noBtn.addEventListener('focus', escapeNoButton);
  noBtn.addEventListener('click', (event) => {
    event.preventDefault();
    escapeNoButton();
  });
}

// October 2026 calendar — multiple dates can be selected.
const dates = document.querySelectorAll('.date');
const selectedDatesText = document.querySelector('#selectedDates');
const calendarProceed = document.querySelector('#calendarProceed');

const selectedDates = new Set();

dates.forEach((dateButton) => {
  dateButton.addEventListener('click', () => {
    const date = dateButton.dataset.date;

    if (selectedDates.has(date)) {
      selectedDates.delete(date);
      dateButton.classList.remove('selected');
    } else {
      selectedDates.add(date);
      dateButton.classList.add('selected');
    }

    const sorted = [...selectedDates].sort();
    if (selectedDatesText) {
      selectedDatesText.textContent = sorted.length
        ? `Selected: ${sorted.map(d => new Date(`${d}T00:00:00`).getDate()).join(', ')} October`
        : 'No dates selected';
    }
  });
});

if (calendarProceed) {
  calendarProceed.addEventListener('click', () => {
    if (!selectedDates.size) {
      calendarProceed.classList.add('shake');
      setTimeout(() => calendarProceed.classList.remove('shake'), 450);
      if (selectedDatesText) selectedDatesText.textContent = 'Pick at least one date first ♡';
      return;
    }

    localStorage.setItem('selectedDates', JSON.stringify([...selectedDates].sort()));
    window.location.href = 'activities.html';
  });
}

// Activity checklist — "None" is intentionally unavailable.
const noneOption = document.querySelector('#noneOption');
const noneMessage = document.querySelector('#noneMessage');
const activityProceed = document.querySelector('#activityProceed');

if (noneOption) {
  const triggerNone = (event) => {
    event.preventDefault();
    noneOption.classList.remove('shake');
    void noneOption.offsetWidth;
    noneOption.classList.add('shake');
    if (noneMessage) noneMessage.textContent = 'Nice try 😌 You have to pick something!';
  };

  noneOption.addEventListener('click', triggerNone);
  noneOption.querySelector('input').addEventListener('change', triggerNone);
}

if (activityProceed) {
  activityProceed.addEventListener('click', () => {
    const choices = [...document.querySelectorAll('input[name="activity"]:checked')]
      .map(input => input.value)
      .filter(value => value !== 'None');

    if (!choices.length) {
      activityProceed.classList.add('shake');
      setTimeout(() => activityProceed.classList.remove('shake'), 450);
      if (noneMessage) noneMessage.textContent = 'Choose at least one activity ♡';
      return;
    }

    localStorage.setItem('activities', JSON.stringify(choices));
    window.location.href = 'bouquet.html';
  });
}

// Final page summary.
const summary = document.querySelector('#summary');
if (summary) {
  const savedDates = JSON.parse(localStorage.getItem('selectedDates') || '[]');
  const savedActivities = JSON.parse(localStorage.getItem('activities') || '[]');

  const dateNumbers = savedDates.map(d => new Date(`${d}T00:00:00`).getDate());
  summary.textContent = dateNumbers.length
    ? `October ${dateNumbers.join(', ')} · ${savedActivities.join(', ')}`
    : 'Your chosen dates and activities are waiting for you ♡';
}
