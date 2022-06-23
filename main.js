//globals
var globalButtonIndex = 0;
const logLength = 20;
var logOfCrimes = new Array(logLength).fill("");
// playerNoto = 0;
// playerMoney = 0;
var accumDataText = "";
versionNumber = "0.932si";
versionCode = "inventory branch";

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
  requiredInventory,
  gainedInventory,
  gainedInventoryMultiplier
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
  this.requiredInventory = requiredInventory;
  this.gainedInventory = gainedInventory;
  this.gainedInventoryMultiplier = gainedInventoryMultiplier;
}
// this creates an array "setOfCrime" that contains different crimes
var setOfCrime = [
  new structOfCrimes("loit", "Loitering", 0, 0, 0, 2, 12, 0, 0, 0, 0),
  new structOfCrimes("skate", "Skateboarding", 0, 10, 0, 5, 45, 0, ["skate"], 0, 0),
  new structOfCrimes("xloit", "Extreme Loitering", 0, 0, 0, 200, 60, 168, ["belt"], 0, 0),
  new structOfCrimes("stealw", "Stealing Walrus", 0, 100, 0, 200, 0, 0, 0, 0, 0),
  new structOfCrimes("walrus", "Transporting a Walrus without a Licence", 200, 100, 300, 200, 0, 3, 0, 0, 0),
  new structOfCrimes("scorp", "Enhancing a Scorpion", 150, 35, 200, 100, 3, 0, ["scorp", "masc"], "escorp", 1),
];

// struct for accumulated data (I expect to add more as time goes on)
function structOfGameState(state, numberTimesCommitted, datetimeCrimeWillEnd, datetimeCrimeStarted) {
  // state refers to where the crime is at
  // 0 = ready to run
  // 1 = running
  // 2 = completed but haven't collected resources
  // 3 = unavailable (need more noto)
  this.state = state;
  this.numberTimesCommitted = numberTimesCommitted;
  this.datetimeCrimeWillEnd = datetimeCrimeWillEnd;
  this.datetimeCrimeStarted = datetimeCrimeStarted;
}

function structOfInventoryItems(inventoryCode, inventoryName, quantityHeld) {
  this.inventoryCode = inventoryCode;
  this.inventoryName = inventoryName;
  this.inventoryQuantityHeld = quantityHeld;
}

function structOfPlayer(playerNoto, playerMoney, playerSTR, playerLUCK, playerINT, playerCHARM) {
  this.noto = playerNoto;
  this.money = playerMoney;
  this.STR = playerSTR;
  this.LUCK = playerLUCK;
  this.INT = playerINT;
  this.CHARM = playerCHARM;
}

var player = new structOfPlayer(50, 500, 0, 0, 0, 0);

var playerInventory = [
  new structOfInventoryItems("cam", "Big Camera", 0),
  new structOfInventoryItems("skate", "Skateboard", 0),

  new structOfInventoryItems("belt", "Brown Leather Belt", 1),
  new structOfInventoryItems("scorp", "Sporpion", 1),
  new structOfInventoryItems("escorp", "Enhanced Scorpion", 0),
  new structOfInventoryItems("bag", "Cloth Bag", 0),
  new structOfInventoryItems("lockp", "Lock Picking Set", 0),
  new structOfInventoryItems("knife", "Big Knife", 0),
  new structOfInventoryItems("calc", "Calculator", 0),
  new structOfInventoryItems("prot", "Protractor", 0),
  new structOfInventoryItems("uran", "Uranium", 0),
  new structOfInventoryItems("hazm", "Hazmat Suit", 0),
  new structOfInventoryItems("masc", "Mascara", 1),
  new structOfInventoryItems("walr", "Walrus", 1),
];
var playerInventoryLength = playerInventory.length;

function returnInventoryIndex(inventoryCode) {
  for (let i = 0; i < playerInventoryLength; i++) {
    if (inventoryCode == playerInventory[i].inventoryCode) {
      return i;
    }
  }
  return -1;
}

var textAboutCrime;

