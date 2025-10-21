import { Connection, PublicKey } from '@solana/web3.js';

// Tipos para las notificaciones WebSocket
export interface AccountNotification {
  context: { slot: number };
  value: {
    data: [string, string] | object;
    executable: boolean;
    lamports: number;
    owner: string;
    rentEpoch: number;
    space: number;
  };
}

export interface BlockNotification {
  context: { slot: number };
  value: {
    slot: number;
    err: any;
    block: any;
  };
}

export interface LogsNotification {
  context: { slot: number };
  value: {
    signature: string;
    err: any;
    logs: string[];
  };
}

export interface ProgramNotification {
  context: { slot: number };
  value: {
    pubkey: string;
    account: {
      data: [string, string] | object;
      executable: boolean;
      lamports: number;
      owner: string;
      rentEpoch: number;
      space: number;
    };
  };
}

export interface SignatureNotification {
  context: { slot: number };
  value: {
    err: any;
  } | string;
}

export interface SlotNotification {
  parent: number;
  root: number;
  slot: number;
}

export interface RootNotification {
  result: number;
}

export interface VoteNotification {
  hash: string;
  slots: number[];
  timestamp: number | null;
  signature?: string;
  votePubkey?: string;
}

export class OraculoWebSocketClient {
  private connection: Connection;
  private subscriptions: Map<number, any> = new Map();
  private subscriptionId = 0;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  // ==================== Account Subscriptions ====================

  /**
   * Suscribirse a cambios en una cuenta
   */
  async subscribeAccount(
    pubkey: PublicKey,
    callback: (notification: AccountNotification) => void,
    options?: {
      commitment?: 'processed' | 'confirmed' | 'finalized';
      encoding?: 'base58' | 'base64' | 'jsonParsed';
    }
  ): Promise<number> {
    const subscriptionId = ++this.subscriptionId;
    
    const subscription = this.connection.onAccountChange(
      pubkey,
      (accountInfo, context) => {
        callback({
          context: { slot: context.slot },
          value: {
            data: accountInfo.data,
            executable: accountInfo.executable,
            lamports: accountInfo.lamports,
            owner: accountInfo.owner.toString(),
            rentEpoch: accountInfo.rentEpoch,
            space: accountInfo.space,
          },
        });
      },
      options?.commitment || 'confirmed'
    );

    this.subscriptions.set(subscriptionId, subscription);
    return subscriptionId;
  }

  /**
   * Cancelar suscripción de cuenta
   */
  async unsubscribeAccount(subscriptionId: number): Promise<boolean> {
    const subscription = this.subscriptions.get(subscriptionId);
    if (subscription) {
      await this.connection.removeAccountChangeListener(subscription);
      this.subscriptions.delete(subscriptionId);
      return true;
    }
    return false;
  }

  // ==================== Program Subscriptions ====================

  /**
   * Suscribirse a cambios en cuentas de un programa
   */
  async subscribeProgram(
    programId: PublicKey,
    callback: (notification: ProgramNotification) => void,
    options?: {
      commitment?: 'processed' | 'confirmed' | 'finalized';
      encoding?: 'base58' | 'base64' | 'jsonParsed';
      filters?: any[];
    }
  ): Promise<number> {
    const subscriptionId = ++this.subscriptionId;
    
    const subscription = this.connection.onProgramAccountChange(
      programId,
      (keyedAccountInfo, context) => {
        callback({
          context: { slot: context.slot },
          value: {
            pubkey: keyedAccountInfo.accountId.toString(),
            account: {
              data: keyedAccountInfo.accountInfo.data,
              executable: keyedAccountInfo.accountInfo.executable,
              lamports: keyedAccountInfo.accountInfo.lamports,
              owner: keyedAccountInfo.accountInfo.owner.toString(),
              rentEpoch: keyedAccountInfo.accountInfo.rentEpoch,
              space: keyedAccountInfo.accountInfo.space,
            },
          },
        });
      },
      options?.commitment || 'confirmed'
    );

    this.subscriptions.set(subscriptionId, subscription);
    return subscriptionId;
  }

  /**
   * Cancelar suscripción de programa
   */
  async unsubscribeProgram(subscriptionId: number): Promise<boolean> {
    const subscription = this.subscriptions.get(subscriptionId);
    if (subscription) {
      await this.connection.removeProgramAccountChangeListener(subscription);
      this.subscriptions.delete(subscriptionId);
      return true;
    }
    return false;
  }

  // ==================== Log Subscriptions ====================

  /**
   * Suscribirse a logs de transacciones
   */
  async subscribeLogs(
    filter: 'all' | 'allWithVotes' | { mentions: string[] },
    callback: (notification: LogsNotification) => void,
    options?: {
      commitment?: 'processed' | 'confirmed' | 'finalized';
    }
  ): Promise<number> {
    const subscriptionId = ++this.subscriptionId;
    
    const subscription = this.connection.onLogs(
      filter,
      (logs, context) => {
        callback({
          context: { slot: context.slot },
          value: {
            signature: logs.signature,
            err: logs.err,
            logs: logs.logs,
          },
        });
      },
      options?.commitment || 'confirmed'
    );

    this.subscriptions.set(subscriptionId, subscription);
    return subscriptionId;
  }

  /**
   * Cancelar suscripción de logs
   */
  async unsubscribeLogs(subscriptionId: number): Promise<boolean> {
    const subscription = this.subscriptions.get(subscriptionId);
    if (subscription) {
      await this.connection.removeOnLogsListener(subscription);
      this.subscriptions.delete(subscriptionId);
      return true;
    }
    return false;
  }

  // ==================== Signature Subscriptions ====================

