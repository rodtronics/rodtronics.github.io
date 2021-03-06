// const CSV = require("./scripts/csv");

//globals
var globalButtonIndex = 0;
const logLength = 20;
var logOfCrimes = new Array(logLength).fill("");
// playerNoto = 0;
// playerMoney = 0;
var accumDataText = "";
versionNumber = "v0.9.23";
versionCode = "the hood";
noticeState = false;
override = false;
arrayOfInventoryButtons = [];
var currentNeighbourhoodTabIndex = 0;

//these functions are initialistion based

function structOfPlayer(playerNoto, playerMoney) {
    this.noto = playerNoto;
    this.money = playerMoney;
}

// this is where you put in start values
var player = new structOfPlayer(0, 50);

// this function stores information in itself, and defines our main object
function structOfCrimes(
    crimeID,
    name,
    cost,
    requiredNoto,
    moneyEarned,
    notoEarned,
    timeToCompleteInSeconds,
    timeToCompleteInHours,
    requiredInventory,
    gainedInventory,
    gainedInventoryMultiplier,
    neighbourhoodTabIndex
) {
    this.crimeID = crimeID;
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
    this.neighbourhoodTabIndex = neighbourhoodTabIndex;
}
// this creates an array "setOfCrime" that contains different crimes
var setOfCrime = [
    new structOfCrimes("jaywalk","jaywalking",0,0,0,3,7,0,0,0,0,0),
new structOfCrimes("jayr","jayrunning",0,0,0,4,4,0,0,0,0,1),
new structOfCrimes("candys","candy snatching",0,0,0,20,61,0,0,0,0,2),
new structOfCrimes("steasocks","stealing someones socks",0,0,0,100,79,0,0,0,0,3),
new structOfCrimes("stealpur","stealing a rich ladies purse",0,0,250,1000,63,0,0,0,0,4),
new structOfCrimes("selldrugs","selling infamous drugs",0,0,1250,19000,96,0,0,0,0,5),
new structOfCrimes("tagfe","tagging a short fence with a crayon",0,0,0,2,2000,0,0,0,0,0),
new structOfCrimes("tagtf","tagging a taller fence",0,0,0,12,1985,0,0,0,0,1),
new structOfCrimes("grafloc","local graffiti",0,0,0,125,1763,0,0,0,0,2),
new structOfCrimes("hijack","hijacking a mobility scooter",0,0,0,1200,1759,0,0,0,0,3),
new structOfCrimes("shoesteal","stealing someones shoes",0,0,0,15000,1862,0,0,0,0,4),
new structOfCrimes("fakedonu","selling fake donuts",0,0,0,175000,1502,0,0,0,0,5),
new structOfCrimes("loit","amateur loitering",0,0,0,6,300,0,0,0,0,0),
new structOfCrimes("loitp","power loitering",0,0,0,55,345,68,0,0,0,1),
new structOfCrimes("loitex","extreme loitering",0,0,0,550,26,81,0,0,0,2),
new structOfCrimes("lotpowe","profound loitering",0,0,0,5500,683,60,0,0,0,3),
new structOfCrimes("loitdeath","death loitering",0,0,0,55000,862,54,0,0,0,4),
new structOfCrimes("loitgra","grand loitering",0,0,0,550000,683,80,0,0,0,5),
new structOfCrimes("boitsc","bitcoin scam",0,0,12,110000,0,288,0,0,0,1),
new structOfCrimes("mailord","mail order scam",5,0,37,23,1200,0,0,0,0,0),
new structOfCrimes("catscam","cat scam",0,0,0,0,0,1,0,"cat",1,0),
new structOfCrimes("scarek","scare a kid",0,0,0,3,75,0,0,"skate",0,1),
new structOfCrimes("skate","skateboarding",0,0,0,27,2100,0,["skate"],0,0,0),
];

