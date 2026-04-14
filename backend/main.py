from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os
from dotenv import load_dotenv
from pathlib import Path

# ✅ Load .env (works locally + safe for deployment)
env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

# ✅ Optional API key (DON'T CRASH if missing)
api_key = os.getenv("OPENAI_API_KEY")
print("API KEY LOADED:", api_key)

app = FastAPI()

# ✅ Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

df = None

@app.get("/favicon.ico")
def favicon():
    return {}

@app.get("/")
def home():
    return {"message": "Backend is running 🚀"}

# ✅ Upload CSV
@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    global df
    try:
        contents = await file.read()
        df = pd.read_csv(pd.io.common.BytesIO(contents))

        return {
            "columns": list(df.columns)
        }
    except Exception as e:
        return {"error": str(e)}

# ✅ Chart
@app.get("/chart")
def chart(column: str):
    global df

    if df is None:
        return {"error": "Upload dataset first"}

    try:
        data = df[column].value_counts().reset_index()
        data.columns = ["name", "value"]
        return data.to_dict(orient="records")
    except Exception as e:
        return {"error": f"Chart error: {str(e)}"}

# ✅ AI Chat (SMART WITHOUT OPENAI)
@app.post("/chat")
def chat(query: str):
    global df

    if df is None:
        return {"response": "Please upload dataset first"}

    query = query.lower()

    try:
        numeric_cols = df.select_dtypes(include="number").columns.tolist()
        cat_cols = df.select_dtypes(include="object").columns.tolist()

        selected_col = None
        for col in df.columns:
            if col.lower() in query:
                selected_col = col
                break

        if not selected_col and numeric_cols:
            selected_col = numeric_cols[0]

        # 🟢 HIGHEST
        if "highest" in query or "max" in query:
            value = df[selected_col].max()
            return {"response": f"Highest {selected_col} is {value}"}

        # 🟢 LOWEST
        elif "lowest" in query or "min" in query:
            value = df[selected_col].min()
            return {"response": f"Lowest {selected_col} is {value}"}

        # 🟢 AVERAGE
        elif "average" in query or "mean" in query:
            value = df[selected_col].mean()
            return {"response": f"Average {selected_col} is {round(value,2)}"}

        # 🟢 TOTAL
        elif "total" in query or "sum" in query:
            value = df[selected_col].sum()
            return {"response": f"Total {selected_col} is {value}"}

        # 🟢 GROUP BY
        elif "by" in query:
            for col in cat_cols:
                if col.lower() in query:
                    result = (
                        df.groupby(col)[selected_col]
                        .sum()
                        .sort_values(ascending=False)
                        .head(5)
                    )
                    return {"response": f"{selected_col} by {col}:\n{result.to_string()}"}

        # 🟢 TOP 5
        elif "top" in query:
            top_data = df.nlargest(5, selected_col)
            return {"response": f"Top 5 by {selected_col}:\n{top_data.to_string()}"}

        # 🟢 COLUMN LIST
        elif "column" in query:
            return {"response": f"Columns: {list(df.columns)}"}

        # 🟢 DEFAULT
        else:
            return {
                "response": "Try: highest, lowest, average, total, top, or 'sales by region'"
            }

    except Exception as e:
        return {"response": f"Error: {str(e)}"}