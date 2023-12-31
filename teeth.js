import data from "./static/constants.json" assert { type: "json" };

const teethSection = document.getElementsByClassName("teeth")[0];
const serviceSection = document.getElementsByClassName("services")[0];
const doctorSection = document.getElementsByClassName("doctors")[0];
const dateSection = document.getElementsByClassName("dates")[0];
const successSection = document.getElementsByClassName("success")[0];

const teeth = document.querySelectorAll("path");
const services = document.querySelectorAll(".service");
const doctors = document.querySelectorAll(".doctor");

const dateLabel = document
  .getElementsByClassName("date-label")[0]
  .getElementsByTagName("span")[0];
const weekMain = document.getElementsByClassName("prev-next-main")[0];
const weekDayName = document.getElementsByClassName("days")[0];
const weekDays = document.getElementsByClassName("prev-next-day");
const btnPrevWeek = document.getElementsByClassName("btn-prev-week")[0];
const btnNextWeek = document.getElementsByClassName("btn-next-week")[0];
const times = document.getElementsByClassName("time");
const timeDesc = document.getElementsByClassName("time-desc")[0];

const callToAction = document.getElementsByClassName("call-to-action")[0];
const btnContinue = document.getElementsByClassName("btn-continue")[0];
const btnBack = document.getElementsByClassName("btn-back")[0];

let sectionNum = 0;

// const alert = document.getElementsByClassName('alert')[0];
// const alertTitle = alert.getElementsByClassName('alert-title')[0];

let selectedTeeth = [],
  selectedService = {},
  selectedDoctor = {};

// Randevu - Appointment
let appointment = {
  teeth: [],
  doctor: {},
  date: new Date(),
  service: {},
};

// HANDLE TEETH //
// get tooth itself
let teethParents = [];
teethParents = Array.from(teeth).filter((t) => {
  return t.classList.length > 1;
});

// Handle tooth | teeth selection
for (let tParent of teethParents) {
  tParent.addEventListener("click", function (e) {
    e.preventDefault();

    let toothNum = tParent.classList.value
      .split(" ")[1]
      .split("-")
      .slice(-2, -1)[0];

    if (selectedTeeth.includes(toothNum)) {
      tParent.style.fill = "transparent";
      selectedTeeth.pop(toothNum);
    } else {
      tParent.style.fill = "#6dffeb";
      selectedTeeth.push(toothNum);
    }
  });
}

// Set teeth styles and selected teeth to default
function setTeethToDefault() {
  selectedTeeth = [];
  for (let tParent of teethParents) {
    tParent.style.fill = "transparent";
  }
}

// Bug-fix, make tooth children lines click work, hide all tooth parts except outer line
for (let tParent of teethParents) {
  // Handle mouseenter tooth
  tParent.addEventListener("mouseenter", function (e) {
    e.preventDefault();

    // Get parent
    let parentNum;
    if (tParent.classList.value.split(" ")[1].length > 1) {
      parentNum = tParent.classList.value
        .split(" ")[1]
        .split("-")
        .slice(-2, -1)[0];
    }

    // Get children, if matches hide children show parent line
    let childNum;
    teeth.forEach((t) => {
      if (t.classList.value.split(" ").length <= 1) {
        childNum = t.classList.value.split("-").slice(-1)[0];
        if (childNum === parentNum) {
          t.style.visibility = "hidden";
        }
      }
    });
  });

  // Handle mouseleave - show all tooth parts
  tParent.addEventListener("mouseleave", function (e) {
    e.preventDefault();
    teeth.forEach((t) => {
      t.style.visibility = "visible";
    });
  });
}

// HANDLE SERVICES //
// Handle service selection
for (let service of services) {
  service.addEventListener("click", function (e) {
    e.preventDefault();
    const serviceText =
      service.getElementsByClassName("service-name")[0].innerText;
    const serviceImg = service.getElementsByClassName("service-image")[0].src;

    for (let s of services) {
      // Colorize clicked service
      s.style.backgroundColor = " #e2e2e2";
      s.style.color = "rgb(0, 0, 0)";
      appointment.service = {};
    }

    // Colorize clicked service
    service.style.backgroundColor = "#002b5b";
    service.style.color = "white";

    // Set appointment service to clicked one
    selectedService.text = serviceText;
    selectedService.imageSrc = serviceImg;
    appointment.service = selectedService;
  });
}

