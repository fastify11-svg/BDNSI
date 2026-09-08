@echo off
REM BDNSI Autonomous Runner — Windows Task Scheduler Launcher
REM This batch file is registered with Task Scheduler and invoked every 15 minutes.
REM It calls the Node.js sidecar which implements the lock/wake/prompt-inject logic.

cd /d "C:\BDNSI"
node ".ai\runtime\sidecar_runner.js" >> ".ai\runtime\scheduler.log" 2>&1
