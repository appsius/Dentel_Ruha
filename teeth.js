import data from "./static/constants.json" assert { type: "json" };

// Get all teeth parts
const teeth = document.querySelectorAll("path");
const services = document.querySelectorAll(".service");
const callToAction = document.getElementsByClassName("call-to-action")[0];
const btnContinue = document.getElementsByClassName("btn-continue")[0];
const btnBack = document.getElementsByClassName("btn-back")[0];
const alert = document.getElementsByClassName("alert")[0];
const alertTitle = alert.getElementsByClassName("alert-title")[0];

const teethSection = document.getElementsByClassName("teeth")[0];
const serviceSection = document.getElementsByClassName("services")[0];
const doctorSection = document.getElementsByClassName("doctors")[0];
const dateSection = document.getElementsByClassName("dates")[0];

let selectedTeeth = [],
  selectedService = {},
  selectedDoctor = {},
  selectedDate = new Date(),
  isTeethSelected = false,
  isDoctorSelected = false,
  isServiceSelected = false,
  isDateSelected = false;

// Randevu
let appointment = {
  teeth: [],
  doctor: {},
  date: new Date(),
  service: {},
};

// get tooth itself
let teethParents = [];
teethParents = Array.from(teeth).filter((t) => {
  return t.classList.length > 1;
});

// Handle tooth click
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
        if (childNum === parentNum) t.style.visibility = "hidden";
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

// Handle service click
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

    // Is service selected
    isServiceSelected = true;

    console.log(isServiceSelected);
  });
}

// Handle continue button
btnContinue.addEventListener("click", function (e) {
  e.preventDefault();

  // Detect isSelected vars
  selectedTeeth.length > 0
    ? (isTeethSelected = true)
    : (isTeethSelected = false);
  Object.keys(selectedDoctor).length > 0
    ? (isDoctorSelected = true)
    : (isDoctorSelected = false);
  new Date(selectedDate) > new Date()
    ? (isDateSelected = true)
    : (isDateSelected = false);

  // No tooth selected, give warning
  if (!isTeethSelected) {
    alert.style.display = "flex";
    alertTitle.textContent = "Please select at least one tooth!";

    setTimeout(() => {
      alert.style.display = "none";
    }, 3000);
    return;
  }

  // Teeth selection done, hide it and go to service selection
  if (isTeethSelected) {
    appointment.teeth = selectedTeeth;
    teethSection.style.display = "none";
    serviceSection.style.display = "flex";
    btnContinue.textContent = "Select the Service";
    callToAction.textContent = "Please select the service you want to get.";
  }

  // No service selected, give warning
  if (isTeethSelected && !isServiceSelected) {
    alert.style.display = "flex";
    alertTitle.textContent = "Please select the service!";

    setTimeout(() => {
      alert.style.display = "none";
    }, 3000);
    return;
  }

  // Service selection done, hide it and go to doctor section
  if (isTeethSelected && isServiceSelected) {
    serviceSection.style.display = "none";
    doctorSection.style.display = "flex";
    btnContinue.textContent = "Select the Doctor";
    callToAction.textContent = "Please select the doctor you want to choose.";
  }

  // // No doctor selected, give warning
  // if (isTeethSelected && isServiceSelected && !isDoctorSelected) {
  //   alert.style.display = "flex";
  //   alertTitle.textContent = "Please select the doctor!";

  //   setTimeout(() => {
  //     alert.style.display = "none";
  //   }, 3000);
  //   return;
  // }

  // Doctor selection done, hide it and got to date section
  // if (isTeethSelected && isServiceSelected && isDoctorSelected) {
  //   appointment.doctor = selectedDoctor;
  //   doctorSection.style.display = "none";
  //   dateSection.style.display = "flex";
  // }

  // No date selected, give warning
  // if (
  //   isTeethSelected &&
  //   isServiceSelected &&
  //   isDoctorSelected &&
  //   !isDateSelected
  // ) {
  //   alert.style.display = "flex";
  //   alertTitle.textContent = "Please select the date!";

  //   setTimeout(() => {
  //     alert.style.display = "none";
  //   }, 3000);
  //   return;
  // }

  // Date selection done, appointement is ready,
  // Give success alert, set all variables to default,
  //   if (
  //     isTeethSelected &&
  //     isServiceSelected &&
  //     isDoctorSelected &&
  //     isDateSelected
  //   ) {
  //     appointment.date = selectedDate;
  //     dateSection.style.display = "none";

  //     setInitialValues();
  //     teethSection.style.display = "flex";
  //   }
});

// Handling back button
btnBack.addEventListener("click", function (e) {
  e.preventDefault();

  // Go back to teeth selection
  if (isTeethSelected) {
    serviceSection.style.display = "none";
    teethSection.style.display = "flex";
  }

  // Go back to service selection
  if (isTeethSelected && isServiceSelected) {
    doctorSection.style.display = "none";
    serviceSection.style.display = "flex";
  }

  // Go back to doctor selection
  if (isTeethSelected && isServiceSelected && doctorSection) {
    dateSection.style.display = "none";
    doctorSection.style.display = "flex";
  }
});
