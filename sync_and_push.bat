@echo off
echo --- DRD Visualizer Sync ^& Push Script ---

:: 1. Create Backup
echo [1/4] Creating local backup...
:: Get current date/time in a safe format
set mydate=%date:~-4,4%%date:~-10,2%%date:~-7,2%
set mytime=%time:~0,2%%time:~3,2%
set mytime=%mytime: =0%
set BACKUP_DIR=..\DRD_Visualizer_Backup_%mydate%_%mytime%

mkdir "%BACKUP_DIR%"
xcopy /E /I /Y . "%BACKUP_DIR%"
echo Backup created at %BACKUP_DIR%

:: 2. Pull from Remote
echo [2/4] Fetching latest from Git...
git pull origin main

:: 3. Commit Changes
echo [3/4] Committing local updates...
git add .
git commit -m "Updated layout visualizer with new images, plans, and walkthrough videos"

:: 4. Push to Remote
echo [4/4] Pushing to Git...
git push origin main

echo --- Done! ---
pause
