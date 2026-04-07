@echo off
set PORT=8000
echo Starting DRD Layout Visualizer...
echo.
echo Opening browser at http://localhost:%PORT%
echo Press Ctrl+C in this window to stop the server.
echo.

start http://localhost:%PORT%
python -m http.server %PORT%