const wordsAboutCrime = {
    loit: "Loitering is as old as time. Charles Darwin wrote about it in the Origin of Species. a crime used by police across the globe to oppress.",
    skate: "Skateboarding is an artform. an artform with slabs of wood and wheels and if you can do it you're basically cool. if you can't? good luck lol you'll need it",
    xloit: "you waited a very long time for this, and you had no idea how disappointing it was going to be",
    scorp: "scorpions weren't meant for this, and you can tell it's sad. however, it is a killing machine. perhaps it will come in handy one day",
    stealw: "you didn't think it was going to be possible, but when you backed the truck up to the local marine park, the dude we were paying to smuggle a walrus gave you three! what the hell are you going to do with three of these sons of bitches",
    scarek: "so this kid is eating his lunch and you tell him to put the food down and walk away because you were trying to eat his food but he got scared because of how you look and dropped his skateboard",
    walrus: "your cousin needs another walrus but he lives over state lines, and you're prepared to do anything for this walrus loving son of a bitch",
    undies: "it's often wonders what it's like to have brown leather underwear on and it's not half bad",
    bagofs: "you'd heard tales of your older brother doing this to old man jackson down the road. he fell for it every time. now the torch has been passed down and it's you ligthing a bag of dog shit on fire",
    dogshit: "there's this dog down the road and you hate it because it was mean to you once and now you're scared of it and it gives you this sad face and guilt trips you into cleaning up after it",
    buytheif: "a theiftech4000 theivery kit. contains one of everything you'll need for general theivery",
    stealbag: "you sneak into the butchers store and carefully and slowly crawl over the display cabinet. you fall off the top of the cabinet, crashing to the ground. the butcher hears you can comes running from the break room. he sees you on the floor, and you just up and grab a paper bag from the counter as you jump over and run out of the building",
    stealpurse: "this lady is rich but has poor taste and this purse is too ugly to be seen in public, so you borrow it for later",
    stealthief: "using your theiftech4000, you break into the theivery store and steal three more kits",
    wearb: "it's finally time where you can complete your final form, your full body leather outfit. you finally realise why it was so difficult to find leather socks to complete the outfit",
    embez: "carefully you misappropiate some assets entrusted to you",
    forge: "the easiest way to make money is to literally make it. it's not even illegal. you got the blank bank notes and the forgery kit, and you can finally make more money than you've ever seen",
    mintheist: "you need blank bankotes to forge some money, and you suspected correctly, the mint does have them. it was quite easy to break into this place all things considered",
    buycrew: "you need thugs to give you a hand up on a hard day",
    robbook: "you'll never forgive the bookstore for all the drama and hurt it bought onto you. you were embarassed and it smelt weird",
    buyforge: "a few art brushes? you were expecting more",
    jaywalk: "it's walking but where you shouldn't be but it's also a road",
    jwalk: "it's walking but where you shouldn't be but it's also a road",


};

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

var playerInventory = [
    new structOfInventoryItems("cam", "Big Camera", 0),
    new structOfInventoryItems("belt", "Brown Leather Belt", 1),
    new structOfInventoryItems("scorp", "Sporpion", 0),
    new structOfInventoryItems("bag", "Cloth Bag", 0),
    new structOfInventoryItems("lockp", "Lock Picking Set", 0),
    new structOfInventoryItems("knife", "Big Knife", 0),
    new structOfInventoryItems("calc", "Calculator", 0),
    new structOfInventoryItems("prot", "Protractor", 0),
    new structOfInventoryItems("uran", "Uranium", 0),
    new structOfInventoryItems("hazm", "Hazmat Suit", 0),
    new structOfInventoryItems("masc", "Mascara", 0),
    new structOfInventoryItems("thiefk", "Thief Kit", 5),
    new structOfInventoryItems("shoes", "Brown Leather Shoes", 1),
    new structOfInventoryItems("pants", "Brown Leather Pants", 1),
    new structOfInventoryItems("shirt", "Brown Leather Shirt", 1),
    new structOfInventoryItems("undies", "Brown Leather Undies", 0),
    new structOfInventoryItems("trap", "All Purpose Trap", 0),
    new structOfInventoryItems("papbag", "Brown Paper Bag", 0),
    new structOfInventoryItems("lighter", "Cigarette Lighter", 0),
    new structOfInventoryItems("dogshit", "Dog Shit", 0),
    new structOfInventoryItems("skate", "Skateboard", 0),
    new structOfInventoryItems("walr", "Walrus", 0),
    new structOfInventoryItems("bsuit", "Full body brown leather onesie", 0),
    new structOfInventoryItems("cat", "Cat", 0),
    new structOfInventoryItems("socks", "Brown Leather Socks", 0),
    new structOfInventoryItems("bnote", "Blank Bank Notes", 0),
    new structOfInventoryItems("loitb", "Badge for loitering", 0),
    new structOfInventoryItems("forges", "Forgery set", 0),
    new structOfInventoryItems("books", "Just some books", 0),
    new structOfInventoryItems("thugs", "Hired thugs", 0),
];

