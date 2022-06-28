import csv
from hashlib import new
i=0
crimelist=""
with open('data/inventorySpreadsheet.csv', newline='') as csvfile:
    crime_reader = csv.reader(csvfile)
    for row in crime_reader:
        newrow = 'new structOfInventoryItems("'+row[0] + '","' + row[1]+'",'+row[2]+'),\n'
        crimelist = crimelist + newrow
with open('data/crimecommitterinventory.crimefile','w') as crimefile:
    print(crimelist,file=crimefile)



