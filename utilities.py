import csv
import json


def cleanData():
    # ,Unnamed: 0,Name,City,CuisineStyle,Ranking,Rating,PriceRange,NumberofReviews,Reviews,URL_TA,ID_TA,lat,lng
    with open("data_copy.csv") as csvFile:
        with open("output_data.csv", 'a', newline='') as file:
            writer = csv.writer(file)
            csvReader = csv.DictReader(csvFile)
            count = 0
            for rows in csvReader:
                print(rows["Name"])
                print()
                if rows["City"] != "Amsterdam" or (rows["City"] == "Amsterdam" and abs(float(rows["lat"]) - 52.3635) < 1 and abs(float(rows["lng"]) - 4.93269) < 1):
                    value = [0, 0, rows["Name"], rows["City"], rows["CuisineStyle"], rows["Ranking"], rows["Rating"], rows["PriceRange"],
                             rows["NumberofReviews"], rows["Reviews"], rows["URL_TA"], rows["ID_TA"], rows["lat"], rows["lng"]]
                    writer.writerow(value)


def createData():
    city_dict = {}

    with open("final.csv") as csvFile:
        with open("final_reduced.csv", 'a', newline='') as outfile:
            writer = csv.writer(outfile)
            csvReader = csv.DictReader(csvFile)

            for rows in csvReader:
                curr_city = rows["City"]
                if curr_city in city_dict:
                    count = city_dict[curr_city]
                    if count < 15:
                        city_dict[curr_city] = count + 1
                        value = [0, 0, rows["Name"], rows["City"], rows["CuisineStyle"], rows["Ranking"], rows["Rating"], rows["PriceRange"],
                                 rows["NumberofReviews"], rows["Reviews"], rows["URL_TA"], rows["ID_TA"], rows["lat"], rows["lng"]]
                        writer.writerow(value)
                else:
                    city_dict[curr_city] = 1
                    value = [0, 0, rows["Name"], rows["City"], rows["CuisineStyle"], rows["Ranking"], rows["Rating"], rows["PriceRange"],
                             rows["NumberofReviews"], rows["Reviews"], rows["URL_TA"], rows["ID_TA"], rows["lat"], rows["lng"]]
                    writer.writerow(value)


createData()

# print()
# print(data)
# with open("output_data.csv", 'a', newline='') as file:

#     writer = csv.writer(file)
#     writer.writerows(data)


# with open('data.json', 'w') as jsonFile:
#     jsonFile.write(json.dumps(data, indent=4))
