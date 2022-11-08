import pandas as pd
import os

if os.path.exists("Data.csv"):
    os.remove("Data.csv")

data=pd.read_csv("TreeInformation.csv")
data=data[["Name", "CanopyCover(m2)"]]
data["Occurrence"]=''
data=data.groupby("Name").agg({"Occurrence":"count", "CanopyCover(m2)":"mean"}).reset_index()
data.to_csv("Data.csv", index=False)

