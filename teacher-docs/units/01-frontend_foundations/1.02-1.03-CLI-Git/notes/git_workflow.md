# Workflow

1. Make sure you are on main branch before starting.\
   `git branch`
1. Make a new feature branch.\
   `git checkout -b feature_branch`
1. Make changes in the feature branch.\
   `git add .`\
   `git commit -m "Added new feature"`
1. When you are done with the new feature, switch back to the main branch and pull new changes from the remote repo.\
   `git switch main`\
   `git pull`
1. Switch back to your feature branch and merge in the changes from main. Be sure to resolve any merge conflicts.\
   `git switch feature_branch`\
   `git merge main`
1. Push the local feature branch to the remote.\
   `git push -u origin feature_branch`
1. Make a pull request on GitHub to merge in the feature branch. The base should be "main" and the compare should be your feature branch.
1. Another dev on the team approves the pull request. Once it's approved, you can merge in your feature branch. This will update the remote main branch with the changes.
1. Delete the feature branch on GitHub.
1. Return to the main branch and pull changes.\
   `git switch main`\
   `git pull`
1. Delete your local feature branch.\
   `git branch -d feature_branch`
