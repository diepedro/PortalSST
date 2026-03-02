@echo off
title Portal Equilibrio SST v2.0
color 1F

echo.
echo  =========================================
echo   Portal Equilibrio SST v2.0
echo   MEGGA WORK - Saude e Seguranca
echo  =========================================
echo.
echo  Iniciando com Docker Desktop...
echo  (Certifique-se que o Docker Desktop esta aberto)
echo.

:: Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERRO] Docker Desktop nao esta rodando!
    echo  Abra o Docker Desktop e tente novamente.
    echo.
    pause
    exit /b 1
)

echo  [1/2] Construindo e iniciando containers...
echo         (primeira vez pode demorar alguns minutos)
echo.
docker-compose up --build -d

echo.
echo  [2/2] Aguardando servidor iniciar...

:: Wait for the app to be ready
:WAIT_LOOP
timeout /t 3 /nobreak >nul
curl -s -o nul http://localhost:3000 2>nul
if %errorlevel% neq 0 (
    echo         Ainda iniciando...
    goto WAIT_LOOP
)

echo.
echo  =========================================
echo   PRONTO! Portal esta rodando.
echo  =========================================
echo.
echo   URL:   http://localhost:3000
echo   Login: admin@meggawork.com
echo   Senha: admin123
echo.
echo   Para parar: docker-compose down
echo  =========================================
echo.

:: Open browser
start http://localhost:3000

pause
