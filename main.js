//globals
var globalButtonIndex;
const logLength = 4;
var logOfCrimes = new Array(logLength).fill("");
var noto = 0;
var money = 0;
var accumDataText = "";
var buttonIndex = 0;

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
  this.timeToCompleteInMilliseconds = timeToCompleteInHours * 60 * 60 * 1000 + timeToCompleteInSeconds * 1000;
  // state refers to where the crime is at
  // 0 = ready to run
  // 1 = running
  // 2 = completed but haven't collected resources
  // 3 = unavailable (need more noto)
  this.datetimeCrimeStarted = 0;

  this.datetimeCrimeWillEnd = 0;
}

// struct for accumulated data (I expect to add more as time goes on)
function structOfGameState(state, numberTimesCommitted, datetimeCrimeWillEnd) {
  this.state = state;
  this.numberTimesCommitted = numberTimesCommitted;
  this.datetimeCrimeWillEnd = datetimeCrimeWillEnd;
}

// this creates an array "setOfCrime" that contains different crimes
var setOfCrime = [
  new structOfCrimes("loit", "Loitering", 0, 0, 0, 2, 12, 0, 0, 0),
  new structOfCrimes("skate", "Skateboarding", 0, 10, 0, 5, 45, 0, 0, 0),
  new structOfCrimes("litt", "Littering", 0, 2, 0, 1, 4, 0, 0, 0),
  new structOfCrimes("watch", "Selling Counterfeit Watches", 0, 20, 5, 2, 60, 0, 0, 0),
  new structOfCrimes("baby", "Candy from a Baby", 0, 12, 0, 3, 28, 0, 0, 0),
  new structOfCrimes("jorts", "Wearing Jorts", 5, 17, 0, -5, 60, 0, 0, 0),
];

// initialise the accumulated data array
var gameState = new Array(setOfCrime.length);
// use a for loop to fill them
for (let gameStateDataIndex = 0; gameStateDataIndex < setOfCrime.length; gameStateDataIndex++) {
  gameState[gameStateDataIndex] = new structOfGameState(3, 0, 0);
}

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
  document.getElementById(structOfCrimesIterator.buttonid).addEventListener("click", () => clickOnCrimeButton(buttonIndex));
  // and a double click tries to commit crime straight away
  document.getElementById(structOfCrimesIterator.buttonid).addEventListener("dblclick", () => doubleClickOnCrimeButton(buttonIndex));
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
  if (gameState[buttonIndex].state == 2) {
    successfulCrime(buttonIndex);
  }
  // refresh the panel
  refreshInfoPanel(buttonIndex);
}

// what happens when a crime was successful
function successfulCrime(buttonIndex) {
  noto += setOfCrime[buttonIndex].notoEarned;
  money += setOfCrime[buttonIndex].moneyEarned;
  addToLog(setOfCrime[buttonIndex].name + " committed, " + setOfCrime[buttonIndex].notoEarned + " noto & " + setOfCrime[buttonIndex].moneyEarned + " $ earned");
  // set the crime back to ready
  gameState[buttonIndex].state = 0;
  //update accumulated data
  gameState[buttonIndex].numberTimesCommitted += 1;

  //update cookies
  setCookie(buttonIndex);

  // refresh the noto requireds
  setOfCrime.forEach(checkNotoRequired);
}