// initialise the accumulated data array
var gameState = new Array(setOfCrime.length);
// use a for loop to fill them, initialise them with state three so
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
  player.noto += setOfCrime[buttonIndex].notoEarned;
  player.money += setOfCrime[buttonIndex].moneyEarned;
  addToLog(setOfCrime[buttonIndex].name + " committed, " + setOfCrime[buttonIndex].notoEarned + " noto & " + setOfCrime[buttonIndex].moneyEarned + " $ earned");
  // set the crime back to ready
  gameState[buttonIndex].state = 0;
  //update accumulated data
  gameState[buttonIndex].numberTimesCommitted += 1;

  addToInventoryCode(setOfCrime[buttonIndex].gainedInventory, setOfCrime[buttonIndex].gainedInventoryMultiplier);
  //update cookies
  setCookie(buttonIndex);

  // refresh the noto requireds
  setOfCrime.forEach(checkNotoRequired);
  updateCriminalStatus();
}

function refreshInfoPanel(buttonIndex) {
  // unselect other buttons
  document.getElementById("statButtonID").setAttribute("state", "uselected");
  document.getElementById("invButtonID").setAttribute("state", "uselected");

  //
  document.getElementById("infotextID").setAttribute("state", "crimeSelected");
  document.getElementById("buttonAndTitleWrapperID").setAttribute("state", "crimeSelected");

  // work on the assumption that the button index passed is the msot recently pressed button
  switch (gameState[buttonIndex].state) {
    //
    // case 0 means is ready to go but hasn't been done

    case 0:
      //var newInfoTitle = setOfCrime[buttonIndex].name;

      var newInfoText = "<h1>" + setOfCrime[buttonIndex].name + "</h1><br><br>REQUIRED:<br><br>" + setOfCrime[buttonIndex].requiredNoto + "N<br>";
      if (setOfCrime[buttonIndex].cost > 0) {
        newInfoText += setOfCrime[buttonIndex].cost + "$";
      }

      let tempInventoryText = generateInventoryNeededText(buttonIndex);
      tempInventoryText += generateInventoryGainedText(buttonIndex);
      newInfoText += generateGameStateDataText(buttonIndex) + tempInventoryText;

      break;
    //
    // case 1 means activelyt committing
    case 1:
      //var newInfoTitle = setOfCrime[buttonIndex].name;

      var newInfoText =
        "<h1>" +
        setOfCrime[buttonIndex].name +
        "</h1><br>" +
        "committing until<br>" +
        dayjs(gameState[buttonIndex].datetimeCrimeWillEnd).format("DD/MM/YY HH:mm:ss" + "<br>");
      timeUntilComplete = dayjs(gameState[buttonIndex].datetimeCrimeWillEnd).diff(dayjs());
      formattedTimehuman = dayjs.duration(timeUntilComplete).humanize(true);
      newInfoText += "<br>It'll be completed<br>" + formattedTimehuman;
      // add text with accumulated data
      newInfoText += generateGameStateDataText(buttonIndex);
      //updateGoButton("COMMITTING");
      break;
    //
    // case 2 means it's completed and waiting to be collected
    case 2:
      // var newInfoTitle = setOfCrime[buttonIndex].name;
      var newInfoText = "<h1>" + setOfCrime[buttonIndex].name + "</h1><br>" + "and it's been done<br>praise the lord";
      //updateGoButton("CRIMEGRATULATIONS");
      break;
    //
    // case three means unavailable yet
    case 3:
      var newInfoText = setOfCrime[buttonIndex].requiredNoto + " NOTORIETY required<br>TO UNLOCK";
    //updateGoButton("U NEED 2 COMMIT MORE CRIME");
  }
  //document.getElementById("infoID").innerHTML = newInfoTitle;
  document.getElementById("infotextID").innerHTML = newInfoText;
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
      formattedTime = "";
      timeUntilComplete = dayjs.duration(dayjs(gameState[buttonIndex].datetimeCrimeWillEnd).diff(dayjs()));
      timeUntilComplete.days = timeUntilComplete.format("D");
      timeUntilComplete.hours = timeUntilComplete.format("HH");
      timeUntilComplete.minutes = timeUntilComplete.format("mm");
      timeUntilComplete.seconds = timeUntilComplete.format("ss");
      if (timeUntilComplete.days > 0) {
        formattedTime += timeUntilComplete.days + "d " + timeUntilComplete.hours + ":";
      } else if (timeUntilComplete.hours > 0) {
        formattedTime += timeUntilComplete.hours + ":";
      }
      formattedTime += timeUntilComplete.minutes + ":" + timeUntilComplete.seconds;
      refreshedButtonText = setOfCrime[buttonIndex].name + "<br><br>" + formattedTime;
      // set the class of the element to get it to go blue
      document.getElementById(setOfCrime[buttonIndex].buttonid).setAttribute("state", "running");
      break;
    // case 2 means complete and ready to collect goods
    case 2:
      refreshedButtonText = setOfCrime[buttonIndex].name + " complete<br>collect reward";
      document.getElementById(setOfCrime[buttonIndex].buttonid).setAttribute("state", "complete");
      break;
    // case 3 means not enough notoriety to see
    case 3:
      refreshedButtonText = "COMMIT MORE CRIME";
  }
  document.getElementById(setOfCrime[buttonIndex].buttonid).innerHTML = refreshedButtonText;
}