const wordsAboutInventory = {
    cam: "big ass camera",
    belt: "it's brown and you've owned it for 14 years. it doesn't smell",
};

function structOfNeighbourhoods(tabID, name, notoRequired) {
    this.tabID = tabID;
    this.name = name;
    this.notoRequired = notoRequired;
}

const neighbourhoodTabs = [new structOfNeighbourhoods("loser_tab", "loserton", 0),
    new structOfNeighbourhoods("poundhead_tab", "poundhead", 10),
    new structOfNeighbourhoods("dugtown_tab", "dugtown", 100),
    new structOfNeighbourhoods("castle_tab", "castle rock", 1000),
    new structOfNeighbourhoods("gusta_tab", "bo gusta", 10000),
    new structOfNeighbourhoods("coolrock_tab", "cool rock", 100000),
];

const wordsAboutNeighbourhood = {
    loser_tab: "you grew up in this grimy dank suburb. you're proud to call it home but no one else thinks you should be"
}

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
    gameState[gameStateDataIndex] = new structOfGameState(0, 0, 0);
}

// this function builds the crime windows and places them in the flexbox
function createCrimeButtons(structOfCrimesIterator, buttonIndex) {
    // create a new div that will be added to the flexbox
    var newCrimeButton = document.createElement("button");

    // set it's class and give it a unique id
    newCrimeButton.className = "crime";
    newCrimeButton.id = structOfCrimesIterator.crimeID;

    // create the text that goes in the button
    var newButtonText = structOfCrimesIterator.name;

    // add the text to the div
    newCrimeButton.innerHTML = newButtonText;

    // append the newly created div to the flexbox
    document.getElementById("crimeID").appendChild(newCrimeButton);

    //refreshSingleButton(buttonIndex);

    // add function to the button for when it is clicked
    document.getElementById(structOfCrimesIterator.crimeID).addEventListener("click", () => clickOnCrimeButton(buttonIndex));
    // and a double click tries to commit crime straight away
    document.getElementById(structOfCrimesIterator.crimeID).addEventListener("dblclick", () => doubleClickOnCrimeButton(buttonIndex));
}

function doubleClickOnCrimeButton(buttonIndex) {
    clickOnCrimeButton(buttonIndex);
    commitCrime(buttonIndex);
}

//end of init functions
//
//
// this is called when clicked on inventory tab. unlike crime tabs these are made each time.
function createInventoryButtons(inventoryCode) {
    // check if inventorycode is valid
    // if (getIndexOfInventoryCode() == -1) {
    //   console.log("couldn't create inventory button " + inventoryCode);
    //   return -1;
    // }
    // create a new div that will be added to the flexbox
    var newInventoryButton = document.createElement("button");

    //give it some attributes
    newInventoryButton.className = "inventoryButton";
    newInventoryButton.id = inventoryCode;

    let tempInventoryButtonInnerHTML = checkQuantityOfInventoryCode(inventoryCode) + "x ";

    newInventoryButton.innerHTML = tempInventoryButtonInnerHTML + getInventoryNameFromInventoryCode(inventoryCode);

    // add this button into array so I can clear them later
    //arrayOfInventoryButtons.push(newInventoryButton);

    //add it to the right place
    document.getElementById("infotextID").appendChild(newInventoryButton);

    //add functionality
    document.getElementById(inventoryCode).addEventListener("click", () => clickOnInventoryButton(inventoryCode));
}

