//globals
var globalButtonIndex;
const logLength = 4;
var logOfCrimes = new Array(logLength).fill("");
var noto = 0;
var money = 0;

//these functions are initialistion based

// this function stores information in itself, and defines our main object
function structOfCrimes(
  buttonid,
  name,
  cost,

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
  this.cost = cost;
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
  this.state = 3;
  this.datetimeCrimeStarted = 0;

  this.datetimeCrimeWillEnd = 0;
}

// struct for accumulated data (I expect to add more as time goes on)
function structOfAccumulatedData(numberTimesCommitted) {
  this.numberTimesCommitted = numberTimesCommitted;
}

// this creates an array "setOfCrime" that contains different crimes
var setOfCrime = [
  new structOfCrimes("loit", "Loitering", 0, 0, 0, 2, 12, 0, 0, 0, 0),
  new structOfCrimes("skate", "Skateboarding", 0, 10, 0, 5, 45, 0, 0, 0, 0),
  new structOfCrimes("litt", "Littering", 0, 2, 0, 1, 4, 0, 0, 0, 0),
  new structOfCrimes(
    "watch",
    "Selling Counterfeit Watches",
    0,
    20,
    5,
    2,
    60,
    0,
    0,
    0,
    0
  ),
  new structOfCrimes("baby", "Candy from a Baby", 0, 12, 0, 3, 28, 0, 0, 0, 0),
  new structOfCrimes("jorts", "Wearing Jorts", 5, 17, 0, -5, 60, 0, 0, 0, 0),
];

// initialise the accumulated data array
var setOfAccumlatedData = new Array(setOfCrime.length).fill(0);

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
  // and a double click tries to commit crime straight away
  document
    .getElementById(structOfCrimesIterator.buttonid)
    .addEventListener("dblclick", () => doubleClickOnCrimeButton(buttonIndex));
}

function doubleClickOnCrimeButton(buttonIndex) {
  clickOnCrimeButton(buttonIndex);
  commitCrime(buttonIndex);
}

//end of init functions
//
//

// this function is called when a crime button is clicked
// and largely makes sure the info panel is relevant
function clickOnCrimeButton(buttonIndex) {
  // set the global button index
  globalButtonIndex = buttonIndex;

  // first off, if they've clicked on it because the crime was ready to reap rewards
  // state of 2 means comple
  if (setOfCrime[buttonIndex].state == 2) {
    successfulCrime(buttonIndex);
  }
  // refresh the panel
  refreshInfoPanel(buttonIndex);
}

// what happens when a crime was successful
function successfulCrime(buttonIndex) {
  noto += setOfCrime[buttonIndex].notoEarned;
  money += setOfCrime[buttonIndex].moneyEarned;
  addToLog(
    setOfCrime[buttonIndex].notoEarned +
      " noto & " +
      setOfCrime[buttonIndex].moneyEarned +
      " $ earned"
  );
  setOfCrime[buttonIndex].state = 0;
  // refresh the noto requireds
  setOfCrime.forEach(checkNotoRequired);
}

function refreshInfoPanel(buttonIndex) {
  // work on the assumption that the button index passed is the msot recently pressed button

  switch (setOfCrime[buttonIndex].state) {
    case 0:
      var newInfoTitle = setOfCrime[buttonIndex].name;
      var newInfoText =
        setOfCrime[buttonIndex].requiredNoto + " NOTOREITY required"; /*+
        "<br>gain<br>" +
        setOfCrime[buttonIndex].notoEarned +
        "N<br>" +
        setOfCrime[buttonIndex].moneyEarned +
        "$";*/ // maybe make it so you have to commit the crime to see what happens
      updateGoButton("CLICK TO COMMIT");
      break;
    case 1:
      var newInfoTitle = setOfCrime[buttonIndex].name;
      var newInfoText =
        "and it's being committed<br>until " +
        setOfCrime[buttonIndex].datetimeCrimeWillEnd.format(
          "DD/MM/YY HH:mm:ss"
        );
      updateGoButton("COMMITTING");
      break;
    case 2:
      var newInfoTitle = setOfCrime[buttonIndex].name;
      var newInfoText = "and it's been done<br>praise the lord";
      updateGoButton("CRIMEGRATULATIONS");
      break;
    case 3:
      var newInfoTitle = "COMMIT MORE CRIME";
      var newInfoText =
        setOfCrime[buttonIndex].requiredNoto + " NOTOREITY required";
      updateGoButton("COMMIT MORE CRIME");
  }
  document.getElementById("infoID").innerHTML = newInfoTitle;
  document.getElementById("infotextID").innerHTML = newInfoText;
}