function generateGameStateDataText(buttonIndex) {
  localNumberTimesCommitted = gameState[buttonIndex].numberTimesCommitted;
  if (localNumberTimesCommitted < 1) {
    accumDataText = "<br><br>";
  } else {
    accumDataText = "<br><br>YOU'VE COMMITTED THIS CRIME ";
    if (localNumberTimesCommitted == 1) {
      accumDataText += "ONCE";
    } else if (localNumberTimesCommitted == 2) {
      accumDataText += "TWICE";
    } else if (localNumberTimesCommitted == 3) {
      accumDataText += "THRICE";
    } else {
      accumDataText += localNumberTimesCommitted + " TIMES";
    }
    accumDataText +=
      "<br>earning:<br>" +
      setOfCrime[buttonIndex].notoEarned * localNumberTimesCommitted +
      " NOTORIETY<br>" +
      setOfCrime[buttonIndex].moneyEarned * localNumberTimesCommitted +
      " $<BR>AND SPENT<br> ";
    // generate some duration values
    timeSpentDoingCrime = dayjs.duration(setOfCrime[buttonIndex].timeToCompleteInMilliseconds * localNumberTimesCommitted, "millisecond");
    timeSpentDoingCrime.days = parseInt(timeSpentDoingCrime.format("DD"));
    timeSpentDoingCrime.hours = parseInt(timeSpentDoingCrime.format("HH"));
    timeSpentDoingCrime.minutes = parseInt(timeSpentDoingCrime.format("mm"));
    timeSpentDoingCrime.seconds = parseInt(timeSpentDoingCrime.format("ss"));
    timeSpentDoingCrime.weeks = parseInt(timeSpentDoingCrime.asWeeks());
    // long ass series of if statements to make for a tidy output
    // maybe could have made a function but idk
    // check for days (and only display if >0)
    if (timeSpentDoingCrime.weeks > 0) {
      if (timeSpentDoingCrime.weeks == 1) {
        accumDataText += timeSpentDoingCrime.weeks + " week<br>";
      } else {
        accumDataText += timeSpentDoingCrime.weeks + " weeks<br>";
      }
    }
    // check for days (and only display if >0)
    if (timeSpentDoingCrime.days > 0) {
      if (timeSpentDoingCrime.days == 1) {
        accumDataText += timeSpentDoingCrime.days + " day<br>";
      } else {
        accumDataText += timeSpentDoingCrime.days + " days<br>";
      }
    }
    // check for hours (and only display if >0)
    if (timeSpentDoingCrime.hours > 0) {
      if (timeSpentDoingCrime.hours == 1) {
        accumDataText += timeSpentDoingCrime.hours + " hours<br>";
      } else {
        accumDataText += timeSpentDoingCrime.hours + " hours<br>";
      }
    }
    // check for minutes (and only display if >0)
    if (timeSpentDoingCrime.minutes > 0) {
      if (timeSpentDoingCrime.minutes == 1) {
        accumDataText += timeSpentDoingCrime.minutes + " minute<br>";
      } else {
        accumDataText += timeSpentDoingCrime.minutes + " minutes<br>";
      }
    }
    // check for seconds (and only display if >0)
    if (timeSpentDoingCrime.seconds > 0) {
      if (timeSpentDoingCrime.seconds == 1) {
        accumDataText += timeSpentDoingCrime.seconds + " second<br>";
      } else {
        accumDataText += timeSpentDoingCrime.seconds + " seconds<br>";
      }
    }
    accumDataText += "doing so";

    //dayjs.duration(setOfCrime[buttonIndex].timeToCompleteInMilliseconds * gameState[buttonIndex].numberTimesCommitted, "millisecond").format("DD HH:mm:ss") +" DOING SO";
  }
  return accumDataText;
}