function createNeighbourhoodButtons() {
    for (let i = 0; i < neighbourhoodTabs.length; i++) {
        var newNeighbourhoodTabButton = document.createElement("button");

        newNeighbourhoodTabButton.className = "neighbourhood_tab";
        newNeighbourhoodTabButton.id = neighbourhoodTabs[i].tabID;
        newNeighbourhoodTabButton.innerHTML = neighbourhoodTabs[i].name;
        document.getElementById("neighbourhoodTabWrapperID").appendChild(newNeighbourhoodTabButton);
        document.getElementById(neighbourhoodTabs[i].tabID).addEventListener("click", () => clickOnNeighbourhoodTabButton(i));
    }
}

function getNeighbourhoodTabIndexFromCode(neighbourhoodTabCode) {
    for (let i = 0; i < neighbourhoodTabs.length; i++) {
        if (neighbourhoodTabCode == neighbourhoodTabs[i].tabID) {
            return i;
        }
    }
    return -1;
}

function clickOnInventoryButton(inventoryCode) {
    tempWordsAtBottom = wordsAboutInventory[inventoryCode];
    if (tempWordsAtBottom == undefined) {
        tempWordsAtBottom = "it's a " + getInventoryNameFromInventoryCode(inventoryCode);
    }
    updateWordsAtBottom(1, true, tempWordsAtBottom);
}

function createCrimeButtonsForNeighbourhood(neighbourhoodTabIndex) {
    // clear the area
  document.getElementById("crimeID").innerHTML = "";
  
    for (i = 0; i < setOfCrime.length; i++) {
        if (setOfCrime[i].neighbourhoodTabIndex == neighbourhoodTabIndex) {
            createCrimeButtons(setOfCrime[i], i);
        }
    }
}

function clickOnNeighbourhoodTabButton(neighbourhoodTabIndex) {
    // check to see if clicking on current tab
    if (neighbourhoodTabIndex == currentNeighbourhoodTabIndex) {
        displayNotice("you're already there dingus");

        // get words about neighbourhood and display them unless undefined

        tempNeighbourhoodWords = wordsAboutNeighbourhood[neighbourhoodTabs[neighbourhoodTabIndex].tabID];
        if (wordsAboutNeighbourhood == undefined) {
tempNeighbourhoodWords=""        }
        updateWordsAtBottom(0, true, tempNeighbourhoodWords);


        return;
    }
    // check to see if they have enough noto
    if (player.noto >= neighbourhoodTabs[neighbourhoodTabIndex].notoRequired) {
        currentNeighbourhoodTabIndex = neighbourhoodTabIndex;
        tempNeighbourhoodWords = wordsAboutNeighbourhood[neighbourhoodTabs[neighbourhoodTabIndex].tabID];
        if (wordsAboutNeighbourhood != undefined) {
            updateWordsAtBottom(0, true, tempNeighbourhoodWords);


        }
        createCrimeButtonsForNeighbourhood(neighbourhoodTabIndex);
        
        displayNotice("welcome to<br><br>"+ neighbourhoodTabs[neighbourhoodTabIndex].name);

    } else {
      createCrimeButtonsForNeighbourhood(false);
        displayNotice("you're not notorious enough to visit " + neighbourhoodTabs[neighbourhoodTabIndex].name + "<br><br>you need " + neighbourhoodTabs[neighbourhoodTabIndex].notoRequired.toLocaleString() + " N");
    }
}

// this is meant to delete inventory butons but maybe it doesn't matter
function discardInventoryButtons() {
    for (let i = 0; i < playerInventoryLength; i++) {
        if (playerInventory[i].inventoryQuantityHeld > 0) {
            console.log("remove button " + playerInventory[i].inventoryCode);
            document.getElementById(playerInventory[i].inventoryCode).remove();
        }
    }
}

// this function is called when a crime button is clicked
// and largely makes sure the info panel is relevant
function clickOnCrimeButton(buttonIndex) {
    //discardInventoryButtons();
    noticeState = false;

    // set the global button index
    globalButtonIndex = buttonIndex;
    // first off, if they've clicked on it because the crime was ready to reap rewards
    // state of 2 means comple
    if (gameState[buttonIndex].state == 2) {
        successfulCrime(buttonIndex);
    }
    // refresh the panel
    refreshInfoPanel(buttonIndex);
    updateWordsAtBottom(buttonIndex, false, "");
}

