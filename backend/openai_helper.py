import os
from openai import OpenAI
from dotenv import load_dotenv
from pathlib import Path

# ✅ Load .env safely
env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

# ✅ Get API key
api_key = os.getenv("OPENAI_API_KEY")

# ✅ Create client only if key exists
client = OpenAI(api_key=api_key) if api_key else None


def ask_ai(df, query):
    # ❌ If API key missing → fallback
    if not client:
        return "AI not available (API key missing)."

    try:
        # ✅ Limit data size (important)
        sample = df.head(10).to_string()

        prompt = f"""
You are a data analyst.

Dataset:
{sample}

Columns: {list(df.columns)}

User question:
{query}

Give simple explanation with insights.
"""

        # ✅ OpenAI call
        response = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[{"role": "user", "content": prompt}]
        )

        return response.choices[0].message.content

    except Exception as e:
        return f"AI Error: {str(e)}"