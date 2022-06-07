function Item(id, speaker, country) {
    this.id = id;
    this.speaker = speaker;
    this.country = country;
  }
  var myItems = [new Item(1, 'john', 'au'), new Item(2, 'mary', 'us')];

function structOfCrimes(name, requiredNoto, moneyEarned, notoEarned, timeToCompleteInSeconds, timeToCompleteInHours)
  {
      this.name=name;
      this.requiredNoto=requiredNoto;
      this.moneyEarned=moneyEarned;
      this.notoEarned=notoEarned;
      this.timeToCompleteInSeconds=timeToCompleteInSeconds;
      this.timeToCompleteInHours=timeToCompleteInHours;
  }



for (let i = 0; i<20;i++)
{
    var crime = document.createElement("div");
    crime.className="crime";

crime.innerHTML=i;

document.getElementById('crimeID').appendChild(crime);


}