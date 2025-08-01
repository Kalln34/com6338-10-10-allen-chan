document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    const addDayBtn = document.getElementById('addDayBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const itineraryContainer = document.getElementById('itineraryContainer');
    let itinerary = JSON.parse(localStorage.getItem('travelItinerary')) || [];
    renderItinerary();
    addDayBtn.addEventListener('click', addNewDay);
    clearAllBtn.addEventListener('click', clearAllDays);

    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');
    hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    nav.classList.toggle('active');
});

    function addNewDay() {
        const newDay = {
        id: Date.now(),
        date: '', 
        location: '',
        activities: []
    };
    itinerary.push(newDay);
    saveItinerary();
    renderItinerary();
}

    function clearAllDays() {
        if (confirm('Are you sure you want to clear all days?')) {
            itinerary = [];
            saveItinerary();
            renderItinerary();
        }
    }

    function renderItinerary() {
        itineraryContainer.innerHTML = '';
        if (itinerary.length === 0) {
            itineraryContainer.innerHTML = '<p>No days added yet. Click "Add Day" to start planning!</p>';
            return;
        }
        itinerary.forEach((day, dayIndex) => {
            const dayElement = createDayElement(day, dayIndex);
            itineraryContainer.appendChild(dayElement);
        });
    }

    function createDayElement(day, dayIndex) {
        const dayElement = document.createElement('div');
        dayElement.className = 'day-card';
        dayElement.innerHTML = `
            <div class="day-header">
                <h3>Day ${dayIndex + 1} - ${day.date ? new Date(day.date).toLocaleDateString() : 'No date set'}</h3>
                <input type="date" class="day-date" value="${day.date}" data-day="${dayIndex}">
                <button class="delete-day" data-id="${day.id}">×</button>
            </div>
            <div class="day-content">
                <div class="location-section">
                    <label>Location:</label>
                    <input type="text" class="location-input" value="${day.location}" 
                        placeholder="Enter location" data-day="${dayIndex}">
                    </div>
                <div class="activities-section">
                    <div class="add-activity">
                        <input type="time" class="activity-time" data-day="${dayIndex}">
                        <input type="text" class="activity-input" placeholder="Activity" data-day="${dayIndex}">
                        <button class="add-activity-btn" data-day="${dayIndex}">Add</button>
                    </div>
                    <ul class="activities-list"></ul>
                </div>
            </div>
        `;

        const activitiesList = dayElement.querySelector('.activities-list');
            day.activities.forEach((activity, activityIndex) => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span class="activity-time">${activity.time}</span>
                    <span class="activity-name">${activity.name}</span>
                    <button class="remove-activity" data-day="${dayIndex}" data-activity="${activityIndex}">×</button>
                 `;
                activitiesList.appendChild(li);
            });

            dayElement.querySelector('.day-date').addEventListener('change', updateDate);
            dayElement.querySelector('.delete-day').addEventListener('click', deleteDay);
            dayElement.querySelector('.location-input').addEventListener('change', updateLocation);
            dayElement.querySelector('.add-activity-btn').addEventListener('click', addActivity);
            return dayElement; 
    }

    function updateDate(e) {
    const dayIndex = parseInt(e.target.dataset.day);
    itinerary[dayIndex].date = e.target.value;
    saveItinerary();
    renderItinerary();    
    }
     
    function deleteDay(e) {
        const id = parseInt(e.target.dataset.id);
        itinerary = itinerary.filter(day => day.id !== id);
        saveItinerary();
        renderItinerary();
    }

    function updateLocation(e) {
        const dayIndex = parseInt(e.target.dataset.day);
        itinerary[dayIndex].location = e.target.value;
        saveItinerary();
    }

    function addActivity(e) {
        const dayIndex = parseInt(e.target.dataset.day);
        const activitySection = e.target.closest('.add-activity');
        const timeInput = activitySection.querySelector('.activity-time');
        const activityInput = activitySection.querySelector('.activity-input');
        const time = timeInput.value;
        const name = activityInput.value.trim();
        
        if (!name) {
            alert('Please enter an activity');
            return;
        }

        if (!time) {
            alert('Please select a time');
            return;
        }
        
        itinerary[dayIndex].activities.push({
            time,
            name
        });
        
        timeInput.value = '';
        activityInput.value = '';
        saveItinerary();
        renderItinerary();
    }

    function saveItinerary() {
        localStorage.setItem('travelItinerary', JSON.stringify(itinerary));
    }
});