function refreshInfoPanel(buttonIndex) {
  // work on the assumption that the button index passed is the msot recently pressed button
  switch (gameState[buttonIndex].state) {
    //
    // case 0 means is ready to go but hasn't been done
    case 0:
      var newInfoTitle = setOfCrime[buttonIndex].name;
      var newInfoText = setOfCrime[buttonIndex].requiredNoto + " NOTORIETY required";
      if (setOfCrime[buttonIndex].cost > 0) {
        newInfoText += "<br>AND COSTS<br>" + setOfCrime[buttonIndex].cost + "$";
      }
      newInfoText += generateGameStateDataText(buttonIndex);
      if (money >= setOfCrime[buttonIndex].cost) {
        updateGoButton("CLICK TO COMMIT");
      } else {
        updateGoButton("U CAN'T AFFORD IT");
      }
      break;
    //
    // case 1 means activelyt committing
    case 1:
      var newInfoTitle = setOfCrime[buttonIndex].name;
      var newInfoText = "in progress<br>until " + dayjs(gameState[buttonIndex].datetimeCrimeWillEnd).format("DD/MM/YY HH:mm:ss" + "<br>");
      // add text with accumulated data
      newInfoText += generateGameStateDataText(buttonIndex);
      updateGoButton("COMMITTING");
      break;
    //
    // case 2 means it's completed and waiting to be collected
    case 2:
      var newInfoTitle = setOfCrime[buttonIndex].name;
      var newInfoText = "and it's been done<br>praise the lord";
      updateGoButton("CRIMEGRATULATIONS");
      break;
    //
    // case three means unavailable yet
    case 3:
      var newInfoTitle = "COMMIT MORE CRIME";
      var newInfoText = setOfCrime[buttonIndex].requiredNoto + " NOTORIETY required";
      updateGoButton("COMMIT MORE CRIME");
  }
  document.getElementById("infoID").innerHTML = newInfoTitle;
  document.getElementById("infotextID").innerHTML = newInfoText;
}

function generateGameStateDataText(buttonIndex) {
  if (gameState[buttonIndex].numberTimesCommitted < 1) {
    accumDataText = "<br><br>";
  } else {
    accumDataText =
      "<br><br>YOU'VE COMMITTED THIS CRIME <br>" +
      gameState[buttonIndex].numberTimesCommitted +
      " TIMES<br>" +
      "earning:<br>" +
      setOfCrime[buttonIndex].notoEarned * gameState[buttonIndex].numberTimesCommitted +
      " NOTORIETY<br>" +
      setOfCrime[buttonIndex].moneyEarned * gameState[buttonIndex].numberTimesCommitted +
      " $<BR>AND SPENT<br> " +
      dayjs.duration(setOfCrime[buttonIndex].timeToCompleteInMilliseconds * gameState[buttonIndex].numberTimesCommitted, "millisecond").format("DD HH:mm:ss") +
      " DOING SO";
  }
  return accumDataText;
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
  //is the crime ready to go?
  if (gameState[buttonIndex].state == 0) {
    // can the player afford it?
    if (money >= setOfCrime[buttonIndex].cost) {
      // ok go ahead commit crimes
      setDatetimes(buttonIndex);
      gameState[buttonIndex].state = 1;
      // send message to log
      logEntry = setOfCrime[buttonIndex].name + " will finish at: <br>" + dayjs(gameState[buttonIndex].datetimeCrimeWillEnd).format("DD/MM/YY HH:mm:ss");
      refreshSingleButton("", buttonIndex);
      addToLog(logEntry);
      money -= setOfCrime[buttonIndex].cost;

      // once new times have been set and money taken away, update the cookie so if refresh happens during a cookie countdown it's still happening
      setCookie(buttonIndex);
    }
  }
  refreshInfoPanel(globalButtonIndex);
}

function refreshSingleButton(structOfCrimes, buttonIndex) {
  // check to see what state button in
  switch (gameState[buttonIndex].state) {
    // case 0 means ready to go
    case 0:
      refreshedButtonText = setOfCrime[buttonIndex].name;
      // set attribute for css
      document.getElementById(setOfCrime[buttonIndex].buttonid).setAttribute("state", "ready");

      break;

    // case 1 means running
    case 1:
      timeUntilComplete = dayjs(gameState[buttonIndex].datetimeCrimeWillEnd).diff(dayjs());
      formattedTime = dayjs(timeUntilComplete).format("mm:ss");
      formattedTimehuman = dayjs.duration(timeUntilComplete).humanize(true);
      refreshedButtonText = setOfCrime[buttonIndex].name + "<br>" + formattedTime;
      // set the class of the element to get it to go blue
      document.getElementById(setOfCrime[buttonIndex].buttonid).setAttribute("state", "running");
      break;

    // case 2 means complete and ready to collect goods
    case 2:
      refreshedButtonText = setOfCrime[buttonIndex].name + " complete<br>collect reward";

      document.getElementById(setOfCrime[buttonIndex].buttonid).setAttribute("state", "complete");
      break;
    case 3:
      refreshedButtonText = "COMMIT MORE CRIMES";
  }
  document.getElementById(setOfCrime[buttonIndex].buttonid).innerHTML = refreshedButtonText;
  //console.log(refreshedButtonText);
}

