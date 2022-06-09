//globals

var globalButtonIndex

// this function stores information in itself
function structOfCrimes(buttonid, name, requiredNoto, moneyEarned, notoEarned, timeToCompleteInSeconds, timeToCompleteInHours, state, datetimeCrimeStarted, datetimeCrimeWillEnd) {
    this.buttonid = buttonid;
    this.name = name;
    this.requiredNoto = requiredNoto;
    this.moneyEarned = moneyEarned;
    this.notoEarned = notoEarned;
    this.timeToCompleteInSeconds = timeToCompleteInSeconds;
    this.timeToCompleteInHours = timeToCompleteInHours;
    this.timeToCompleteInMilliseconds = (timeToCompleteInHours * 60 * 60 * 1000) + (timeToCompleteInSeconds * 1000);
    this.state = state;
    this.datetimeCrimeStarted = datetimeCrimeStarted;
    this.datetimeCrimeWillEnd = datetimeCrimeWillEnd;
}

// this creates an array "setOfCrime" that contains different crimes
var setOfCrime = [
    new structOfCrimes("loit", "Loitering", 0, 0, 2, 3, 0, 0, 0, 0),
    new structOfCrimes("skate", "Skateboarding", 10, 0, 5, 10, 0, 0, 0, 0),
    new structOfCrimes("litt", "Littering", 7, 0, 3, 1, 0, 0, 0, 0)

]

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
    document.getElementById('crimeID').appendChild(newCrimeButton);

    // add function to the button for when it is clicked
    document.getElementById(structOfCrimesIterator.buttonid).addEventListener("click", () => clickOnCrimeButton(buttonIndex));
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
    document.getElementById("goButton").addEventListener("click", () => commitCrime(buttonIndex));



}

// starts crime
function commitCrime(buttonIndex) {
    setDatetimes(globalButtonIndex);
    setOfCrime[globalButtonIndex].state = 1;
    console.log("working");
}

// sets dates and times of crime start and finish
function setDatetimes(buttonIndex) {
    setOfCrime[globalButtonIndex].datetimeCrimeStarted = date.now();
    setOfCrime[globalButtonIndex].datetimeCrimeWillEnd = date.now() + setOfCrime[globalButtonIndex].datetimetocompleteinmilliseconds;
}

// this function is called every frame, and will call a couple other functions
function initiateRefresh(timestamp) {
    //setOfCrime.forEach(refreshButtons)
    var timeUntilComplete = setOfCrime[globalButtonIndex].datetimeCrimeWillEnd - date.now();
    document.getElementById("infoID").textContent = timeUntilComplete;
}

function refreshButtons(structOfCrimesIterator, buttonIndex) {

}


setOfCrime.forEach(createCrimeButtons);
document.getElementById("infoID").textContent = "Welcome to Crime Committer";

window.requestAnimationFrame(initiateRefresh);