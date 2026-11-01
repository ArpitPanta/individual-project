const calendar = document.getElementById('calendar');
const monthYear = document.getElementById('monthYear');
const selectedWeekday = document.getElementById('selectedWeekday');
const selectedDay = document.getElementById('selectedDay');
const eventList = document.getElementById('eventList');
const eventCount = document.getElementById('eventCount');
const emptyMessage = document.getElementById('emptyMessage');

const today = new Date();
let shownMonth = new Date(today.getFullYear(), today.getMonth(), 1);
let selectedDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
let events = [];

function dateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
}

function updateClock() {
    const currentTime = new Date();
    const hours = String(currentTime.getHours()).padStart(2, '0');
    const minutes = String(currentTime.getMinutes()).padStart(2, '0');
    const seconds = String(currentTime.getSeconds()).padStart(2, '0');

    document.getElementById('clock').textContent = hours + ':' + minutes;
    document.getElementById('clockSeconds').textContent = ':' + seconds;
}

function showSelectedDate() {
    selectedWeekday.textContent = selectedDate.toLocaleDateString('en-US', {
        weekday: 'long'
    });

    selectedDay.textContent = selectedDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    const dayEvents = events.filter(function (event) {
        return event.date === dateKey(selectedDate);
    });

    eventList.innerHTML = '';

    eventCount.textContent = dayEvents.length;
    if (dayEvents.length === 0) {
        emptyMessage.style.display = 'block';
    } else {
        emptyMessage.style.display = 'none';
    }

    for (let i = 0; i < dayEvents.length; i++) {
        const item = document.createElement('div');
        item.className = 'event-item';
        item.innerHTML = '<div class="event-time">' + dayEvents[i].time + '</div>';
        item.innerHTML += '<div class="event-title"></div>';
        item.querySelector('.event-title').textContent = dayEvents[i].title;
        eventList.appendChild(item);
    }
}

function drawCalendar() {
    const year = shownMonth.getFullYear();
    const month = shownMonth.getMonth();
    const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysThisMonth = new Date(year, month + 1, 0).getDate();
    const daysLastMonth = new Date(year, month, 0).getDate();

    monthYear.textContent = shownMonth.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    });
    calendar.innerHTML = '';

    for (let i = 0; i < 42; i++) {
        let dayNumber;
        let dayDate;
        let otherMonth = false;

        if (i < firstWeekday) {
            dayNumber = daysLastMonth - firstWeekday + i + 1;
            dayDate = new Date(year, month - 1, dayNumber);
            otherMonth = true;
        } else if (i >= firstWeekday + daysThisMonth) {
            dayNumber = i - firstWeekday - daysThisMonth + 1;
            dayDate = new Date(year, month + 1, dayNumber);
            otherMonth = true;
        } else {
            dayNumber = i - firstWeekday + 1;
            dayDate = new Date(year, month, dayNumber);
        }

        const button = document.createElement('button');
        button.className = 'day';
        button.textContent = dayNumber;
        button.setAttribute(
            'aria-label',
            dayDate.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            })
        );

        if (otherMonth) {
            button.classList.add('other-month');
        }

        if (dateKey(dayDate) === dateKey(today)) {
            button.classList.add('today');
        }

        if (dateKey(dayDate) === dateKey(selectedDate)) {
            button.classList.add('selected');
        }

        const hasEvent = events.some(function (event) {
            return event.date === dateKey(dayDate);
        });

        if (hasEvent) {
            button.classList.add('has-event');
        }

        button.addEventListener('click', function () {
            selectedDate = dayDate;
            if (otherMonth) shownMonth = new Date(dayDate.getFullYear(), dayDate.getMonth(), 1);
            drawCalendar();
            showSelectedDate();
        });

        button.addEventListener('dblclick', function () {
            const title = prompt('What would you like to remember?');
            if (title && title.trim() !== '') {
                let time = prompt('What time? (for example, 10:30 AM)', 'All day');
                if (!time || time.trim() === '') {
                    time = 'All day';
                }

                const newEvent = {
                    date: dateKey(dayDate),
                    title: title.trim(),
                    time: time.trim()
                };

                events.push(newEvent);
                selectedDate = dayDate;
                shownMonth = new Date(dayDate.getFullYear(), dayDate.getMonth(), 1);
                drawCalendar();
                showSelectedDate();
            }
        });

        calendar.appendChild(button);
    }
}

document.getElementById('previousMonth').addEventListener('click', function () {
    shownMonth.setMonth(shownMonth.getMonth() - 1);
    drawCalendar();
});

document.getElementById('nextMonth').addEventListener('click', function () {
    shownMonth.setMonth(shownMonth.getMonth() + 1);
    drawCalendar();
});

updateClock();
setInterval(updateClock, 1000);
drawCalendar();
showSelectedDate();
