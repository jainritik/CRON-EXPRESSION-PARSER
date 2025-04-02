import os
import requests
import json
from openai import OpenAI

# Load API keys from GitHub environment variables
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
REPO = os.getenv("GITHUB_REPOSITORY")  # "owner/repo"
PR_EVENT_PATH = os.getenv("GITHUB_EVENT_PATH")

# Read PR event JSON to get PR number
with open(PR_EVENT_PATH, "r") as f:
    event_data = json.load(f)
    PR_NUMBER = event_data["pull_request"]["number"]

# GitHub API Headers
headers = {"Authorization": f"token {GITHUB_TOKEN}", "Accept": "application/vnd.github.v3+json"}

# Step 1: Fetch PR changes
pr_url = f"https://api.github.com/repos/{REPO}/pulls/{PR_NUMBER}/files"
pr_response = requests.get(pr_url, headers=headers)
pr_files = pr_response.json()

# Extract code diffs
code_changes = "\n\n".join([f"{file['filename']}:\n{file['patch']}" for file in pr_files if "patch" in file])

# Step 2: Send to GPT for AI review
client = OpenAI(api_key=OPENAI_API_KEY)

prompt = f"""
You are an AI PR reviewer. Review the following PR changes and provide:
- **Code Quality Issues**
- **Logic Errors**
- **Optimization Suggestions**
- **Missing Documentation or Comments**
- **If the PR description is missing, suggest one.**

Here are the changes:

{code_changes}

Provide detailed comments, formatted as bullet points.
"""

response = client.chat.completions.create(
    model="gpt-4-turbo",
    messages=[{"role": "system", "content": prompt}]
)

review_comments = response.choices[0].message.content

# Step 3: Post Comments to GitHub PR
comment_url = f"https://api.github.com/repos/{REPO}/issues/{PR_NUMBER}/comments"
comment_data = {"body": f"### AI PR Review Summary 🚀\n{review_comments}"}

requests.post(comment_url, headers=headers, json=comment_data)

print("AI PR Review Completed.")
