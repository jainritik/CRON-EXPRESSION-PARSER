import os
import json
import requests

# Load GitHub event data
GITHUB_EVENT_PATH = os.getenv("GITHUB_EVENT_PATH")

with open(GITHUB_EVENT_PATH, "r") as f:
    event_data = json.load(f)
    PR_NUMBER = event_data["pull_request"]["number"]
    REPO = event_data["repository"]["full_name"]

# GitHub API setup
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
HEADERS = {"Authorization": f"token {GITHUB_TOKEN}", "Accept": "application/vnd.github.v3+json"}

# Step 1: Get PR diff (changed files)
pr_files_url = f"https://api.github.com/repos/{REPO}/pulls/{PR_NUMBER}/files"
pr_files_response = requests.get(pr_files_url, headers=HEADERS)
pr_files = pr_files_response.json()

# Extract code changes
code_changes = "\n\n".join([f"{file['filename']}:\n{file['patch']}" for file in pr_files if "patch" in file])

# Step 2: Call Hugging Face API for AI PR review
HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")
huggingface_url = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1"

headers = {"Authorization": f"Bearer {HUGGINGFACE_API_KEY}", "Content-Type": "application/json"}

prompt = f"""
Analyze this Pull Request and provide:
- Code Quality Issues
- Logic Errors
- Optimization Suggestions
- Best Practice Improvements

PR Changes:

{code_changes}
"""

payload = {
    "inputs": prompt,
    "parameters": {"temperature": 0.7, "max_length": 500}
}

response = requests.post(huggingface_url, headers=headers, json=payload)
review_comments = response.json()[0]["generated_text"]

# Step 3: Post review as a GitHub comment
comment_url = f"https://api.github.com/repos/{REPO}/issues/{PR_NUMBER}/comments"
comment_data = {"body": f"### 🤖 AI PR Review 🚀\n{review_comments}"}

requests.post(comment_url, headers=HEADERS, json=comment_data)

print("✅ AI PR Review Completed.")
