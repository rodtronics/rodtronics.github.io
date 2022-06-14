import csv
from hashlib import new
i=0
crimelist=""
with open('data/crimecommitter.csv', newline='') as csvfile:
    crime_reader = csv.reader(csvfile)
    for row in crime_reader:
        newrow = 'new structOfCrimes("'+row[0] + '","' + row[1]+'",'+row[2]+','+row[3]+','+row[4]+','+row[5]+','+row[6]+','+row[7]+',0, 0, 0),\n'
        crimelist = crimelist + newrow
with open('data/crimecommittercrimes.crimefile','w') as crimefile:
    print(crimelist,file=crimefile)