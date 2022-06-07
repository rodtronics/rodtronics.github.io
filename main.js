// this function stores information in itself
function structOfCrimes(name, requiredNoto, moneyEarned, notoEarned, timeToCompleteInSeconds, timeToCompleteInHours) {
    this.name = name;
    this.requiredNoto = requiredNoto;
    this.moneyEarned = moneyEarned;
    this.notoEarned = notoEarned;
    this.timeToCompleteInSeconds = timeToCompleteInSeconds;
    this.timeToCompleteInHours = timeToCompleteInHours;
}

// this creates an array "setOfCrime" that contains different crimes
var setOfCrime = [
    new structOfCrimes("Loitering", 0, 0, 2, 3, 0),
    new structOfCrimes("Skateboarding", 10, 0, 5, 10, 0),
    new structOfCrimes("Littering",7,0,3,1,0)

]

// this function builds the crime windows and places them in the flexbox
function createCrimeWindows(structOfCrimesIterator, buttonIndex) {

    // create a new div that will be added to the flexbox
    var newWindowButton = document.createElement("button");

    // set it's class and give it a unique id
    newWindowButton.className = "crime";
    newWindowButton.id = structOfCrimesIterator.name;

    // create the text that goes in the window
    var newWindowText = structOfCrimesIterator.name;

    // add the text to the div
    newWindowButton.innerHTML = newWindowText;
    
    // append the newly created div to the flexbox
    document.getElementById('crimeID').appendChild(newWindowButton);

    // add function to the button for when it is clicked
    document.getElementById(structOfCrimesIterator.name).addEventListener("click", () => clickOnCrimeButton(buttonIndex));}

// this function is called when a crime button is clicked
function clickOnCrimeButton(idOfButton) {
    var buttonText = setOfCrime[idOfButton].name;
    document.getElementById("infoID").textContent = buttonText;
}



setOfCrime.forEach(createCrimeWindows);
document.getElementById("infoID").textContent = "Welcome to Crime Committer";
