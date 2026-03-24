# CLI (Command Line Interface) commands

- Tell your computer what to do
- Commands
  - ls -> lists out the contents of the current directory (folder)
  - cd [directory name] -> changes the directory
    - .. -> goes up one directory
    - / -> separates navigating multiple directories
  - mkdir [directory name] -> creates a new directory
  - touch [file name] -> creates a new file
  - pwd -> displays absolute path to the folder you are in
  - mv and rm -> moving and removing a file (I recommend doing this in the explorer bar)
    - NEVER RUN THIS COMMAND -> rm -rf
   - code [directory name] -> open VS Code at the specified directory
    - . -> refers to the currect directory
  - && -> do one command after another finishes
- Flags
  - extensions of a command
  - Example: ls -a (shows all files and directories in the current folder)

# Git vs GitHub

- Git -> version control system using git commands that keep track of the history of files
- GitHub -> place to store your projects (repository)

- git commands
  - git init -> allows a project to use git commands
  - git status -> shows what has been added/changed/deleted since the last commit
  - git add [file names] -> moves the files/folders from the working directory area to the staging area
  - git commit -> takes everything from the staging area and makes it permanent
    - -m "message" -> shortcut for writing a message on your commit
  - git remote -> another location
    - add -> add connection
    - nickname -> name of connection (most commonly origin)
    - location -> where is the actual connection

- 3 stages
  - working directory (red)
  - staging area (green)
  - project history

# File Naming and Structure for folders, HTML and CSS files

- Don't use special characters (!, @, #, $, %, ^, &, *, (, ), /, +, =, _) (except hyphens)
- Don't use spaces (use hyphens)
- Start the file name with a letter
- Use all lowercase letters separated by hyphens
- Keep your file names short and descriptive
- ALWAYS put a file extension on files

# Feature Branches

- git checkout -> move to a new branch
  - -b -> create a new branch
  - [branch name] -> name of feature you're adding

- Steps
  - make a feature branch
  - make changes in code
  - push up the feature branch to GitHub
  - make a pull request in GitHub
  - code review the changes
  - if they're good, merge feature branch with main
  - in VS Code go to the main branch (git checkout main)
  - pull the latest changes from GitHub (git pull nickname main)

# Git clone

- retrieves a project from a remote source AND creates a new folder for that project
- it DOES NOT point your terminal at the newly created project folder