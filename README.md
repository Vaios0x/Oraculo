# 🔮 OráculoS - Mercado de Predicciones Descentralizado

## 📖 Descripción

**OráculoS** es una plataforma descentralizada de mercado de predicciones que permite a los usuarios crear, participar y ganar en mercados de predicción sobre eventos futuros. La aplicación utiliza tecnología blockchain para garantizar transparencia, inmutabilidad y pagos automáticos.

## ✨ Características Principales

### 🎯 Mercados de Predicción

* **Creación de Mercados**: Los usuarios pueden crear mercados de predicción sobre cualquier evento
* **Participación**: Compra y venta de acciones en diferentes resultados
* **Liquidación Automática**: Resolución automática basada en datos del mundo real
* **Transparencia Total**: Todas las transacciones son públicas y verificables

### 💰 Sistema de Recompensas

* **Pagos Automáticos**: Los ganadores reciben sus recompensas automáticamente
* **Comisiones**: Sistema de comisiones para creadores de mercados
* **Pool de Liquidez**: Mecanismo de liquidez para mercados activos

### 🔒 Seguridad y Descentralización

* **Smart Contracts**: Lógica de negocio ejecutada en blockchain
* **Oracles**: Integración con oráculos para datos del mundo real
* **Custodia Descentralizada**: Los usuarios mantienen control total de sus fondos

## 🚀 Tecnologías Utilizadas

* **Frontend**: React, TypeScript, Tailwind CSS
* **Blockchain**: Solana
* **Smart Contracts**: Anchor Framework
* **Oracles**: Pyth Network, Switchboard
* **Wallet**: Phantom, Solflare
* **PWA**: Progressive Web App para experiencia móvil

## 📱 Experiencia de Usuario

### Para Creadores de Mercados

1. **Crear Mercado**: Define el evento, fechas y opciones
2. **Configurar Parámetros**: Establece comisiones y reglas de liquidación
3. **Promocionar**: Comparte tu mercado con la comunidad

### Para Participantes

1. **Explorar Mercados**: Navega por mercados activos y populares
2. **Analizar**: Revisa datos históricos y tendencias
3. **Invertir**: Compra acciones en tus predicciones favoritas
4. **Monitorear**: Sigue el rendimiento de tus inversiones

## 🎮 Tipos de Mercados Soportados

* **Deportes**: Resultados de partidos, campeonatos, récords
* **Política**: Elecciones, decisiones gubernamentales, encuestas
* **Economía**: Precios de activos, indicadores económicos, criptomonedas
* **Tecnología**: Lanzamientos de productos, adopción de tecnologías
* **Entretenimiento**: Premios, audiencias, eventos culturales
* **Ciencia**: Descubrimientos, avances tecnológicos, investigaciones

## 🔧 Instalación y Configuración

### Prerrequisitos

* Node.js 18+
* Rust 1.70+
* Solana CLI
* Anchor Framework

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Vaios0x/Oraculo.git
cd Oraculo

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Compilar smart contracts
npm run anchor:build

# Desplegar contratos
npm run anchor:deploy

# Iniciar aplicación
npm run dev
```

### 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Iniciar servidor de desarrollo
npm run build            # Construir aplicación
npm run start            # Iniciar aplicación en producción

# Solana
npm run anchor:build     # Compilar programas Anchor
npm run anchor:deploy    # Desplegar programas
npm run anchor:test      # Ejecutar pruebas
npm run solana:setup     # Configurar Solana CLI
npm run solana:balance   # Verificar balance

# Ejemplos
npm run examples:accounts     # Ejecutar ejemplos de cuentas
npm run examples:transactions # Ejecutar ejemplos de transacciones
npm run examples:programs     # Ejecutar ejemplos de programas
```

### 📚 Ejemplos de Uso

#### Leer Cuentas de Solana
```typescript
import { SolanaAccountManager, AccountUtils } from '@/utils/solana-accounts';

// Crear conexión
const connection = AccountUtils.createConnection();
const accountManager = new SolanaAccountManager(connection);

// Obtener información de cuenta
const account = await accountManager.fetchWalletAccount(publicKey);
console.log(accountManager.formatAccountData(account));
```

#### Analizar Tipos de Cuentas
```typescript
import { AccountExamples } from '@/examples/account-examples';

// Ejemplos incluidos
await AccountExamples.fetchWalletAccount();
await AccountExamples.fetchProgramAccount();
await AccountExamples.fetchMintAccount();
await AccountExamples.compareAccountTypes();
await AccountExamples.analyzeAccount("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
```

