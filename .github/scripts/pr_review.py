import subprocess
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
headers = {"Authorization": f"token {GITHUB_TOKEN}", "Accept": "application/vnd.github.v3+json"}

# Step 1: Get PR diff (changed files)
pr_files_url = f"https://api.github.com/repos/{REPO}/pulls/{PR_NUMBER}/files"
pr_files_response = requests.get(pr_files_url, headers=headers)
pr_files = pr_files_response.json()

# Extract code changes
code_changes = "\n\n".join([f"{file['filename']}:\n{file['patch']}" for file in pr_files if "patch" in file])

# Step 2: Run Ollama for AI PR review
prompt = f"""
Analyze this Pull Request and provide:
- Code Quality Issues
- Logic Errors
- Optimization Suggestions
- Best Practice Improvements

PR Changes:

{code_changes}
"""

ollama_response = subprocess.run(["ollama", "run", "mistral", prompt], capture_output=True, text=True)
review_comments = ollama_response.stdout

# Step 3: Post review as a GitHub comment
comment_url = f"https://api.github.com/repos/{REPO}/issues/{PR_NUMBER}/comments"
comment_data = {"body": f"### AI PR Review (Ollama) 🚀\n{review_comments}"}

requests.post(comment_url, headers=headers, json=comment_data)

print("✅ AI PR Review Completed.")