  /**
   * Suscribirse a confirmación de firma
   */
  async subscribeSignature(
    signature: string,
    callback: (notification: SignatureNotification) => void,
    options?: {
      commitment?: 'processed' | 'confirmed' | 'finalized';
      enableReceivedNotification?: boolean;
    }
  ): Promise<number> {
    const subscriptionId = ++this.subscriptionId;
    
    const subscription = this.connection.onSignature(
      signature,
      (result, context) => {
        callback({
          context: { slot: context.slot },
          value: result,
        });
      },
      options?.commitment || 'confirmed'
    );

    this.subscriptions.set(subscriptionId, subscription);
    return subscriptionId;
  }

  /**
   * Cancelar suscripción de firma
   */
  async unsubscribeSignature(subscriptionId: number): Promise<boolean> {
    const subscription = this.subscriptions.get(subscriptionId);
    if (subscription) {
      await this.connection.removeSignatureListener(subscription);
      this.subscriptions.delete(subscriptionId);
      return true;
    }
    return false;
  }

  // ==================== Slot Subscriptions ====================

  /**
   * Suscribirse a cambios de slot
   */
  async subscribeSlot(
    callback: (notification: SlotNotification) => void
  ): Promise<number> {
    const subscriptionId = ++this.subscriptionId;
    
    const subscription = this.connection.onSlotChange((slotInfo) => {
      callback({
        parent: slotInfo.parent,
        root: slotInfo.root,
        slot: slotInfo.slot,
      });
    });

    this.subscriptions.set(subscriptionId, subscription);
    return subscriptionId;
  }

  /**
   * Cancelar suscripción de slot
   */
  async unsubscribeSlot(subscriptionId: number): Promise<boolean> {
    const subscription = this.subscriptions.get(subscriptionId);
    if (subscription) {
      await this.connection.removeSlotChangeListener(subscription);
      this.subscriptions.delete(subscriptionId);
      return true;
    }
    return false;
  }

  // ==================== Root Subscriptions ====================

  /**
   * Suscribirse a cambios de root
   */
  async subscribeRoot(
    callback: (notification: RootNotification) => void
  ): Promise<number> {
    const subscriptionId = ++this.subscriptionId;
    
    const subscription = this.connection.onRootChange((root) => {
      callback({
        result: root,
      });
    });

    this.subscriptions.set(subscriptionId, subscription);
    return subscriptionId;
  }

  /**
   * Cancelar suscripción de root
   */
  async unsubscribeRoot(subscriptionId: number): Promise<boolean> {
    const subscription = this.subscriptions.get(subscriptionId);
    if (subscription) {
      await this.connection.removeRootChangeListener(subscription);
      this.subscriptions.delete(subscriptionId);
      return true;
    }
    return false;
  }

  // ==================== Utility Methods ====================

  /**
   * Cancelar todas las suscripciones
   */
  async unsubscribeAll(): Promise<void> {
    for (const [subscriptionId, subscription] of this.subscriptions) {
      try {
        await subscription();
      } catch (error) {
        console.error(`Error unsubscribing ${subscriptionId}:`, error);
      }
    }
    this.subscriptions.clear();
  }

  /**
   * Obtener número de suscripciones activas
   */
  getActiveSubscriptions(): number {
    return this.subscriptions.size;
  }

  /**
   * Verificar si una suscripción está activa
   */
  isSubscriptionActive(subscriptionId: number): boolean {
    return this.subscriptions.has(subscriptionId);
  }

  // ==================== Advanced Monitoring ====================

  /**
   * Monitorear transacciones de una dirección en tiempo real
   */
  async monitorAddressTransactions(
    address: PublicKey,
    callback: (logs: LogsNotification) => void
  ): Promise<number> {
    return await this.subscribeLogs(
      { mentions: [address.toString()] },
      callback,
      { commitment: 'confirmed' }
    );
  }

  /**
   * Monitorear cambios en cuentas de token
   */
  async monitorTokenAccounts(
    owner: PublicKey,
    callback: (notification: ProgramNotification) => void
  ): Promise<number> {
    // SPL Token Program ID
    const tokenProgramId = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
    
    return await this.subscribeProgram(
      tokenProgramId,
      (notification) => {
        // Filtrar solo cuentas del propietario
        if (notification.value.account.owner === owner.toString()) {
          callback(notification);
        }
      },
      { commitment: 'confirmed' }
    );
  }

  /**
   * Monitorear mercado de predicción específico
   */
  async monitorMarket(
    marketPubkey: PublicKey,
    callback: (notification: AccountNotification) => void
  ): Promise<number> {
    return await this.subscribeAccount(
      marketPubkey,
      callback,
      { commitment: 'confirmed', encoding: 'jsonParsed' }
    );
  }

  /**
   * Monitorear confirmación de transacción
   */
  async monitorTransactionConfirmation(
    signature: string,
    callback: (confirmed: boolean, err?: any) => void
  ): Promise<number> {
    return await this.subscribeSignature(
      signature,
      (notification) => {
        if (typeof notification.value === 'string') {
          // Transacción recibida
          callback(true);
        } else if (notification.value.err) {
          // Transacción falló
          callback(false, notification.value.err);
        } else {
          // Transacción confirmada
          callback(true);
        }
      },
      { commitment: 'confirmed' }
    );
  }
}

// Utilidades para crear clientes WebSocket
export function createWebSocketClient(connection: Connection): OraculoWebSocketClient {
  return new OraculoWebSocketClient(connection);
}

export function createDevnetWebSocketClient(): OraculoWebSocketClient {
  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
  return new OraculoWebSocketClient(connection);
}

export function createMainnetWebSocketClient(): OraculoWebSocketClient {
  const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
  return new OraculoWebSocketClient(connection);
}
