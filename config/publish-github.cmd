@echo off
cd /d "%~dp0.."
echo.
echo === Публикация batsmanyd-site на GitHub ===
echo.

where gh >nul 2>&1
if errorlevel 1 (
  echo GitHub CLI не найден. Установите: winget install GitHub.cli
  pause
  exit /b 1
)

gh auth status >nul 2>&1
if errorlevel 1 (
  echo Сначала войдите в GitHub ^(откроется браузер^):
  gh auth login --hostname github.com --git-protocol https --web
  echo.
)

echo Создаю репозиторий и загружаю код...
gh repo create batsmanyd-site --public --source=. --remote=origin --push

if errorlevel 1 (
  echo.
  echo Если репозиторий уже существует, выполните:
  echo   git remote add origin https://github.com/ВАШ_ЛОГИН/batsmanyd-site.git
  echo   git push -u origin main
) else (
  echo.
  echo Готово! Откройте репозиторий:
  gh repo view --web
)

pause