// Set services styles and selected service to default
function setServiceToDefault() {
  for (let s of services) {
    s.style.backgroundColor = " #e2e2e2";
    s.style.color = "rgb(0, 0, 0)";

    // Set appointment service to clicked one
    selectedService.text = "";
    selectedService.imageSrc = "";
    appointment.service = {};
  }
}

// HANDLE DOCTORS //
// Handle doctor selection
// TODO - Handle doctors dynamically
for (let doctor of doctors) {
  doctor.addEventListener("click", function (e) {
    e.preventDefault();

    const doctorText =
      doctor.getElementsByClassName("doctor-name")[0].innerText;
    const doctorImg = doctor.getElementsByClassName("doctor-image")[0].src;

    for (let d of doctors) {
      // Colorize clicked doctor
      d.style.backgroundColor = " #e2e2e2";
      d.style.color = "rgb(0, 0, 0)";
      appointment.doctor = {};
    }

    // Colorize clicked doctor
    doctor.style.backgroundColor = "#002b5b";
    doctor.style.color = "white";

    // Set appointment doctor to clicked one
    selectedDoctor.text = doctorText;
    selectedDoctor.imageSrc = doctorImg;
    appointment.doctor = selectedDoctor;
  });
}

// Set doctor styles and doctor to default
function setDoctorToDefault() {
  for (let d of doctors) {
    d.style.backgroundColor = " #e2e2e2";
    d.style.color = "rgb(0, 0, 0)";

    // Set appointment doctor to clicked one
    selectedDoctor.text = "";
    selectedDoctor.imageSrc = "";
    appointment.doctor = {};
  }
}

// HANDLE DATES //
// Handle date selection
let sevenDays = [];

function setInitials() {
  for (let i = 0; i < 7; i++) {
    let date = new Date();
    date.setDate(date.getDate() + i);
    sevenDays.push(date);
  }

  createWeekDays(sevenDays);
  getWeekDayName(sevenDays);
  setClickedDaysDefault();
  getDateDesc(new Date(), "");
}
setInitials();

// Set first day of week active initially
function setFirstDayActive() {
  let firstDayToday = weekDays[1];
  firstDayToday.style.backgroundColor = "#002b5b";
  firstDayToday.getElementsByTagName("span")[0].style.color = "white";
  getDateDesc(new Date(firstDayToday["data-date"]));
  detectClickedDay();
}
setFirstDayActive();

// Get previous 7 days
btnPrevWeek.addEventListener("click", function getPreviousWeek(e) {
  e.preventDefault();
  setClickedDaysDefault();

  sevenDays.map((day) => {
    return day.setDate(day.getDate() - 7);
  });

  // Make days place empty and fill with new values
  createWeekDays(sevenDays);
  getWeekDayName(sevenDays);
  setFirstDayActive();
  detectClickedDay();
});

// Get next 7 days
btnNextWeek.addEventListener("click", function getNextWeek(e) {
  e.preventDefault();
  setClickedDaysDefault();

  sevenDays.map((day) => {
    return day.setDate(day.getDate() + 7);
  });

  // Make days place empty and fill with new values
  createWeekDays(sevenDays);
  getWeekDayName(sevenDays);
  setFirstDayActive();
  detectClickedDay();
});

// Add months 1 week days (04, 05, 06, 07, 08, 09, 10)
function createWeekDays(days) {
  removeAllChildNodes(weekMain);

  days.map((d) => {
    const dayDiv = document.createElement("div");
    const daySpan = document.createElement("span");
    dayDiv["data-date"] = d;

    dayDiv.classList.add("prev-next-day");
    daySpan.textContent = d.getDate();

    dayDiv.appendChild(daySpan);
    weekMain.appendChild(dayDiv);
  });
}

