@echo off
echo Cleaning Next.js cache and temporary files...

:: Stop any running Next.js processes
taskkill /f /im node.exe 2>nul

:: Remove Next.js cache
rmdir /s /q .next
echo Next.js cache deleted.

:: Clear node_modules/.cache if it exists
if exist node_modules\.cache (
  rmdir /s /q node_modules\.cache
  echo Node modules cache deleted.
)

:: Run npm command with increased memory
echo Starting the development server with increased memory allocation...
set NODE_OPTIONS=--max_old_space_size=8192
npm run dev

echo Done!
