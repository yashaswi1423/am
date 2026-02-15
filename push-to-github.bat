@echo off
echo ========================================
echo Push to GitHub
echo ========================================
echo.
echo Before running this script:
echo 1. Create a repository on GitHub (https://github.com/new)
echo 2. Copy the repository URL
echo 3. Edit this file and replace YOUR_GITHUB_URL with your actual URL
echo.
echo Current directory: %CD%
echo.
pause

REM Replace this with your actual GitHub repository URL
set GITHUB_URL=https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

echo Adding remote repository...
git remote add origin %GITHUB_URL%

echo Renaming branch to main...
git branch -M main

echo Pushing to GitHub...
git push -u origin main

echo.
echo ========================================
echo Done! Check your GitHub repository.
echo ========================================
pause