// what happens when a crime was successful
function successfulCrime(buttonIndex) {
    player.noto += setOfCrime[buttonIndex].notoEarned;
    player.money += setOfCrime[buttonIndex].moneyEarned;
    addToLogText =
        setOfCrime[buttonIndex].name + " committed<br>you got<br>" + setOfCrime[buttonIndex].notoEarned + " N <br>" + setOfCrime[buttonIndex].moneyEarned + " $";
    // addToLogText += generateInventoryGainedText(buttonIndex);
    addToLog(addToLogText);
    // set the crime back to ready
    gameState[buttonIndex].state = 0;
    //update accumulated data
    gameState[buttonIndex].numberTimesCommitted += 1;

    addToInventoryCode(setOfCrime[buttonIndex].gainedInventory, setOfCrime[buttonIndex].gainedInventoryMultiplier);
    //update cookies
    setCookie(buttonIndex);

    // refresh the noto requireds
    //setOfCrime.forEach(checkNotoRequired);
    //updateCriminalStatus();
    noticeHTML = "YOU JUST GOT:<br><br>" + setOfCrime[buttonIndex].notoEarned + " N<br>" + setOfCrime[buttonIndex].moneyEarned + " $<br>";
    noticeHTML += generateInventoryGainedText(buttonIndex);

    // addToLog(noticeHTML);
    displayNotice(noticeHTML);
    // console.log(noticeHTML);
}

function refreshInfoPanel(buttonIndex) {
    let usedVariable = false;
    let tempInventoryText = "";

    if (noticeState == true) {
        return;
    }
    deselectInventoryAndStats();
    //
    document.getElementById("infotextID").setAttribute("state", "crimeSelected");
    document.getElementById("buttonAndTitleWrapperID").setAttribute("state", "crimeSelected");

    var newInfoText = "";
    var endInfoText = "";

    // initially check if it's still locked
    if (gameState[buttonIndex].state == 3) {
        newInfoText = setOfCrime[buttonIndex].requiredNoto + " NOTORIETY required<br>TO UNLOCK";
    } else {
        newInfoText = "<h1>" + setOfCrime[buttonIndex].name + "</h1><br>";

        switch (gameState[buttonIndex].state) {
            // state 0 means good to go
            case 1:
                newInfoText += "in progress<br><br>";
                usedVariable = true;
                break;
            case 2:
                newInfoText += "completed<br><br>";
                break;
        }

        newInfoText += "<br>REQUIRED:<br><br>"; // + setOfCrime[buttonIndex].requiredNoto + " N<br>";
        if (setOfCrime[buttonIndex].cost > 0) {
            newInfoText += setOfCrime[buttonIndex].cost.toLocaleString() + " $<br>";
        }
        // start the text that discusses needed inventory
        if (usedVariable == true) {
            tempInventoryText += "<br><br>used:<br><br>";
        }
        tempInventoryText += generateInventoryNeededText(buttonIndex);

        let tempInventoryGainedText = "";
        if (setOfCrime[buttonIndex].moneyEarned > 0) {
            tempInventoryGainedText += setOfCrime[buttonIndex].moneyEarned.toLocaleString() + " $<br>";
        }


        tempInventoryGainedText += setOfCrime[buttonIndex].notoEarned.toLocaleString() + " N<br>";
        tempInventoryGainedText += generateInventoryGainedText(buttonIndex);
        if (tempInventoryGainedText != "") {
            tempInventoryText += "<br><br><br>gaining you:<br><br>" + tempInventoryGainedText;
        }
        // newInfoText += "<br>";
        newInfoText += tempInventoryText;
    }
    document.getElementById("infotextID").innerHTML = newInfoText;
}

function deselectInventoryAndStats() {
    // unselect other buttons
    document.getElementById("statButtonID").setAttribute("state", "uselected");
    document.getElementById("invButtonID").setAttribute("state", "uselected");
}

