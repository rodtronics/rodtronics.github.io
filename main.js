//globals
var globalButtonIndex;
const logLength = 4;
//var logOfCrimes = ["","","",""];
var logOfCrimes = new Array(logLength).fill("");
var noto = 0;
var money = 0;

//these functions are initialistion based

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
  new structOfCrimes("loit", "Loitering", 0, 0, 2, 30, 0, 0, 0, 0),
  new structOfCrimes("skate", "Skateboarding", 10, 0, 5, 100, 0, 0, 0, 0),
  new structOfCrimes("litt", "Littering", 7, 0, 3, 10, 0, 0, 0, 0),
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

//end of init functions

// this function is called when a crime button is clicked
function clickOnCrimeButton(buttonIndex) {
  globalButtonIndex = buttonIndex;

  switch (setOfCrime[buttonIndex].state) {
    case 0:
      // add the name
      var newInfoTitle = setOfCrime[buttonIndex].name;
      var newInfoText = "";

      document.getElementById("infoID").innerHTML = newInfoTitle;
      document.getElementById("infotextID").innerHTML = newInfoText;

      // make a new button that you can click to start the crime and style it
      var newGoButton = document.createElement("button");
      newGoButton.id = "goButton";
      newGoButton.className = "crime";

      // add text to button
      newGoButton.textContent = "commit crime";

      // append button into info panel
      document.getElementById("infotextID").appendChild(newGoButton);

      // add event listener to button
      document
        .getElementById("goButton")
        .addEventListener("click", () => commitCrime(buttonIndex));

      break;
    case 2:
      noto += setOfCrime[buttonIndex].notoEarned;
      money += setOfCrime[buttonIndex].moneyEarned;
      addToLog(
        setOfCrime[buttonIndex].notoEarned +
          " noto earned " +
          setOfCrime[buttonIndex].moneyEarned +
          " money earned"
      );
      setOfCrime[buttonIndex].state = 0;

      break;
  }
}

// starts crime
function commitCrime(buttonIndex) {
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
        "<br>" +
        formattedTimehuman +
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

function hasCrimeFinished(structOfCrimes, crimeIndex) {
  switch (setOfCrime[crimeIndex].state) {
    case 0:
      break;
    case 1:
      if (dayjs().isAfter(setOfCrime[globalButtonIndex].datetimeCrimeWillEnd)) {
        setOfCrime[crimeIndex].state = 2;
      }
      break;
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
  // refresh the banner at the time
  refreshBanner();
  // refresh info on each button
  setOfCrime.forEach(refreshSingleButton);
  setOfCrime.forEach(hasCrimeFinished);
  // and set up the refresh loop to start next repaint of the frame
  window.requestAnimationFrame(refreshLoop);
}

//
addToLog("crimes beginning");
setOfCrime.forEach(createCrimeButtons);
document.getElementById("infoID").textContent = "Welcome to Crime Committer";

// finally we initiate the refreshLoop
window.requestAnimationFrame(refreshLoop);
