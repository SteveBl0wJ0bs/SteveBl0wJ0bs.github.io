import pandas as pd
import os

if os.path.exists("Categories.csv"):
    os.remove("Categories.csv")

data=pd.read_csv("fullReport.csv")
data=data[["SpeciesName"]]
data=data.groupby(["SpeciesName"]).size().reset_index()
data.rename(columns = {0: "Occurrence"}, inplace = True)
data.to_csv("Categories.csv", index=False)
