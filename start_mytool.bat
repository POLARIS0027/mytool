@echo off
cd /d C:\study\mytool\server
start cmd /k "node index.js"

cd /d C:\study\mytool\client
start cmd /k "npm start"
