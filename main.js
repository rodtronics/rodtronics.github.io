//globals
var globalButtonIndex;
const logLength = 4;
//var logOfCrimes = ["","","",""];
var logOfCrimes = new Array(logLength).fill("");
var noto = 0;
var money = 0;

// this function stores information in itself, and defines our main object
function structOfCrimes(
  buttonid,
  name,
  requiredNoto,
  moneyEarned,
  notoEarned,
  timeToCompleteInSeconds,
  timeToCompleteInHours,
  state,
  datetimeCrimeStarted,
  datetimeCrimeWillEnd
) {
  this.buttonid = buttonid;
  this.name = name;
  this.requiredNoto = requiredNoto;
  this.moneyEarned = moneyEarned;
  this.notoEarned = notoEarned;
  this.timeToCompleteInSeconds = timeToCompleteInSeconds;
  this.timeToCompleteInHours = timeToCompleteInHours;
  this.timeToCompleteInMilliseconds =
    timeToCompleteInHours * 60 * 60 * 1000 + timeToCompleteInSeconds * 1000;
  // state refers to where the crime is at
  // 0 = ready to run
  // 1 = running
  // 2 = completed but haven't collected resources
  // 3 = unavailable (need more noto)
  this.state = state;
  this.datetimeCrimeStarted = 0;

  this.datetimeCrimeWillEnd = 0;
}

// this creates an array "setOfCrime" that contains different crimes
var setOfCrime = [
  new structOfCrimes("loit", "Loitering", 0, 0, 2, 3, 0, 0, 0, 0),
  new structOfCrimes("skate", "Skateboarding", 10, 0, 5, 10, 0, 0, 0, 0),
  new structOfCrimes("litt", "Littering", 7, 0, 3, 1, 0, 0, 0, 0),
];

// this function builds the crime windows and places them in the flexbox
function createCrimeButtons(structOfCrimesIterator, buttonIndex) {
  // create a new div that will be added to the flexbox
  var newCrimeButton = document.createElement("button");

  // set it's class and give it a unique id
  newCrimeButton.className = "crime";
  newCrimeButton.id = structOfCrimesIterator.buttonid;

  // create the text that goes in the button
  var newButtonText = structOfCrimesIterator.name;

  // add the text to the div
  newCrimeButton.innerHTML = newButtonText;

  // append the newly created div to the flexbox
  document.getElementById("crimeID").appendChild(newCrimeButton);

  // add function to the button for when it is clicked
  document
    .getElementById(structOfCrimesIterator.buttonid)
    .addEventListener("click", () => clickOnCrimeButton(buttonIndex));
}

// this function is called when a crime button is clicked
function clickOnCrimeButton(buttonIndex) {
  globalButtonIndex = buttonIndex;

  // add the name
  var newInfoText = setOfCrime[buttonIndex].name;
  document.getElementById("infoID").textContent = newInfoText;

  // make a new button that you can click to start the crime and style it
  var newGoButton = document.createElement("button");
  newGoButton.id = "goButton";
  newGoButton.className = "crime";

  // add text to button
  newGoButton.textContent = "commit crime";

  // append button into info panel
  document.getElementById("infoID").appendChild(newGoButton);

  // add event listener to button
  document
    .getElementById("goButton")
    .addEventListener("click", () => commitCrime(buttonIndex));
}

// starts crime
function commitCrime(buttonIndex) {
  if (setOfCrime[buttonIndex].state == 0) {
    setDatetimes(globalButtonIndex);
    setOfCrime[globalButtonIndex].state = 1;
    // send message to log
    logEntry =
      setOfCrime[globalButtonIndex].name +
      " will finish at: <br>" +
      setOfCrime[globalButtonIndex].datetimeCrimeStarted.format(
        "DD/MM/YY HH:ss"
      );
    refreshSingleButton(buttonIndex);
    addToLog(logEntry);
  }
}

function refreshSingleButton(buttonIndex) {
  if ((setOfCrime[buttonIndex].state = 1)) {
    timeUntilComplete = setOfCrime[buttonIndex].datetimeCrimeWillEnd.toNow();
    console.log(timeUntilComplete);
    formattedTime = timeUntilComplete;
    refreshedButtonText = setOfCrime[buttonIndex].name + "<br>" + formattedTime;
  } else {
    refreshedButtonText = setOfCrime[buttonIndex].name;
  }

  document.getElementById(setOfCrime[buttonIndex].buttonid).innerHTML =
    refreshedButtonText;
  console.log(refreshedButtonText);
}

// sets dates and times of crime start and finish
function setDatetimes(buttonIndex) {
  // set time crime initiated
  setOfCrime[globalButtonIndex].datetimeCrimeStarted = dayjs();

  // set time the crime will be completed
  setOfCrime[globalButtonIndex].datetimeCrimeWillEnd = dayjs().fromNow(
    setOfCrime[globalButtonIndex].datetimetocompleteinmilliseconds,
    "millisecond"
  );
}

function hasCrimeFinished(crimeIndex) {
  if (dayjs() > setOfCrime[crimeIndex].datetimeCrimeWillEnd) {
    return true;
  } else {
    return false;
  }
}

// this function updates the log
function addToLog(text) {
  // moves each element in the array along one, making space for the new bit of info
  for (logShuffleIndex = logLength; logShuffleIndex > -1; logShuffleIndex--) {
    logOfCrimes[logShuffleIndex + 1] = logOfCrimes[logShuffleIndex];
  }
  // set the latest log into
  logOfCrimes[0] = text;

  // build new log text
  newLogText = "";
  for (logAddIndex = 0; logAddIndex < logLength + 1; logAddIndex++) {
    newLogText = newLogText + logOfCrimes[logAddIndex] + "<br>";
  }
  document.getElementById("logID").innerHTML = newLogText;
}

function refreshBanner() {
  updatedBannerHTML = noto + "N<br>" + money + "$";
  document.getElementById("statsBannerID").innerHTML = updatedBannerHTML;
}

// this function is called every frame, and will call a couple other functions
function refreshLoop(timestamp) {
  refreshBanner();
  // and set up the refresh loop to start next repaint of the frame
  window.requestAnimationFrame(refreshLoop);
}

//
addToLog("crimes beginning");
setOfCrime.forEach(createCrimeButtons);
document.getElementById("infoID").textContent = "Welcome to Crime Committer";

// finally we initiate the refreshLoop
window.requestAnimationFrame(refreshLoop);