#### Escribir Transacciones a Solana
```typescript
import { SolanaTransactionManager, TransactionUtils } from '@/utils/solana-transactions';

// Crear manager de transacciones
const connection = TransactionUtils.createConnection();
const transactionManager = new SolanaTransactionManager(connection);

// Transferir SOL
const result = await transactionManager.transferSOL({
  from: senderPublicKey,
  to: receiverPublicKey,
  amount: 0.1, // 0.1 SOL
  signer: senderKeypair
});

// Crear token
const tokenResult = await transactionManager.createToken({
  wallet: walletKeypair,
  decimals: 6,
  mintAuthority: walletKeypair.publicKey
});
```

#### Ejemplos de Transacciones
```typescript
import { TransactionExamples } from '@/examples/transaction-examples';

// Ejemplos incluidos
await TransactionExamples.transferSOL();        // Transferir SOL
await TransactionExamples.createToken();        // Crear token
await TransactionExamples.mintTokens();         // Mintear tokens
await TransactionExamples.transferTokens();     // Transferir tokens
await TransactionExamples.complexTransaction(); // Transacciones complejas
```

#### Desarrollar y Desplegar Programas
```typescript
import { ProgramExamples } from '@/examples/program-examples';

// Ejemplos de desarrollo de programas
await ProgramExamples.deployHelloAnchor();        // Desplegar programa
await ProgramExamples.interactionPatterns();      // Patrones de interacción
await ProgramExamples.testingStrategies();       // Estrategias de testing
await ProgramExamples.deploymentChecklist();      // Checklist de despliegue
await ProgramExamples.debuggingTechniques();     // Técnicas de debugging
await ProgramExamples.upgradeStrategies();       // Estrategias de upgrade
```

#### Programa Hello Anchor Completo
```rust
// programs/hello-anchor/src/lib.rs
use anchor_lang::prelude::*;

#[program]
mod hello_anchor {
    use super::*;
    
    pub fn initialize(ctx: Context<Initialize>, data: u64) -> Result<()> {
        ctx.accounts.new_account.data = data;
        msg!("Changed data to: {}!", data);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, space = 8 + 8)]
    pub new_account: Account<'info, NewAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct NewAccount {
    data: u64
}
```

#### Testing Completo
```typescript
// tests/hello-anchor.test.ts
describe("Hello Anchor", () => {
  it("Initialize account with data", async () => {
    const newAccountKp = anchor.web3.Keypair.generate();
    const data = new anchor.BN(42);
    
    const txHash = await program.methods
      .initialize(data)
      .accounts({
        newAccount: newAccountKp.publicKey,
        signer: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      })
      .signers([newAccountKp])
      .rpc();
    
    const newAccount = await program.account.newAccount.fetch(
      newAccountKp.publicKey
    );
    
    expect(data.eq(newAccount.data)).to.be.true;
  });
});
```

## 📊 Arquitectura del Sistema

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend PWA  │    │  Smart Contracts│    │   Oracle Data   │
│                 │    │                 │    │                 │
│  - React/TS     │◄──►│  - Anchor       │◄──►│  - Pyth Network │
│  - Wallet Conn  │    │  - Solana       │    │  - Switchboard  │
│  - UI/UX        │    │  - SPL Tokens   │    │  - Chainlink    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🎯 Roadmap

### Fase 1 - MVP (Actual)

* Interfaz básica de usuario
* Conexión de wallet
* Creación de mercados simples
* Sistema de trading básico

### Fase 2 - Expansión

* Mercados complejos (múltiples resultados)
* Sistema de reputación
* Análisis avanzado y gráficos
* API pública

### Fase 3 - Escalabilidad

* Mercados de alta frecuencia
* Integración con más oráculos
* Mobile app nativa
* Gobernanza descentralizada

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🔗 Enlaces Útiles

* [Documentación](https://docs.oraculos.dev)
* [Discord](https://discord.gg/oraculos)
* [Twitter](https://twitter.com/oraculos_dev)
* [Telegram](https://t.me/oraculos)

## 💡 ¿Por qué OráculoS?

En un mundo lleno de incertidumbre, **OráculoS** democratiza el acceso a la información del futuro. No solo es una plataforma de trading, es una herramienta para:

* **Investigación**: Los precios de mercado reflejan la sabiduría colectiva
* **Hedge**: Protege contra riesgos específicos
* **Especulación**: Aprovecha tu conocimiento sobre eventos futuros
* **Entretenimiento**: Participa en mercados sobre temas que te interesan

---

**¡El futuro es predecible con OráculoS! 🔮✨**