// Add week days' name (Mon, Tue, Wed etc...)
function getWeekDayName(days) {
  removeAllChildNodes(weekDayName);

  days.map((d) => {
    const dayNameDiv = document.createElement("div");
    const dayNameSpan = document.createElement("span");
    dayNameSpan.textContent = new Date(d).toLocaleString("en-us", {
      weekday: "short",
    });

    dayNameDiv.appendChild(dayNameSpan);
    weekDayName.appendChild(dayNameDiv);
  });
}

// Detact selected appointment day
function detectClickedDay() {
  Array.from(weekDays).forEach((day) => {
    // Fixes child click not propagating
    day.getElementsByTagName("span")[0].style.pointerEvents = "none";

    // Prevent appointment selection on yesterday & backwards
    checkDate(day);

    // Date click handling
    day.addEventListener("click", function (e) {
      e.preventDefault();
      setClickedDaysDefault();

      day.style.backgroundColor = "#002b5b";
      day.getElementsByTagName("span")[0].style.color = "white";

      let customDate = getDateDesc(new Date(e.target["data-date"]), "");
      appointment.date = customDate;
    });
  });
}
detectClickedDay();

function checkDate(dayVar) {
  let isDatePast = false;
  let today = new Date();
  let yesterday = new Date(today.setDate(today.getDate() - 1));
  let dayDate = new Date(dayVar["data-date"]);

  if (dayDate <= yesterday) {
    isDatePast = true;
    dayVar.style.backgroundColor = "rgb(239 239 239)";
    dayVar.getElementsByTagName("span")[0].style.color = "black";

    dayVar.style.cursor = "not-allowed";
    dayVar.style.pointerEvents = "none";
  }

  return isDatePast;
}

// Remove element's all children
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

// Get selected date description
function getDateDesc(dayDate, time) {
  let isDatePast = checkDate(weekDays[6]);

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const day = dayDate.getDate();
  const dayName = dayNames[Number(dayDate.getDay())];
  const month = monthNames[Number(dayDate.getMonth())];
  const year = dayDate.getFullYear();

  // Sunday, 3 September 2023
  const dateTitle = `${dayName}, ${day} ${month} ${year}${
    isDatePast ? " (Past!)" : ""
  }`;
  dateLabel.textContent = dateTitle;
  return `${dayName}, ${day} ${month} ${year}`;
}

// Set clicked days to default
function setClickedDaysDefault() {
  for (let d of weekDays) {
    // Colorize clicked doctor
    d.style.backgroundColor = "rgb(239 239 239)";
    d.getElementsByTagName("span")[0].style.color = "black";
    appointment.date = new Date();
  }
}

// HANDLE TIMES
// Set clicked days to default
function setClickedTimesDefault() {
  for (let t of times) {
    // Colorize clicked doctor
    t.style.backgroundColor = "rgb(239 239 239)";
    t.getElementsByTagName("span")[0].style.color = "black";
  }
}
setClickedTimesDefault();

// Active tomorow first appointment session
function setFirstTimeActive() {
  times[0].style.backgroundColor = "#002b5b";
  times[0].getElementsByTagName("span")[0].style.color = "white";
  timeDesc.textContent = times[0].textContent;
  appointment.time = times[0].textContent.replace(/\s/g, "");
}
setFirstTimeActive();

function handleTimeSelection() {
  Array.from(times).forEach((timeEl) => {
    timeEl.addEventListener("click", function (e) {
      e.preventDefault();
      setClickedTimesDefault();

      timeEl.style.backgroundColor = "#002b5b";
      timeEl.getElementsByTagName("span")[0].style.color = "white";

      appointment.time = timeEl.textContent.replace(/\s/g, "");
      timeDesc.textContent = timeEl.textContent;
    });
  });
}
handleTimeSelection();

// Initial load defaulting
function setAtInitialsLoading() {
  hideAllElse();
  btnBack.style.display = "none";
  teethSection.style.display = "flex";
}
setAtInitialsLoading();

