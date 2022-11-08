import pandas as pd
import os

if os.path.exists("AverageValuesPerCategory.csv"):
    os.remove("AverageValuesPerCategory.csv")

data=pd.read_csv("fullReport.csv")
data=data[["SpeciesName", "ReplacementValue",
          "PollutionRemoval"]]
data=data.groupby(["SpeciesName"], as_index=False).mean().round(3)
data.to_csv("AverageValuesPerCategory.csv", index=False)

