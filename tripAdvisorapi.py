# This is a sample Python script.

# Press ⌃R to execute it or replace it with your code.
# Press Double ⇧ to search everywhere for classes, files, tool windows, actions, and settings.
import pandas as pd
import requests
import json


# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    # print_hi('PyCharm')
    df = pd.read_csv("rest.csv")
    lst1 = [0] * df.shape[0]
    lst2 = [0] * df.shape[0]
    print(df.shape[0])

    for i, row in df.iloc[40000:60000].iterrows():
        # if (i == 10000):
        #     break
        print(i)
        apiAddress = str(df.at[i, 'Name']) + ',' + str(df.at[i, 'City'])

        parameters = {
            "key": "mi14it5k5jBbXbb2IExjC4DyxItW8e2C",
            "location": apiAddress
        }
        response = requests.get("http://www.mapquestapi.com/geocoding/v1/address", params=parameters)
        print(response)
        if (response == None or response == ""):
            print("in here")
            continue

        data = json.loads(response.text)['results']
        print(data)
        if (data != None):
            print("herre")
            lat = data[0]['locations'][0]['latLng']['lat']
            lng = data[0]['locations'][0]['latLng']['lng']
            lst1[i] = lat
            lst2[i] = lng

    df["lat"] = lst1
    df["lng"] = lst2
    df.to_csv("rests5.csv")

# See PyCharm help at https://www.jetbrains.com/help/pycharm/
