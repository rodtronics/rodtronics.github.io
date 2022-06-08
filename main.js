// this function stores information in itself
function structOfCrimes(buttonid, name, requiredNoto, moneyEarned, notoEarned, timeToCompleteInSeconds, timeToCompleteInHours) {
    this.buttonid = buttonid;
    this.name = name;
    this.requiredNoto = requiredNoto;
    this.moneyEarned = moneyEarned;
    this.notoEarned = notoEarned;
    this.timeToCompleteInSeconds = timeToCompleteInSeconds;
    this.timeToCompleteInHours = timeToCompleteInHours;
}

// this creates an array "setOfCrime" that contains different crimes
var setOfCrime = [
    new structOfCrimes("loit", "Loitering", 0, 0, 2, 3, 0),
    new structOfCrimes("skate", "Skateboarding", 10, 0, 5, 10, 0),
    new structOfCrimes("litt", "Littering", 7, 0, 3, 1, 0)

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
function clickOnCrimeButton(idOfButton) {

    // add the name
    var newInfoText = setOfCrime[idOfButton].name;
    document.getElementById("infoID").textContent = newInfoText;
}



setOfCrime.forEach(createCrimeButtons);
document.getElementById("infoID").textContent = "Welcome to Crime Committer";