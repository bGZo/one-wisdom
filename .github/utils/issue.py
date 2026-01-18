import os
import sys
import requests
from github import Github, Auth

def sync_issue(issue):
    # Ensure directory exists
    directory = 'src/content/quotes/manual'
    if not os.path.exists(directory):
        os.makedirs(directory)
    
    # Naming convention: YYYY-MM-DD-NUMBER.md
    filename = f"{directory}/{issue.created_at.strftime('%Y-%m-%d')}-{issue.number}.md"
    
    with open(filename, "w") as f:
        f.write('---\n')
        if issue.body is not None:
            f.write(issue.body + '\n')
        f.write('---\n')
    
    issue.edit(state='closed')
    print(f'Synced {issue.title} to {filename}')

def delete_target_issue(issue, token):
    # Try to physically delete the issue via GitHub REST API
    # Note: This requires admin/owner access to the repository.
    # Endpoint: DELETE /repos/{owner}/{repo}/issues/{issue_number}
    try:
        response = requests.delete(
            issue.url,
            headers={
                "Authorization": f"Bearer {token}",
                "Accept": "application/vnd.github+json",
                "X-GitHub-Api-Version": "2022-11-28"
            }
        )
        
        if response.status_code == 204:
            print(f'Physically deleted issue {issue.number}: {issue.title}')
        else:
            print(f'Failed to delete issue {issue.number} (Status: {response.status_code}). Closing instead.')
            issue.edit(state='closed')
    except Exception as e:
        print(f"Error deleting issue: {e}")
        issue.edit(state='closed')

if __name__ == '__main__':
    # Use environment variable for repo name if available (GitHub Actions), else default
    repoUrl = os.environ.get('GITHUB_REPOSITORY', 'bGZo/one-wisdom')

    token = sys.argv[1]
    auth = Auth.Token(token)
    g = Github(auth=auth)
    repo = g.get_repo(repoUrl)
    name = g.get_user().login

    # 1. Sync issues with 'one-wisdom' label
    sync_issues = repo.get_issues(
        labels=['one-wisdom'],
        state='open',
        sort='updated'
    )

    for issue in sync_issues:
        sync_issue(issue)

    # 2. Delete issues with 'one-wisdom-delete' label
    delete_issues = repo.get_issues(
        labels=['one-wisdom-delete'],
        state='closed',
        sort='updated'
    )

    for issue in delete_issues:
        delete_target_issue(issue, token)
