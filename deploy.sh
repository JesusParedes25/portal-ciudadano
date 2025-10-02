#!/bin/bash
# =========================================
# Script de Despliegue Automatizado (SSH)
# Portal Ciudadano - Agencia de Digitalización Hidalgo
# =========================================

set -e  # Detener en caso de error

echo ""
echo "========================================"
echo "  DESPLIEGUE AUTOMATIZADO A PRODUCCION"
echo "========================================"
echo ""

# Variables
SERVER="root@31.97.144.118"
REMOTE_DIR="/var/www/html"
BUILD_FILE="build.tar.gz"

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar .env.production
if [ ! -f ".env.production" ]; then
    echo -e "${RED}[ERROR]${NC} No existe el archivo .env.production"
    echo ""
    echo "PASOS:"
    echo "1. Copia .env.production.example a .env.production"
    echo "2. Edita .env.production y agrega tus API keys reales"
    echo "3. Ejecuta este script de nuevo"
    echo ""
    exit 1
fi

# Paso 1: Build
echo -e "${YELLOW}[1/6]${NC} Creando build de producción..."
npm run build

if [ ! -f "dist/index.html" ]; then
    echo -e "${RED}[ERROR]${NC} El build falló. Revisa los errores arriba."
    exit 1
fi

echo -e "${GREEN}✓${NC} Build completado"

# Paso 2: Comprimir
echo -e "${YELLOW}[2/6]${NC} Comprimiendo archivos..."
cd dist
tar -czf ../$BUILD_FILE .
cd ..
echo -e "${GREEN}✓${NC} Archivos comprimidos"

# Paso 3: Backup del servidor
echo -e "${YELLOW}[3/6]${NC} Haciendo backup en el servidor..."
ssh $SERVER "cd $REMOTE_DIR && tar -czf ~/backup-$(date +%Y%m%d-%H%M%S).tar.gz . 2>/dev/null || true"
echo -e "${GREEN}✓${NC} Backup completado"

# Paso 4: Subir archivos
echo -e "${YELLOW}[4/6]${NC} Subiendo archivos al servidor..."
scp $BUILD_FILE $SERVER:/tmp/
scp .htaccess $SERVER:/tmp/
echo -e "${GREEN}✓${NC} Archivos subidos"

# Paso 5: Desplegar en servidor
echo -e "${YELLOW}[5/6]${NC} Desplegando en servidor..."
ssh $SERVER << 'ENDSSH'
cd /var/www/html
rm -rf *
tar -xzf /tmp/build.tar.gz
mv /tmp/.htaccess .
rm /tmp/build.tar.gz
chmod 644 index.html .htaccess
chmod 755 assets
find assets -type f -exec chmod 644 {} \;
echo "✓ Desplegado en servidor"
ENDSSH

echo -e "${GREEN}✓${NC} Despliegue completado"

# Paso 6: Limpiar archivos temporales
echo -e "${YELLOW}[6/6]${NC} Limpiando archivos temporales..."
rm $BUILD_FILE
echo -e "${GREEN}✓${NC} Limpieza completada"

echo ""
echo "========================================"
echo -e "  ${GREEN}DESPLIEGUE EXITOSO!${NC}"
echo "========================================"
echo ""
echo "🌐 Tu sitio: https://srv885729.hstgr.cloud/"
echo ""
echo "Proximos pasos:"
echo "1. Visita tu sitio y verifica que todo funcione"
echo "2. Prueba el chatbot y el mapa"
echo "3. Verifica la consola del navegador (F12)"
echo ""
echo "Monitoreo de APIs:"
echo "- OpenAI: https://platform.openai.com/usage"
echo "- Google Maps: https://console.cloud.google.com/"
echo ""
