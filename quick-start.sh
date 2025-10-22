#!/bin/bash

# 🔮 Oráculo Quick Start Script
# 
# Script de inicio rápido para el proyecto Oráculo
# 
# @author Blockchain & Web3 Developer Full Stack Senior
# @version 1.0.0

set -e

# ==================== Colors ====================
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# ==================== Functions ====================

print_header() {
    clear
    echo -e "${PURPLE}"
    echo "  ██████  ██████   █████  ██    ██  ██████  ██      ██    ██ "
    echo " ██      ██   ██ ██   ██ ██    ██ ██    ██ ██      ██    ██ "
    echo " ██      ██████  ███████ ██    ██ ██    ██ ██      ██    ██ "
    echo " ██      ██   ██ ██   ██  ██  ██  ██    ██ ██      ██    ██ "
    echo "  ██████ ██   ██ ██   ██   ████    ██████  ███████  ██████  "
    echo -e "${NC}"
    echo -e "${CYAN}🔮 Mercado de Predicciones Descentralizado en Solana${NC}"
    echo -e "${CYAN}====================================================${NC}"
    echo ""
}

print_step() {
    echo -e "${BLUE}📦 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

# ==================== Check System ====================

check_system() {
    print_step "Verificando sistema..."
    
    # Check OS
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        print_info "Sistema: Linux"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        print_info "Sistema: macOS"
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
        print_info "Sistema: Windows"
    else
        print_warning "Sistema no reconocido: $OSTYPE"
    fi
    
    # Check Node.js
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_info "Node.js: $NODE_VERSION"
    else
        print_error "Node.js no está instalado. Por favor instala Node.js 18+ desde https://nodejs.org"
        exit 1
    fi
    
    # Check npm
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        print_info "npm: $NPM_VERSION"
    else
        print_error "npm no está instalado"
        exit 1
    fi
    
    print_success "Sistema verificado"
}

# ==================== Install Dependencies ====================

install_dependencies() {
    print_step "Instalando dependencias..."
    
    # Install root dependencies
    if [ -f "package.json" ]; then
        npm install
        print_success "Dependencias raíz instaladas"
    fi
    
    # Install frontend dependencies
    if [ -d "frontend" ]; then
        cd frontend
        npm install
        cd ..
        print_success "Dependencias del frontend instaladas"
    fi
    
    print_success "Todas las dependencias instaladas"
}

# ==================== Setup Environment ====================

setup_environment() {
    print_step "Configurando entorno..."
    
    # Copy environment file if it doesn't exist
    if [ ! -f ".env" ] && [ -f "env.example" ]; then
        cp env.example .env
        print_success "Archivo .env creado desde env.example"
    fi
    
    # Create frontend .env.local if it doesn't exist
    if [ -d "frontend" ] && [ ! -f "frontend/.env.local" ]; then
        cat > frontend/.env.local << EOF
# Oráculo Frontend Environment
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Oráculo
NEXT_PUBLIC_ENABLE_PWA=true
NEXT_PUBLIC_ENABLE_SW=true
NEXT_PUBLIC_DEBUG=true
EOF
        print_success "Archivo frontend/.env.local creado"
    fi
    
    print_success "Entorno configurado"
}

# ==================== Start Development ====================

start_development() {
    print_step "Iniciando desarrollo..."
    
    # Start frontend in background
    if [ -d "frontend" ]; then
        cd frontend
        print_info "Iniciando servidor de desarrollo en http://localhost:3000"
        npm run dev &
        FRONTEND_PID=$!
        cd ..
        
        # Wait a moment for the server to start
        sleep 3
        
        print_success "Servidor de desarrollo iniciado (PID: $FRONTEND_PID)"
        print_info "Frontend disponible en: http://localhost:3000"
    fi
}

# ==================== Show Information ====================

show_information() {
    print_step "Información del proyecto"
    
    echo -e "${CYAN}📋 Características principales:${NC}"
    echo "  • 🔮 Mercados de predicción descentralizados"
    echo "  • ⚡ Construido en Solana blockchain"
    echo "  • 📱 PWA (Progressive Web App)"
    echo "  • 🎨 Interfaz moderna con Next.js 14"
    echo "  • 🔐 Integración completa de wallets"
    echo "  • 📊 Dashboard en tiempo real"
    echo "  • 🛡️ Seguridad y mejores prácticas"
    
    echo ""
    echo -e "${CYAN}🚀 URLs importantes:${NC}"
    echo "  • Frontend: http://localhost:3000"
    echo "  • Solana Cookbook: http://localhost:3000/solana-cookbook"
    echo "  • Documentación: README.md"
    
    echo ""
    echo -e "${CYAN}🔧 Comandos útiles:${NC}"
    echo "  • npm run dev          - Iniciar desarrollo"
    echo "  • npm run build        - Construir para producción"
    echo "  • npm run start        - Iniciar servidor de producción"
    echo "  • npm run lint         - Verificar código"
    echo "  • npm run type-check   - Verificar tipos TypeScript"
    
    echo ""
    echo -e "${CYAN}📚 Recursos:${NC}"
    echo "  • Solana Docs: https://docs.solana.com"
    echo "  • Anchor Docs: https://anchor-lang.com"
    echo "  • Next.js Docs: https://nextjs.org/docs"
    echo "  • Tailwind CSS: https://tailwindcss.com/docs"
    
    echo ""
    echo -e "${CYAN}🎯 Próximos pasos:${NC}"
    echo "  1. Abre http://localhost:3000 en tu navegador"
    echo "  2. Conecta tu wallet Solana"
    echo "  3. Explora los mercados de predicción"
    echo "  4. Crea tu primer mercado"
    echo "  5. ¡Disfruta de Oráculo!"
}

# ==================== Cleanup ====================

cleanup() {
    print_step "Limpiando procesos..."
    
    # Kill frontend process if running
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
        print_success "Proceso del frontend terminado"
    fi
    
    print_success "Limpieza completada"
}

# ==================== Main Execution ====================

main() {
    print_header
    
    # Set up signal handlers
    trap cleanup EXIT INT TERM
    
    # Execute steps
    check_system
    install_dependencies
    setup_environment
    start_development
    show_information
    
    print_success "🎉 ¡Oráculo está listo para usar!"
    echo -e "${CYAN}🔮 Abre http://localhost:3000 en tu navegador para comenzar${NC}"
    echo ""
    echo -e "${YELLOW}💡 Presiona Ctrl+C para detener el servidor${NC}"
    
    # Keep script running
    wait
}

# ==================== Execute ====================

main "$@"
