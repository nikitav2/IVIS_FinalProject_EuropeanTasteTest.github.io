import csv
import json

data = {}
with open("data.csv") as csvFile:
    csvReader = csv.DictReader(csvFile)
    count = 0
    for rows in csvReader:
        count += 1
        if count > 7:
            break

        id = rows["Name"]
        data[id] = rows

with open('data.json', 'w') as jsonFile:
    jsonFile.write(json.dumps(data, indent=4))