function XrefreshInfoPanel(buttonIndex) {
    deselectInventoryAndStats();
    //
    document.getElementById("infotextID").setAttribute("state", "crimeSelected");
    document.getElementById("buttonAndTitleWrapperID").setAttribute("state", "crimeSelected");

    // work on the assumption that the button index passed is the msot recently pressed button
    switch (gameState[buttonIndex].state) {
        //
        // case 0 means is ready to go but hasn't been done

        case 0:
            //var newInfoTitle = setOfCrime[buttonIndex].name;

            var newInfoText = "<h1>" + setOfCrime[buttonIndex].name + "</h1><br><br>REQUIRED:<br><br>" + setOfCrime[buttonIndex].requiredNoto + " N<br>";
            if (setOfCrime[buttonIndex].cost > 0) {
                newInfoText += setOfCrime[buttonIndex].cost + " $<br>";
            }

            let tempInventoryText = generateInventoryNeededText(buttonIndex);
            let tempInventoryGainedText = generateInventoryGainedText(buttonIndex);
            if (tempInventoryGainedText != "") {
                tempInventoryText += "<br><br>gaining you:<br><br>" + generateInventoryGainedText(buttonIndex);
            }
            // newInfoText += "<br>";
            newInfoText += tempInventoryText;
            //newInfoText += generateGameStateDataText(buttonIndex);

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
            //newInfoText += generateGameStateDataText(buttonIndex);
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
            document.getElementById(setOfCrime[buttonIndex].crimeID).setAttribute("state", "ready");
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
            document.getElementById(setOfCrime[buttonIndex].crimeID).setAttribute("state", "running");
            break;
            // case 2 means complete and ready to collect goods
        case 2:
            refreshedButtonText = setOfCrime[buttonIndex].name + " complete<br>collect reward";
            document.getElementById(setOfCrime[buttonIndex].crimeID).setAttribute("state", "complete");
            break;
            // case 3 means not enough notoriety to see
        case 3:
            document.getElementById(setOfCrime[buttonIndex].crimeID).setAttribute("state", "locked");
            refreshedButtonText = "COMMIT MORE CRIME";
    }
    document.getElementById(setOfCrime[buttonIndex].crimeID).innerHTML = refreshedButtonText;
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

        accumDataText += "<br>AND SPENT<br>";
        // accumDataText +=
        //   "<br>earning:<br>" +
        //   setOfCrime[buttonIndex].notoEarned * localNumberTimesCommitted +
        //   " NOTORIETY<br>" +
        //   setOfCrime[buttonIndex].moneyEarned * localNumberTimesCommitted +
        //   " $<BR>AND SPENT<br> ";
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
    // if (gameState[crimeIndex].state == 3 && player.noto >= setOfCrime[crimeIndex].requiredNoto) {
    //   gameState[crimeIndex].state = 0;
    // }
    if (gameState[crimeIndex].state == 3) {
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
    tempReturnText = setOfCrime[buttonIndex].gainedInventoryMultiplier + " x " + getInventoryNameFromInventoryCode(setOfCrime[buttonIndex].gainedInventory);

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
        newLogText = newLogText + "<br>*-" + logOfCrimes[logAddIndex];
    }
    // document.getElementById("logID").innerHTML = newLogText;
}

function refreshBanner() {
    updatedBannerHTML = player.noto.toLocaleString("en-US") + " N<br>" + player.money.toLocaleString("en-US") + " $";
    document.getElementById("statsBannerID").innerHTML = updatedBannerHTML;
}

