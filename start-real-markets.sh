#!/bin/bash

# 🔮 OráculoS - Script de Inicio para Mercados Reales
# Script para iniciar el sistema completo de mercados de predicciones

echo "🔮 Iniciando OráculoS - Sistema de Mercados Reales"
echo "=================================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Función para mostrar mensajes con colores
show_message() {
    echo -e "${2}${1}${NC}"
}

# Verificar si estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    show_message "❌ Error: No se encontró package.json. Ejecuta este script desde la raíz del proyecto." $RED
    exit 1
fi

# Verificar Node.js
if ! command -v node &> /dev/null; then
    show_message "❌ Error: Node.js no está instalado. Por favor instala Node.js 18+" $RED
    exit 1
fi

# Verificar npm
if ! command -v npm &> /dev/null; then
    show_message "❌ Error: npm no está instalado." $RED
    exit 1
fi

show_message "✅ Verificaciones completadas" $GREEN

# Navegar al directorio frontend
cd frontend

# Verificar si node_modules existe
if [ ! -d "node_modules" ]; then
    show_message "📦 Instalando dependencias..." $YELLOW
    npm install
    if [ $? -ne 0 ]; then
        show_message "❌ Error al instalar dependencias" $RED
        exit 1
    fi
    show_message "✅ Dependencias instaladas" $GREEN
else
    show_message "✅ Dependencias ya instaladas" $GREEN
fi

# Verificar configuración de Solana
show_message "🔧 Verificando configuración de Solana..." $BLUE

# Verificar si solana CLI está instalado
if ! command -v solana &> /dev/null; then
    show_message "⚠️  Solana CLI no está instalado. Instalando..." $YELLOW
    sh -c "$(curl -sSfL https://release.solana.com/v1.18.4/install)"
    export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
fi

# Configurar Solana para devnet
solana config set --url devnet
show_message "✅ Solana configurado para devnet" $GREEN

# Verificar balance
BALANCE=$(solana balance 2>/dev/null | awk '{print $1}')
if [ -z "$BALANCE" ] || [ "$BALANCE" = "0" ]; then
    show_message "💰 Solicitando airdrop de SOL..." $YELLOW
    solana airdrop 2
    if [ $? -eq 0 ]; then
        show_message "✅ Airdrop recibido" $GREEN
    else
        show_message "⚠️  No se pudo obtener airdrop. Puedes solicitarlo manualmente con: solana airdrop 2" $YELLOW
    fi
else
    show_message "✅ Balance actual: $BALANCE SOL" $GREEN
fi

# Mostrar información del programa
show_message "📋 Información del Programa:" $CYAN
echo "   Program ID: 7uxEQsj9W6Kvf6Fimd2NkuYMxmY75Cs4KyZMMcJmqEL2"
echo "   Red: Solana Devnet"
echo "   Explorer: https://explorer.solana.com/address/7uxEQsj9W6Kvf6Fimd2NkuYMxmY75Cs4KyZMMcJmqEL2?cluster=devnet"

# Iniciar el servidor de desarrollo
show_message "🚀 Iniciando servidor de desarrollo..." $PURPLE
echo ""
echo "🌐 La aplicación estará disponible en: http://localhost:3000"
echo ""
echo "📱 Funcionalidades disponibles:"
echo "   • Crear Mercados Reales - Crear mercados de predicciones en Solana"
echo "   • Mercados Reales - Ver mercados existentes"
echo "   • Oracle Demo - Probar funcionalidades del programa"
echo "   • Plantillas - Usar plantillas predefinidas"
echo ""
echo "🔗 Enlaces útiles:"
echo "   • Solana Explorer: https://explorer.solana.com/?cluster=devnet"
echo "   • Solana Cookbook: https://solanacookbook.com/"
echo "   • Documentación: https://docs.solana.com/"
echo ""

# Iniciar el servidor
npm run dev
