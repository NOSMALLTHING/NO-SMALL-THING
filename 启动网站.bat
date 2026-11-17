@echo off
title NO SMALL THING - 本地开发服务器
cd /d "%~dp0"
echo ==============================================
echo   正在启动 NO SMALL THING 本地网页服务器...
echo   网页地址: http://localhost:3000
echo   若要关闭服务器，直接关闭此窗口即可
echo ==============================================
echo.
start http://localhost:3000
npm run dev
pause