function updateWordsAtBottom(buttonIndex, override, innerHTML) {
    tempWords = setOfCrime[buttonIndex].name;
    if (override == true) {
        document.getElementById("wordsAtBottomID").innerHTML = innerHTML;
    } else {
        if (gameState[buttonIndex].numberTimesCommitted == 0) {
            document.getElementById("wordsAtBottomID").innerHTML = setOfCrime[buttonIndex].name+"<br>you haven't done this before";
            return;
        } else {
            tempWords = setOfCrime[buttonIndex].name+"<br>"
            tempWords += wordsAboutCrime[setOfCrime[buttonIndex].crimeID];
            if (tempWords == undefined) {
                tempWords = setOfCrime[buttonIndex].name;
            }
        }
        document.getElementById("wordsAtBottomID").innerHTML = tempWords;
    }
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
    noticeState = false;

    //unselect other button
    document.getElementById("statButtonID").setAttribute("state", "uselected");

    document.getElementById("infotextID").setAttribute("state", "inventorySelected");
    document.getElementById("buttonAndTitleWrapperID").setAttribute("state", "inventorySelected");
    document.getElementById("invButtonID").setAttribute("state", "selected");

    // clear the space
    document.getElementById("infotextID").innerHTML = "YOU HAVE:<br><br>";

    for (let i = 0; i < playerInventoryLength; i++) {
        if (playerInventory[i].inventoryQuantityHeld > 0) {
            createInventoryButtons(playerInventory[i].inventoryCode);
        }
    }
}

function statsTab() {
    noticeState = false;

    //unselect other button
    document.getElementById("invButtonID").setAttribute("state", "uselected");

    document.getElementById("infotextID").setAttribute("state", "statsSelected");
    document.getElementById("buttonAndTitleWrapperID").setAttribute("state", "statsSelected");
    document.getElementById("statButtonID").setAttribute("state", "selected");

    // let tempStatsTabText = "";
    // tempStatsTabText += "&nbsp&nbspSTR: " + player.STR + "<br>";
    // tempStatsTabText += "&nbspLUCK: " + player.LUCK + "<br>";
    // tempStatsTabText += "&nbsp&nbspINT: " + player.INT + "<br>";
    // tempStatsTabText += "CHARM: " + player.CHARM + "<br>";

    document.getElementById("infotextID").innerHTML = newLogText;
}

function displayNotice(noticeHTML) {
    document.getElementById("buttonAndTitleWrapperID").setAttribute("state", "noticeText");
    document.getElementById("infotextID").setAttribute("state", "noticeText");
    document.getElementById("infotextID").innerHTML = "<h1>" + noticeHTML + "</h1>";

    noticeState = true;
}

function cheat(keyPressKey) {
    player.noto += 2;
    player.money += 1;
    updatedBannerHTML;
    //setOfCrime.forEach(checkNotoRequired);
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
    tempNewLogText = Cookies.get("log");
    if (tempNewLogText != undefined) {
        newLogText = tempNewLogText;
    }
    // document.getElementById("logID").innerHTML = newLogText;
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
    let playerCookieData = player.noto + ";" + player.money; // + ";" + player.STR + ";" + player.LUCK + ";" + player.LUCK + ";" + player.CHARM;
    Cookies.set("playerData", playerCookieData);
    console.log("wrote to cookies: " + playerCookieData);
}

function readPlayerCookie() {
    let tempPlayerDataCookieReadout = Cookies.get("playerData");
    if (tempPlayerDataCookieReadout != undefined) {
        console.log("player data cookie readout: " + tempPlayerDataCookieReadout);

        let arrayFromPlayerDataCookieReadout = tempPlayerDataCookieReadout.split(";");
        player.noto = parseInt(arrayFromPlayerDataCookieReadout[0]);
        player.money = parseInt(arrayFromPlayerDataCookieReadout[1]);
        // player.STR = parseInt(arrayFromPlayerDataCookieReadout[2]);
        // player.LUCK = parseInt(arrayFromPlayerDataCookieReadout[3]);
        // player.INT = parseInt(arrayFromPlayerDataCookieReadout[4]);
        // player.CHAR = parseInt(arrayFromPlayerDataCookieReadout[5]);
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

    // only refresh button for selected neighbourhood
    for (i = 0; i < setOfCrime.length; i++) {
        if (setOfCrime[i].neighbourhoodTabIndex == currentNeighbourhoodTabIndex) {
            refreshSingleButton(setOfCrime[i], i);
        }
    }

    //setOfCrime.forEach(refreshSingleButton);
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
//setOfCrime.forEach(createCrimeButtons);
createCrimeButtonsForNeighbourhood(currentNeighbourhoodTabIndex);

// call this initially to set initial crime state to 0
//setOfCrime.forEach(checkNotoRequired);

createNeighbourhoodButtons();

//updateCriminalStatus();

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