@echo off
echo Starting Indeed Clone Services with MongoDB...

echo Starting MongoDB...
start "MongoDB" cmd /k "mongod --dbpath ./nosql-data"

timeout /t 5

echo Starting Auth Service (Port 3001)...
start "Auth Service" cmd /k "cd auth && npm install && npm start"

timeout /t 2

echo Starting Company Service (Port 3002)...
start "Company Service" cmd /k "cd company && npm install && npm start"

timeout /t 2

echo Starting User Service (Port 3003)...
start "User Service" cmd /k "cd user && npm install && npm start"

timeout /t 2

echo Starting Review Service (Port 3004)...
start "Review Service" cmd /k "cd review && npm install && npm start"

timeout /t 2

echo Starting Application Service (Port 3005)...
start "Application Service" cmd /k "cd application && npm install && npm start"

timeout /t 2

echo Starting Photos Service (Port 3006)...
start "Photos Service" cmd /k "cd photos && npm install && npm start"

timeout /t 2

echo Starting Chat Service (Port 3000)...
start "Chat Service" cmd /k "cd chat && npm install && npm start"

echo All services started! Check individual windows for status.
pause