function updateGoButton(newText, buttonState) {
  if (buttonState == undefined || buttonState == NaN) {
    buttonState = "normal";
  }
  document.getElementById("buttonLocationID").innerHTML = newText;
  document.getElementById("buttonLocationID").setAttribute("state", buttonState);
}
//
//
// starts crime
function commitCrime(buttonIndex) {
  // this is just laziness lol
  buttonIndex = globalButtonIndex;
  tempNumber = 0;
  let arrayOfTempNumber = new Array();
  //is the crime ready to go?
  if (gameState[buttonIndex].state == 0) {
    // can the player afford it?
    if (player.money >= setOfCrime[buttonIndex].cost) {
      // ok go ahead commit crimes
      //check if player has necessary inventory
      if (setOfCrime[buttonIndex].requiredInventory == 0) {
        console.log("inventory==0");
      } else {
        //check for inventory
        if (setOfCrime[buttonIndex].requiredInventory.length > 1) {
          for (let i = 0; i < setOfCrime[buttonIndex].requiredInventory.length; i++) {
            arrayOfTempNumber[i] = checkQuantityOfInventoryCode(setOfCrime[buttonIndex].requiredInventory[i]);
            if (arrayOfTempNumber[i] == 0) {
              document.getElementById("infotextID").innerHTML =
                "YOU NEED<br>" + getInventoryNameFromInventoryCode(setOfCrime[buttonIndex].requiredInventory[i]);
              return;
            }
          }
          // it should have returned from this function if it came across a 0 hence
          // if the code gets here, it's all 1 or more
          tempNumber = 1;
        } else {
          tempNumber = checkQuantityOfInventoryCode(setOfCrime[buttonIndex].requiredInventory);
          if (tempNumber == 0) {
            document.getElementById("infotextID").innerHTML = "YOU NEED<br>" + getInventoryNameFromInventoryCode(setOfCrime[buttonIndex].requiredInventory);
            return;
          }
        }
        //
        if (tempNumber > 0) {
          removeItemsFromInventory(buttonIndex);
        }
      }
      console.log("player can afford");
      setDatetimes(buttonIndex);
      gameState[buttonIndex].state = 1;
      // send message to log
      logEntry = setOfCrime[buttonIndex].name + " will finish at: <br>" + dayjs(gameState[buttonIndex].datetimeCrimeWillEnd).format("DD/MM/YY HH:mm:ss");
      refreshSingleButton("", buttonIndex);
      addToLog(logEntry);
      player.money -= setOfCrime[buttonIndex].cost;

      // once new times have been set and money taken away, update the cookie so if refresh happens during a cookie countdown it's still happening
      setCookie(buttonIndex);
      refreshInfoPanel(globalButtonIndex);
    } else {
      document.getElementById("infotextID").innerHTML = "U CANNOT AFORD";
    }
  }
}
//refreshInfoPanel(globalButtonIndex);

function removeItemsFromInventory(buttonIndex) {
  if (setOfCrime[buttonIndex].requiredInventory.length > 1) {
    for (let i = 0; i < setOfCrime[buttonIndex].requiredInventory.length; i++) {
      addToInventoryCode(setOfCrime[buttonIndex].requiredInventory[i], -1);
    }
  }
  // it should have returned from this function if it came across a 0 hence
  // if the code gets here, it's all 1 or more
  else {
    addToInventoryCode(setOfCrime[buttonIndex].requiredInventory, -1);
  }
}

