@echo off
title 启动 Butter Video 本地演示
chcp 65001 >nul
echo ========================================================
echo   正在启动 Butter Video 本地演示环境...
echo ========================================================
echo 正在打开默认浏览器访问: http://localhost:3000/index.html
start http://localhost:3000/index.html
echo 服务已就绪，保持此窗口打开即可随时浏览。按 Ctrl+C 可停止服务。
echo.
python -m http.server 3000
pause