// Handle continue button
btnContinue.addEventListener("click", function (e) {
  e.preventDefault();

  // Show service section
  if (sectionNum === 0) {
    showServiceSection();
    return;
  }

  // Show doctor section
  if (sectionNum === 1) {
    showDoctorSection();
    return;
  }

  // Show date section
  if (sectionNum === 2) {
    showDateSection();
    return;
  }

  // Show appointment complete card
  if (sectionNum === 3) {
    showCompletionCard();
    return;
  }

  // Show completed alert
  if (sectionNum === 4) {
    alertAppointmentSuccess();
    return;
  }
});

// Show service selection
function showServiceSection() {
  appointment.teeth = selectedTeeth;
  hideAllElse();

  serviceSection.style.display = "flex";
  btnContinue.textContent = "Select the Service";
  callToAction.textContent = "Please select the service you want to get.";
  btnBack.style.display = "block";
  btnBack.textContent = "Bact to Teeth";
  sectionNum++;
}

// Show doctor selection
function showDoctorSection() {
  hideAllElse();

  doctorSection.style.display = "flex";
  btnContinue.textContent = "Select the Doctor";
  callToAction.textContent = "Please select the doctor you want to choose.";
  btnBack.textContent = "Bact to Service";
  sectionNum++;
}

// Show date section
function showDateSection() {
  hideAllElse();

  dateSection.style.display = "flex";
  btnContinue.textContent = "Select the Date";
  callToAction.textContent =
    "Please select the day & hour you want the appointment in.";
  btnBack.textContent = "Bact to Doctor";
  sectionNum++;
}

// Show appointment complete card
function showCompletionCard() {
  hideAllElse();

  successSection.style.display = "flex";
  setSuccessAppointment();
  btnBack.textContent = "Bact to Date";
  btnContinue.textContent = "Complete the Appointment";
  btnBack.style.width = "18rem";
  btnContinue.style.width = "18rem";
  sectionNum++;

  let notSelectedText = getNotSelectedText();
  controlNotSelected(notSelectedText);
}

// Show appointment ready alert
function alertAppointmentSuccess() {
  btnContinue.style.display = "none";
  btnBack.style.display = "none";

  setBtnStylesToDefault();
  hideAllElse();
  setDescTitle();

  setTimeout(() => {
    resetDescTitle();
    hideAllElse();
    setAllToDefault();

    teethSection.style.display = "flex";
    btnContinue.style.display = "block";
    btnContinue.textContent = "Select the Teeth";
    sectionNum = 0;
  }, 5000);
}

// Set appointment elements content
function setSuccessAppointment() {
  // get complete appointment elements
  const teethContentEl = document.getElementsByClassName("success-teeth")[0];
  const serviceContentEl =
    document.getElementsByClassName("success-service")[0];
  const doctorContentEl = document.getElementsByClassName("success-doctor")[0];
  const dayContentEl = document.getElementsByClassName("success-day")[0];
  const hourContentEl = document.getElementsByClassName("success-hour")[0];

  // get needed texts
  const seletectedTeethsText = appointment.teeth.join(" - ");
  const selectedServiceText = appointment.service.text;
  const selectedDoctorText = appointment.doctor.text;
  const selectedDayText = getDateDesc(new Date(appointment.date), "");
  const selectedHourText = appointment.time;

  // Set elements content
  teethContentEl.textContent = seletectedTeethsText;
  serviceContentEl.textContent = selectedServiceText;
  doctorContentEl.textContent = selectedDoctorText;
  dayContentEl.textContent = selectedDayText;
  hourContentEl.textContent = selectedHourText;
}

// Control whether all options are selected or not
function controlNotSelected(notSelectedText) {
  if (notSelectedText !== "") {
    btnContinue.style.pointerEvents = "none";
    callToAction.textContent = `${notSelectedText} ${
      notSelectedText.split("&").length > 1 ? "are" : "is"
    } not selected, please select ${
      notSelectedText.split("&").length > 1 ? "them" : "it"
    } first!`;

    callToAction.style.padding = "0.25rem 0rem";
    callToAction.style.backgroundColor = "red";
    callToAction.style.color = "white";
    callToAction.style.fontSize = "1rem";
    callToAction.style.width = "50vw";
    callToAction.style.textAlign = "center";
    return;
  } else {
    resetDescTitle();

    callToAction.textContent = "Please complete the appointment.";
    return;
  }
}

