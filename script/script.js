"use strict";
let qs = (selector) => document.querySelector(selector);
let qsAll = (selector) => document.querySelectorAll(selector);

let $ = {};

const monthDays = {
  jan: 31,
  feb: [28, 29],
  mar: 31,
  apr: 30,
  may: 31,
  jun: 30,
  jul: 31,
  aug: 31,
  sep: 30,
  oct: 31,
  nov: 30,
  dec: 31,
};
let uniqueId = 0;
let current;
$.calender_display = qs('[data-id="calender_display"]');
$.currentDay = qs('[data-id="current-day"]');
$.label_month_year = qs('[data-id="label_month_year"]');
$.promptInput = qs('[data-id="prompt_take_input"]');
$.accept = qs('[data-id="accept"]');
$.cancel = qs('[data-id="cancel"]');
$.title = qs('[data-id="title"]');
$.description = qs('[data-id="description"]');
$.displayActivities = qs('[data-id="display-activities"]');
let activities = [];
let activityArr = [];
let set = new Set();
$.showDates = qs('[data-id="show-dates"]');
console.log($.showDates);
$.todaysActivities = qs('[data-id="todays-activities"]');

activities = JSON.parse(localStorage.getItem("toDo")) || [];
uniqueId = JSON.parse(localStorage.getItem("uniqueId")) || 0;
let displayCurrentDateAndWeek = () => {
  const date = new Date().getDate();
  const month = new Intl.DateTimeFormat(navigator.language, {
    month: "short",
  }).format(new Date());
  let heading = document.createElement("h2");
  heading.textContent = "current day".toUpperCase();
  let pFirst = document.createElement("p");
  let heading2 = document.createElement("h3");
  heading2.textContent = "current Month".toUpperCase();
  let pSecond = document.createElement("p");
  pFirst.textContent = date;
  pSecond.textContent = month;
  let pEvent = document.createElement("p");
  pEvent.classList.add("event");
  pEvent.setAttribute("data-id", "add-event");
  pEvent.textContent = "Create Event +";
  let div = document.createElement("div");

  $.currentDay.innerHTML = " ";
  [heading, pFirst, heading2, pSecond, pEvent].forEach((val) => {
    $.currentDay.appendChild(val);
  });
};
let checkLeapYear = (month, year) => {
  let Month = month.toLowerCase();
  if (Month === "feb" ? true : false) {
    if (0 === year % 400 || (0 !== year % 100 && 0 === year % 4)) return true;
  }
  return false;
};
//returns the an array of number of days and map with the weekdays of the month provided
let numberofDays = (month, year) => {
  month = month.toLowerCase().slice(0, 3);
  let num;
  if (month !== "feb") {
    num = monthDays[month];
  } else if (checkLeapYear(month, year)) {
    num = monthDays[month][1];
    console.log(num);
  } else {
    num = monthDays[month][0];
    console.log(num);
  }
  let days = [];
  for (let i = 1; i <= num; i++) {
    let date = `${year} ${month} ${i}`;

    let day = new Intl.DateTimeFormat(navigator.language, {
      weekday: "short",
    }).format(new Date(date));
    days.push([i, day, month, year]);
  }
  return days;
};
let getMonthYear = (
  month = new Intl.DateTimeFormat(navigator.language, {
    month: "long",
  }).format(new Date()),
  year = new Date().getFullYear()
) => {
  //get current year and month
  //let year = new Date().getFullYear();
  return numberofDays(month, year);
};
let selectDates = (e) => {
  let clicked = e.target.dataset.id;
  console.log(clicked === "register-event");
  //Guard Clause
  if (clicked !== "register-event") {
  } else {
    current = e.target;
    [...$.showDates.children].forEach((ele) =>
      ele.classList.remove("selected")
    );
    e.target.classList.add("selected");
  }
};
let appendDates = (noOfDays) => {
  let div = document.createElement("div");
  div.setAttribute("class", "show-dates");
  $.showDates.innerHTML = "";
  noOfDays.forEach((val, i) => {
    //val = []; i =current index
    let p = document.createElement("p");
    //let span = document.createElement("span");
    p.innerHTML = `${val[0]}<br><br>${val[1]}`;

    //if it is.... just add the class currenDay
    //otherwise leave it just it is
    let currentDay = new Intl.DateTimeFormat(navigator.language, {
      day: "numeric",
      year: "numeric",
      month: "short",
    }).format(new Date());
    let day = new Intl.DateTimeFormat(navigator.language, {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(`${val[3]},${val[2]},${val[0]}`));
    day === currentDay ? p.setAttribute("class", "currentDay") : "";

    //p.appendChild(span);
    //p.appendChild(span1);
    p.setAttribute("data-id", "register-event");
    p.setAttribute("info", `${val[3]},${val[2].toUpperCase()},${val[0]}`);
    p.setAttribute("id", i + 1);
    $.showDates.appendChild(p);
    //const child = `<p><span>${val[0]}</span><span>${val[1]}</span></p>`;
    $.label_month_year.innerHTML = " ";
    $.label_month_year.textContent = `${val[2].toUpperCase()},${val[3]}`;
    $.label_month_year.setAttribute(
      "info",
      `${val[2].toUpperCase()},${val[3]}`
    );
  });
  $.calender_display.innerHTML = " ";
  $.calender_display.appendChild($.showDates);
};
displayCurrentDateAndWeek();
let noOfDays = getMonthYear();
appendDates(noOfDays);
let todayEvent = (activities) => {
  let today = activities
    .filter(
      (ele) =>
        new Intl.DateTimeFormat({
          day: "numeric",
          month: "short",
          year: "numeric",
        }).format(new Date()) ==
        new Intl.DateTimeFormat({
          day: "numeric",
          month: "short",
          year: "numeric",
        }).format(new Date(ele.activityDate))
    )
    .map((ele) => ele);
  if (today.length !== 0) {
    today.forEach((val) => {
      const div = document.createElement("div");
      div.setAttribute("class", "activity");
      const span = document.createElement("span");
      span.textContent = val.activityDate;
      const span1 = document.createElement("span");
      span1.textContent = val.title;
      const span2 = document.createElement("span");
      span2.textContent = val.description;
      const span3 = document.createElement("span");
      [span, span1, span2].forEach((val) => div.appendChild(val));
      $.todaysActivities.appendChild(div);
      console.log("today" + today);
    });
  } else {
    $.todaysActivities.textContent = "No Event For Today";
  }
};
let deleteActivity = (e) => {
  const clickedUniqueId = Number(e.currentTarget.id); // Assuming the clicked element has the unique ID as its id attribute
  console.log(typeof clickedUniqueId);
  activities = JSON.parse(localStorage.getItem("toDo"));

  // Find the index of the actn ivity with a matching unique ID
  const indexToDelete = activities.findIndex(
    (val) => val.uniqueId === clickedUniqueId
  );

  if (indexToDelete !== -1) {
    // Remove the activity at the found index from the activities array
    activities.splice(indexToDelete, 1);

    // Update localStorage with the modified activities array
    localStorage.setItem("toDo", JSON.stringify(activities));

    // Call the 'updateUI' function to reflect the changes in the UI
    updateUI(activities);
  } else {
    console.log("Activity not found.");
  }
};

let updateUI = (activities) => {
  $.displayActivities.innerHTML = "";
  $.todaysActivities.innerHTML = "";
  if (activities.length === 0) {
    $.displayActivities.textContent = "No Event Found";
  } else {
    uniqueId = JSON.parse(localStorage.getItem("uniqueId"));
    activities.forEach((val) => {
      const div = document.createElement("div");
      div.setAttribute("class", "activity");
      const span = document.createElement("span");
      span.textContent = val.activityDate;
      const span1 = document.createElement("span");
      span1.textContent = val.title;
      const span2 = document.createElement("span");
      span2.textContent = val.description;
      const span3 = document.createElement("span");
      span3.innerHTML = `<div id=${val.uniqueId} data-id="delete-activity" class="delete">Delete</div>`;
      [span, span1, span2, span3].forEach((val) => div.appendChild(val));
      $.displayActivities.appendChild(div);
      $.deleteActivity = qsAll('[data-id="delete-activity"]');
      $.deleteActivity.forEach((val) =>
        val.addEventListener("click", deleteActivity)
      );
    });
  }
  todayEvent(activities);
};

updateUI(activities);

//if the month is feb
//check whether the year is leap year or
//not

//this function is used to get the month and year

let arr = [];

$.events = qsAll('[data-id="register-event"]');

let addEvent = () => {
  if (current) {
    $.promptInput.classList.remove("hidden");
  }
  let element = current;
  if (!current) return;

  current = current.getAttribute("info");
  //Guard Clause
  current = new Date(current);
  console.log(current);
  let options = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  console.log(
    new Intl.DateTimeFormat(navigator.language, options).format(current)
  );
  console.log(
    new Intl.DateTimeFormat(navigator.language, options).format(new Date())
  );
  //current - new Date() < 0 ||
  if (!current) {
    alert("click any date to add event");
  } else {
    $.accept.addEventListener("click", () => {
      if (!current) return;
      let activityDate = new Intl.DateTimeFormat(navigator.language, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(current);
      //let title = prompt("Enter the title");
      //let description = prompt("Enter the description");
      let title;
      let description;
      title = $.title.value;
      description = $.description.value;
      $.title.value = "";
      $.description.value = "";
      $.promptInput.classList.add("hidden");
      if (
        title == "" ||
        description == "" ||
        typeof title === "object" ||
        typeof description === "object"
      ) {
        return;
      } else {
        uniqueId = JSON.parse(localStorage.getItem("uniqueId")) || 0;
        activities.push({
          uniqueId,
          title,
          description,
          activityDate,
        });
        uniqueId++;
        localStorage.setItem("uniqueId", uniqueId);
        activityDate = "";
        element.classList.remove("selected");
        localStorage.setItem("toDo", JSON.stringify(activities));
        activities = JSON.parse(localStorage.getItem("toDo"));
        updateUI(activities);
      }
    });
    $.cancel.addEventListener("click", () => {
      $.title.value = "";
      $.title.blur();
      $.description.value = "";
      $.description.blur();
      $.promptInput.classList.add("hidden");
    });
  }
};
$.addEvent = qs('[data-id="add-event" ]');

$.addEvent.addEventListener("click", addEvent);

$.leftArrow = qs('[data-id="left-arrow"]');
$.rightArrow = qs('[data-id="right-arrow"]');

$.leftArrow.addEventListener("click", () => {
  let day = $.label_month_year.getAttribute("info");
  let month = new Intl.DateTimeFormat(navigator.language, {
    month: "short",
  }).format(new Date(new Date(day) - 1));
  let year = new Intl.DateTimeFormat(navigator.language, {
    year: "numeric",
  }).format(new Date(new Date(day) - 1));
  noOfDays = getMonthYear(month, year);
  appendDates(noOfDays);
  $.events = undefined;
  $.events = qsAll('[data-id="register-event"]');
});
$.rightArrow.addEventListener("click", () => {
  let day = $.label_month_year.getAttribute("info");
  day = new Date(day);
  // let month = new Intl.DateTimeFormat(navigator.language, {
  //   month: "short",
  // }).format(new Date(new Date(day)));
  // let year = new Intl.DateTimeFormat(navigator.language, {
  //   year: "numeric",
  // }).format(new Date(new Date(day)));
  day = new Date(day.valueOf() + 1000 * 3600 * 24 * 31);
  let month = new Intl.DateTimeFormat(navigator.language, {
    month: "short",
  }).format(day);
  //
  let year = new Intl.DateTimeFormat(navigator.language, {
    year: "numeric",
  }).format(day);
  noOfDays = getMonthYear(month, year);
  appendDates(noOfDays);
  $.events = undefined;
  $.events = qsAll('[data-id="register-event"]');
  arr.splice();
});

//select the date

//select dates
$.showDates.addEventListener("click", selectDates);