// sets dates and times of crime start and finish
function setDatetimes(buttonIndex) {
  // set time crime initiated
  gameState[buttonIndex].datetimeCrimeStarted = dayjs();
  completionMS = setOfCrime[buttonIndex].timeToCompleteInMilliseconds;
  // set time the crime will be completed
  gameState[buttonIndex].datetimeCrimeWillEnd = dayjs().add(dayjs(completionMS, "millisecond"));
}

function hasCrimeFinished(structOfCrimes, buttonIndex) {
  if (gameState[buttonIndex].state == 1) {
    if (dayjs().isAfter(gameState[buttonIndex].datetimeCrimeWillEnd)) {
      gameState[buttonIndex].state = 2;
      // this has to point to the global button index, because this
      // function is called from a foreach and cycles through each
      // crime to see if it's finished, but the panel
      // should stay on the selected crime button, which
      // the global button index points to
      // it could probably be set to only update if
      // button index == global button index but lol
      refreshInfoPanel(globalButtonIndex);
    }
  }
}

// this takes any crime out of state 3 (not ready) if it's noto is high enough
// and will have been called with a foreach
function checkNotoRequired(structOfCrimes, crimeIndex) {
  if (gameState[crimeIndex].state == 3 && player.noto >= setOfCrime[crimeIndex].requiredNoto) {
    gameState[crimeIndex].state = 0;
  }
}

function generateInventoryNeededText(buttonIndex) {
  //reset return values
  tempReturnText = "";
  // if it's empty just return nothing
  if ((setOfCrime[buttonIndex].requiredInventory == "") | (setOfCrime[buttonIndex].requiredInventory == 0)) {
    console.log("no need to return inventory");
    return tempReturnText;
  }

  //cycle thru the array.
  if (setOfCrime[buttonIndex].requiredInventory.length == 1) {
    tempReturnText = getInventoryNameFromInventoryCode(setOfCrime[buttonIndex].requiredInventory);
  } else {
    for (let i = 0; i < setOfCrime[buttonIndex].requiredInventory.length; i++) {
      tempReturnText += getInventoryNameFromInventoryCode(setOfCrime[buttonIndex].requiredInventory[i]) + "<br>";
    }
  }
  //   console.log("required text");
  //   console.log(setOfCrime[buttonIndex].requiredInventory);
  return tempReturnText;
}

function generateInventoryGainedText(buttonIndex) {
  if ((setOfCrime[buttonIndex].gainedInventory == "") | (setOfCrime[buttonIndex].gainedInventory == 0)) {
    return "";
  }
  tempReturnText =
    "<br>Gaining you:<br><br>" +
    setOfCrime[buttonIndex].gainedInventoryMultiplier +
    " x " +
    getInventoryNameFromInventoryCode(setOfCrime[buttonIndex].gainedInventory);

  return tempReturnText;
}

//given the code of an inventory item, checks and returns quantity
function checkQuantityOfInventoryCode(inventoryCodeToCheck) {
  // in this function I cycle through the player inventory
  // and when get to that point, check and return the value
  for (let i = 0; i < playerInventoryLength; i++) {
    if (inventoryCodeToCheck == playerInventory[i].inventoryCode) {
      return playerInventory[i].inventoryQuantityHeld;
    }
  }
  return -1;
}

function getInventoryNameFromInventoryCode(inventoryCodeToCheck) {
  for (let i = 0; i < playerInventoryLength; i++) {
    if (inventoryCodeToCheck == playerInventory[i].inventoryCode) {
      return playerInventory[i].inventoryName;
    }
  }

  return -1;
}

function getIndexOfInventoryCode(inventoryCodeToCheck) {
  for (let i = 0; i < playerInventoryLength; i++) {
    if (inventoryCodeToCheck == playerInventory[i].inventoryCode) {
      return i;
    }
  }
  return -1;
}