// Get not selected options' text
function getNotSelectedText() {
  let notSelectedText = "";
  let toothNotSelectedText = "";
  let serviceNotSelectedText = "";
  let doctorNotSelectedText = "";

  // control not selected options
  appointment.teeth.length < 1 && (toothNotSelectedText = "Teeth");
  Object.keys(appointment.service) < 1 && (serviceNotSelectedText = "Service");
  Object.keys(appointment.doctor) < 1 && (doctorNotSelectedText = "Doctor");

  notSelectedText =
    `${toothNotSelectedText} ${serviceNotSelectedText} ${doctorNotSelectedText}`
      .trim()
      .replace(" ", " & ");

  return notSelectedText;
}

// Set btns' styles to default
function setBtnStylesToDefault() {
  btnBack.style.width = "14rem";
  btnContinue.style.width = "14rem";
}

// Activate | passivize success title
function setDescTitle() {
  callToAction.textContent =
    "Your appointment is submitted successfully. Thanks.";
  callToAction.style.margin = "2.75rem 0 2.25rem";
  callToAction.style.padding = ".55rem 2.25rem";
  callToAction.style.backgroundColor = "#7cffee";
  callToAction.style.color = "#002b5b";
  callToAction.style.width = "50vw";
}
function resetDescTitle() {
  callToAction.textContent =
    "Please select the teeth you want the treatment for.";
  callToAction.style.margin = "1.75rem 0 1.25rem";
  callToAction.style.padding = "0";
  callToAction.style.backgroundColor = "transparent";
  callToAction.style.color = "#002b5b";
  callToAction.style.fontSize = "1.2rem";
  callToAction.style.width = "auto";
}

// Handle btn back click
btnBack.addEventListener("click", function (e) {
  e.preventDefault();

  // Go back to teeth selection
  if (sectionNum === 1) {
    backToTeethSection();
    return;
  }

  // Go back to service selection
  if (sectionNum === 2) {
    backToServiceSection();
    return;
  }

  // Go back to doctor selection
  if (sectionNum === 3) {
    backToDoctorSection();
    return;
  }

  // Go back to date selection
  if (sectionNum === 4) {
    backToDateSection();
    return;
  }
});

// Back to teeth section
function backToTeethSection() {
  hideAllElse();

  btnBack.style.display = "none";
  teethSection.style.display = "flex";
  btnContinue.textContent = "Select the Teeth";
  callToAction.textContent =
    "Please select the teeth you want the treatment for.";
  sectionNum--;
}

// Back to service section
function backToServiceSection() {
  hideAllElse();

  serviceSection.style.display = "flex";
  btnBack.textContent = "Back to Teeth";
  btnContinue.textContent = "Select the Service";
  callToAction.textContent = "Please select the service you want to get.";
  sectionNum--;
}

// Back to doctor section
function backToDoctorSection() {
  hideAllElse();

  doctorSection.style.display = "flex";
  btnBack.textContent = "Back to Service";
  btnContinue.textContent = "Select the Doctor";
  callToAction.textContent = "Please select the doctor you want to choose.";
  sectionNum--;
}

// Back to date section
function backToDateSection() {
  hideAllElse();

  dateSection.style.display = "flex";
  btnBack.textContent = "Back to Doctor";
  btnContinue.textContent = "Select the Date";
  btnContinue.style.pointerEvents = "visible";
  callToAction.textContent =
    "Please select the day & hour you want the appointment in.";
  sectionNum--;

  resetDescTitle();
  setBtnStylesToDefault();
}

// Hide all sections - teeth, service, doctor and date
function hideAllElse() {
  teethSection.style.display = "none";
  serviceSection.style.display = "none";
  doctorSection.style.display = "none";
  dateSection.style.display = "none";
  successSection.style.display = "none";
}

// Set all values to default
function setAllToDefault() {
  setTeethToDefault();
  setServiceToDefault();
  setDoctorToDefault();

  setClickedDaysDefault();
  setFirstDayActive();

  setClickedTimesDefault();
  setFirstTimeActive();
}