function updateGoButton(newText) {
  document.getElementById("buttonLocationID").innerHTML = newText;
}
//
//
// starts crime
function commitCrime(buttonIndex) {
  // this is just laziness lol
  buttonIndex = globalButtonIndex;
  if (setOfCrime[buttonIndex].state == 0) {
    setDatetimes(buttonIndex);
    setOfCrime[buttonIndex].state = 1;
    // send message to log
    logEntry =
      setOfCrime[buttonIndex].name +
      " will finish at: <br>" +
      setOfCrime[buttonIndex].datetimeCrimeWillEnd.format("DD/MM/YY HH:mm:ss");
    refreshSingleButton("", buttonIndex);
    addToLog(logEntry);
  }
  refreshInfoPanel(globalButtonIndex);
}

function refreshSingleButton(structOfCrimes, buttonIndex) {
  // check to see what state button in
  switch (setOfCrime[buttonIndex].state) {
    // case 0 means ready to go
    case 0:
      refreshedButtonText = setOfCrime[buttonIndex].name;
      // set attribute for css
      document
        .getElementById(setOfCrime[buttonIndex].buttonid)
        .setAttribute("state", "ready");

      break;

    // case 1 means running
    case 1:
      timeUntilComplete = dayjs(
        setOfCrime[buttonIndex].datetimeCrimeWillEnd
      ).diff(dayjs());
      formattedTime = dayjs(timeUntilComplete).format("mm:ss");
      formattedTimehuman = dayjs.duration(timeUntilComplete).humanize(true);
      refreshedButtonText =
        setOfCrime[buttonIndex].name +
        // "<br>" +
        // formattedTimehuman +
        "<br>" +
        formattedTime;
      // set the class of the element to get it to go blue
      document
        .getElementById(setOfCrime[buttonIndex].buttonid)
        .setAttribute("state", "running");
      break;

    // case 2 means complete and ready to collect goods
    case 2:
      refreshedButtonText =
        setOfCrime[buttonIndex].name + " complete<br>collect reward";

      document
        .getElementById(setOfCrime[buttonIndex].buttonid)
        .setAttribute("state", "complete");
      break;
    case 3:
      refreshedButtonText = "COMMIT MORE CRIMES";
  }
  document.getElementById(setOfCrime[buttonIndex].buttonid).innerHTML =
    refreshedButtonText;
  //console.log(refreshedButtonText);
}

// sets dates and times of crime start and finish
function setDatetimes(buttonIndex) {
  // set time crime initiated
  setOfCrime[buttonIndex].datetimeCrimeStarted = dayjs();
  completionMS = setOfCrime[buttonIndex].timeToCompleteInMilliseconds;
  // set time the crime will be completed
  setOfCrime[buttonIndex].datetimeCrimeWillEnd = dayjs().add(
    dayjs(completionMS, "millisecond")
  );
}

function hasCrimeFinished(structOfCrimes, buttonIndex) {
  if (setOfCrime[buttonIndex].state == 1) {
    if (dayjs().isAfter(setOfCrime[buttonIndex].datetimeCrimeWillEnd)) {
      setOfCrime[buttonIndex].state = 2;
      refreshInfoPanel(globalButtonIndex);
    }
  }
}

// this takes any crime out of state 3 (not ready) if it's noto is high enough
// and will have been called with a foreach
function checkNotoRequired(structOfCrimes, crimeIndex) {
  if (
    setOfCrime[crimeIndex].state == 3 &&
    noto >= setOfCrime[crimeIndex].requiredNoto
  ) {
    setOfCrime[crimeIndex].state = 0;
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
    newLogText = newLogText + "*-" + logOfCrimes[logAddIndex] + "<br>";
  }
  document.getElementById("logID").innerHTML = newLogText;
}

function refreshBanner() {
  updatedBannerHTML = noto + "N<br>" + money + "$";
  document.getElementById("statsBannerID").innerHTML = updatedBannerHTML;
}

function cheat(keyPressKey) {
  noto += 2;
  money += 1;
  updatedBannerHTML;
  setOfCrime.forEach(checkNotoRequired);
}

// the main loop
// this function is called every frame, and will call a couple other functions
function refreshLoop(timestamp) {
  // refresh the banner at the time
  refreshBanner();
  document.getElementById("currentTimeID").innerHTML =
    "its " + dayjs().format("YY.MM.DD HH:mm:ss");
  // refresh info on each button
  setOfCrime.forEach(refreshSingleButton);
  setOfCrime.forEach(hasCrimeFinished);
  // and set up the refresh loop to start next repaint of the frame
  window.requestAnimationFrame(refreshLoop);
}

// start up the log
addToLog(dayjs().format("YY.MM.DD HH:mm") + " the crimespree has begun");

// make the crime buttons
setOfCrime.forEach(createCrimeButtons);

// call this initially to set initial crime state to 0
setOfCrime.forEach(checkNotoRequired);

// of course you can cheat lol ;)
//cheatCodeKeyboardEvent = new KeyboardEvent("keydown");
//document.addEventListener("keydown", () => cheat());

// assign eventlistener to the go button
document.getElementById("infoID").textContent = "LETS GO";
document
  .getElementById("buttonLocationID")
  .addEventListener("click", () => commitCrime());
// finally we initiate the refreshLoop
window.requestAnimationFrame(refreshLoop);
