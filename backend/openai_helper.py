import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def ask_ai(df, query):
    # Convert dataframe to small sample (avoid overload)
    sample = df.head(10).to_string()

    prompt = f"""
    You are a data analyst.

    Dataset:
    {sample}

    Columns: {list(df.columns)}

    User question:
    {query}

    Give answer in simple explanation + insights.
    """

    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[{"role": "user", "content": prompt}]
    )

    return response.choices[0].message.content