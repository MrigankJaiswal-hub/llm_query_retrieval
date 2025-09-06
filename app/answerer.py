# import requests
# import os
# from dotenv import load_dotenv
# load_dotenv()

# GROQ_API_KEY = os.getenv("GROQ_API_KEY")


# def generate_answer(question: str, context_chunks: list[str]) -> str:
#     endpoint = "https://api.groq.com/openai/v1/chat/completions"
#     prompt = f"""You are a helpful assistant. Use the following policy content to answer the question.

# Context:
# {chr(10).join(context_chunks)}

# Question:
# {question}

# Answer with reasoning and any applicable clause references."""

#     headers = {
#         "Authorization": f"Bearer {GROQ_API_KEY}",
#         "Content-Type": "application/json"
#     }

#     data = {
#         "model": "mixtral-8x7b-32768",
#         "messages": [{"role": "user", "content": prompt}],
#         "temperature": 0.2
#     }

#     response = requests.post(endpoint, headers=headers, json=data)
#     return response.json()['choices'][0]['message']['content']

# import google.generativeai as genai
# import os
# from dotenv import load_dotenv
# load_dotenv()

# genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# model = genai.GenerativeModel("gemini-pro")

# def generate_answer(question: str, context_chunks: list[str]) -> str:
#     prompt = f"""You are a helpful assistant. Use the following policy content to answer the question.

# Context:
# {chr(10).join(context_chunks)}

# Question:
# {question}

# Answer with reasoning and any applicable clause references."""
    
#     response = model.generate_content(prompt)
#     return response.text

import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel('gemini-1.5-flash')  # Or 'gemini-1.5-pro' if you prefer

def generate_answer(question: str, context_chunks: list[str]) -> str:
    context_text = "\n".join(context_chunks)
    prompt = f"""You are a helpful assistant. Use the following policy content to answer the question.

Context:
{context_text}

Question:
{question}

Answer with reasoning and any applicable clause references."""
    
    response = model.generate_content(prompt)
    return response.text