function addToInventoryCode(inventoryCodeToAddTo, inventoryItemQuantityToAdd) {
  for (let i = 0; i < playerInventoryLength; i++) {
    if (inventoryCodeToAddTo == playerInventory[i].inventoryCode) {
      playerInventory[i].inventoryQuantityHeld += inventoryItemQuantityToAdd;
      setInventoryCookie(inventoryCodeToAddTo);
      return 1;
    }
  }
  return -1;
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
  updatedBannerHTML = player.noto + "N<br>" + player.money + "$";
  document.getElementById("statsBannerID").innerHTML = updatedBannerHTML;
}

function updateCriminalStatus() {
  newStatusText = "criminal status:<br>";
  // remember this falls backwards from highest rank down
  // thru the if/else branches until it finds one it meets
  if (player.noto > 10) {
    newStatusText += "tripped over";
  } else if (player.noto >= 0) {
    newStatusText += "ignored";
  }
  document.getElementById("criminalStatusID").innerHTML = newStatusText;
}

function inventoryTab() {
  //unselect other button
  document.getElementById("statButtonID").setAttribute("state", "uselected");

  document.getElementById("infotextID").setAttribute("state", "inventorySelected");
  document.getElementById("buttonAndTitleWrapperID").setAttribute("state", "inventorySelected");
  document.getElementById("invButtonID").setAttribute("state", "selected");

  let tempInventoryTabText = "YOU HAVE:<br><br>";

  for (let i = 0; i < playerInventoryLength; i++) {
    if (playerInventory[i].inventoryQuantityHeld > 0) {
      tempInventoryTabText += "" + playerInventory[i].inventoryQuantityHeld + " x " + playerInventory[i].inventoryName + "<br>";
    }
  }

  document.getElementById("infotextID").innerHTML = tempInventoryTabText;
}

function statsTab() {
  //unselect other button
  document.getElementById("invButtonID").setAttribute("state", "uselected");

  document.getElementById("infotextID").setAttribute("state", "statsSelected");
  document.getElementById("buttonAndTitleWrapperID").setAttribute("state", "statsSelected");
  document.getElementById("statButtonID").setAttribute("state", "selected");

  let tempStatsTabText = "";
  tempStatsTabText += "&nbsp&nbspSTR: " + player.STR + "<br>";
  tempStatsTabText += "&nbspLUCK: " + player.LUCK + "<br>";
  tempStatsTabText += "&nbsp&nbspINT: " + player.INT + "<br>";
  tempStatsTabText += "CHARM: " + player.CHARM + "<br>";

  document.getElementById("infotextID").innerHTML = tempStatsTabText;
}
function cheat(keyPressKey) {
  player.noto += 2;
  player.money += 1;
  updatedBannerHTML;
  setOfCrime.forEach(checkNotoRequired);
}

// called whenever a crime is started, or completed,
// and will always update the money / noto
// and updates the cookie related to the crime
function setCookie(buttonIndex) {
  // always refresh money and noto
  // Cookies.set("player.noto", player.noto, { expires: 365 });
  // Cookies.set("player.money", player.money, { expires: 365 });
  // console.log("wrote to cookie: " + player.noto + "N&" + player.money + "$");
  // set the cookiename
  cookieName = "'cookie" + buttonIndex + "'";
  // set the cookie contnent
  cookieContent =
    gameState[buttonIndex].state +
    ";" +
    gameState[buttonIndex].numberTimesCommitted +
    ";" +
    gameState[buttonIndex].datetimeCrimeWillEnd +
    ";" +
    gameState[buttonIndex].datetimeCrimeStarted;
  Cookies.set(cookieName, cookieContent, { expires: 365 });
  console.log("wrote to cookie: " + cookieName + "," + cookieContent);
  setPlayerCookie();
}
// run at the start of a session, and updates the certain gamestate variables
function readCookies() {
  for (let cookieReadIndex = 0; cookieReadIndex < setOfCrime.length; cookieReadIndex++) {
    tempCookieReadout = Cookies.get("'cookie" + cookieReadIndex + "'");
    if (tempCookieReadout == undefined) {
      console.log("no cookie for crime number: " + cookieReadIndex);
    } else {
      arrayFromTempCookieReadout = tempCookieReadout.split(";");
      console.log("cookie read: ", arrayFromTempCookieReadout);
      gameState[cookieReadIndex].state = parseInt(arrayFromTempCookieReadout[0]);
      gameState[cookieReadIndex].numberTimesCommitted = parseInt(arrayFromTempCookieReadout[1]);
      gameState[cookieReadIndex].datetimeCrimeWillEnd = parseInt(arrayFromTempCookieReadout[2]);
      gameState[cookieReadIndex].datetimeCrimeStarted = parseInt(arrayFromTempCookieReadout[3]);
    }
  }
  newLogText = Cookies.get("log");
  document.getElementById("logID").innerHTML = newLogText;
  buttonIndex = 0;
}

