@echo off
REM =========================================
REM Script de Despliegue Automatizado
REM Portal Ciudadano - Agencia de Digitalización Hidalgo
REM =========================================

echo.
echo ========================================
echo   DESPLIEGUE A PRODUCCION
echo ========================================
echo.

REM Verificar que existe .env.production
if not exist ".env.production" (
    echo [ERROR] No existe el archivo .env.production
    echo.
    echo PASOS:
    echo 1. Copia .env.production.example a .env.production
    echo 2. Edita .env.production y agrega tus API keys reales
    echo 3. Ejecuta este script de nuevo
    echo.
    pause
    exit /b 1
)

echo [1/4] Verificando dependencias...
if not exist "node_modules" (
    echo Instalando dependencias...
    call npm install
)

echo.
echo [2/4] Creando build de produccion...
call npm run build

if not exist "dist\index.html" (
    echo [ERROR] El build fallo. Revisa los errores arriba.
    pause
    exit /b 1
)

echo.
echo [3/4] Build completado exitosamente!
echo.
echo Archivos generados en la carpeta: dist\
echo.

echo [4/4] Proximos pasos:
echo.
echo OPCION A - Subir via FTP/SFTP (Recomendado):
echo   1. Abre FileZilla o WinSCP
echo   2. Conecta a: root@31.97.144.118 (puerto 22)
echo   3. Sube TODO el contenido de dist\ a /var/www/html/
echo   4. Sube tambien el archivo .htaccess
echo.
echo OPCION B - Via SSH automatizado:
echo   1. Asegurate de tener Git Bash instalado
echo   2. Ejecuta: bash deploy.sh
echo.
echo ========================================
echo   BUILD COMPLETADO!
echo ========================================
echo.

REM Abrir carpeta dist
explorer dist

pause