// sets dates and times of crime start and finish
function setDatetimes(buttonIndex) {
  // set time crime initiated
  setOfCrime[buttonIndex].datetimeCrimeStarted = dayjs();
  completionMS = setOfCrime[buttonIndex].timeToCompleteInMilliseconds;
  // set time the crime will be completed
  gameState[buttonIndex].datetimeCrimeWillEnd = dayjs().add(dayjs(completionMS, "millisecond"));
}

function hasCrimeFinished(structOfCrimes, buttonIndex) {
  if (gameState[buttonIndex].state == 1) {
    if (dayjs().isAfter(gameState[buttonIndex].datetimeCrimeWillEnd)) {
      gameState[buttonIndex].state = 2;
      refreshInfoPanel(globalButtonIndex);
    }
  }
}

// this takes any crime out of state 3 (not ready) if it's noto is high enough
// and will have been called with a foreach
function checkNotoRequired(structOfCrimes, crimeIndex) {
  if (gameState[crimeIndex].state == 3 && noto >= setOfCrime[crimeIndex].requiredNoto) {
    gameState[crimeIndex].state = 0;
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
  document.getElementById("currentTimeID").innerHTML = "its " + dayjs().format("YY.MM.DD HH:mm:ss");
  // refresh info on each button
  setOfCrime.forEach(refreshSingleButton);
  setOfCrime.forEach(hasCrimeFinished);
  // and set up the refresh loop to start next repaint of the frame
  window.requestAnimationFrame(refreshLoop);
}

function readCookies() {
  tempnoto = Cookies.get("noto");
  if (tempnoto == undefined) {
    console.log("no money or noto cookies");
  } else {
    noto = parseInt(Cookies.get("noto"));

    money = parseInt(Cookies.get("money"));

    for (let cookieReadIndex = 0; cookieReadIndex < setOfCrime.length; cookieReadIndex++) {
      tempCookieReadout = Cookies.get("'cookie" + cookieReadIndex + "'");
      if (tempCookieReadout == undefined) {
        console.log("no gamestate cookies");
      } else {
        arrayFromTempCookieReadout = tempCookieReadout.split(";");
        console.log("cookie read: ", arrayFromTempCookieReadout);
        gameState[cookieReadIndex].state = parseInt(arrayFromTempCookieReadout[0]);
        gameState[cookieReadIndex].numberTimesCommitted = parseInt(arrayFromTempCookieReadout[1]);
        gameState[cookieReadIndex].datetimeCrimeWillEnd = parseInt(arrayFromTempCookieReadout[2]);
      }
    }
    newLogText = Cookies.get("log");
    document.getElementById("logID").innerHTML = newLogText;
  }
}

function setCookie(buttonIndex) {
  // always refresh money and noto
  Cookies.set("noto", noto, { expires: 365 });
  Cookies.set("money", money, { expires: 365 });
  // set the cookiename
  cookieName = "'cookie" + buttonIndex + "'";
  console.log(cookieName);
  cookieContent = gameState[buttonIndex].state + ";" + gameState[buttonIndex].numberTimesCommitted + ";" + gameState[buttonIndex].datetimeCrimeWillEnd;
  console.log(cookieContent);
  Cookies.set(cookieName, cookieContent, { expires: 365 });
  Cookies.set("log", newLogText);
}

// start up the log
addToLog(dayjs().format("YY.MM.DD HH:mm") + " the crimespree has begun");

// get values from prior usage
readCookies();

// make the crime buttons
setOfCrime.forEach(createCrimeButtons);

// call this initially to set initial crime state to 0
setOfCrime.forEach(checkNotoRequired);

// of course you can cheat lol ;)
//cheatCodeKeyboardEvent = new KeyboardEvent("keydown");
//document.addEventListener("keydown", () => cheat());

// assign eventlistener to the go button
document.getElementById("infoID").textContent = "LETS GO";
document.getElementById("buttonLocationID").addEventListener("click", () => commitCrime());
// finally we initiate the refreshLoop
window.requestAnimationFrame(refreshLoop);