function setInventoryCookie(inventoryCodeToAddTo) {
  inventoryIndex = getIndexOfInventoryCode(inventoryCodeToAddTo);

  if (inventoryIndex == -1) {
    console.log("illegal inventory name requested for cookie update: " + inventoryCodeToAddTo);
  } else {
    cookieName = "'inventoryCookie" + inventoryIndex + "'";
    cookieValue = checkQuantityOfInventoryCode(inventoryCodeToAddTo);
    Cookies.set(cookieName, cookieValue);
    console.log("wrote to inventory cookie: " + cookieName + " " + cookieValue);
  }
}

function readInventoryCookies() {
  for (let i = 0; i < playerInventoryLength; i++) {
    tempCookieReadout = Cookies.get("'inventoryCookie" + i + "'");

    if (tempCookieReadout == undefined) {
      console.log("no cookie for inventory index: " + "'inventoryCookie" + i + "'");
    } else {
      playerInventory[i].inventoryQuantityHeld = tempCookieReadout;
    }
  }
}

// this specifically sets the cookie that holds player data
function setPlayerCookie() {
  let playerCookieData = player.noto + ";" + player.money + ";" + player.STR + ";" + player.LUCK + ";" + player.LUCK + ";" + player.CHARM;
  Cookies.set("playerData", playerCookieData);
  console.log("wrote to cookies: " + playerCookieData);
}

function readPlayerCookie() {
  let tempPlayerDataCookieReadout = Cookies.get("playerData");
  if (tempPlayerDataCookieReadout != undefined) {
    console.log("player data cookie readout: " + tempPlayerDataCookieReadout);

    let arrayFromPlayerDataCookieReadout = tempPlayerDataCookieReadout.split(";");
    player.Noto = parseInt(arrayFromPlayerDataCookieReadout[0]);
    player.Money = parseInt(arrayFromPlayerDataCookieReadout[1]);
    player.STR = parseInt(arrayFromPlayerDataCookieReadout[2]);
    player.LUCK = parseInt(arrayFromPlayerDataCookieReadout[3]);
    player.INT = parseInt(arrayFromPlayerDataCookieReadout[4]);
    player.CHAR = parseInt(arrayFromPlayerDataCookieReadout[5]);
  } else {
    console.log("no player data cookies");
  }
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

// start up the log
addToLog(dayjs().format("YY.MM.DD HH:mm") + " the crimespree has begun");

// get values from prior usage
readPlayerCookie();

readCookies();

readInventoryCookies();

// make the crime buttons
setOfCrime.forEach(createCrimeButtons);

// call this initially to set initial crime state to 0
setOfCrime.forEach(checkNotoRequired);

updateCriminalStatus();

document.getElementById("titleID").innerHTML = "crime committer<br>" + versionNumber + " " + versionCode + " <br> made by wfproductionsnz ";

// of course you can cheat lol ;)
//cheatCodeKeyboardEvent = new KeyboardEvent("keydown");
//document.addEventListener("keydown", () => cheat());

// assign eventlistener to the go button
//document.getElementById("infoID").textContent = "LETS GO";
//document.getElementById("buttonLocationID").addEventListener("click", () => commitCrime());

document.getElementById("infotextID").setAttribute("state", "crimeSelected");
document.getElementById("buttonAndTitleWrapperID").setAttribute("state", "crimeSelected");

document.getElementById("invButtonID").addEventListener("click", () => inventoryTab());
document.getElementById("statButtonID").addEventListener("click", () => statsTab());

// finally we initiate the refreshLoop
window.requestAnimationFrame(refreshLoop);
