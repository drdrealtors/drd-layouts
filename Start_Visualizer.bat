@echo off
echo Starting DRD Layout Visualizer...
echo Checking for dependencies...
if not exist node_modules (
    echo Installing dependencies...
    call npm install
)
echo.
echo Running server on http://localhost:3001
echo Admin Dashboard: http://localhost:3001/admin.html
echo.
npm start
pause
