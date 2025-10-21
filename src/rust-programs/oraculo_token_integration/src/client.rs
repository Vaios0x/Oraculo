use solana_client::{
    rpc_client::RpcClient,
    rpc_config::{RpcSendTransactionConfig, RpcTransactionConfig},
    rpc_response::RpcResult,
};
use solana_sdk::{
    commitment_config::{CommitmentConfig, CommitmentLevel},
    instruction::{AccountMeta, Instruction},
    pubkey::Pubkey,
    signature::{Keypair, Signer},
    system_instruction,
    transaction::Transaction,
    hash::Hash,
};
use std::str::FromStr;
use std::time::Duration;

use crate::{TokenIntegrationInstruction, TokenMarket};

/// Cliente para interactuar con el programa Oráculo
pub struct OraculoClient {
    rpc_client: RpcClient,
    program_id: Pubkey,
}

impl OraculoClient {
    /// Crear un nuevo cliente Oráculo con configuración optimizada
    pub fn new(rpc_url: &str, program_id: Pubkey) -> Self {
        let rpc_client = RpcClient::new_with_commitment(
            rpc_url.to_string(),
            CommitmentConfig {
                commitment: CommitmentLevel::Confirmed,
            },
        );
        
        Self {
            rpc_client,
            program_id,
        }
    }

    /// Crear cliente con configuración personalizada
    pub fn new_with_config(
        rpc_url: &str, 
        program_id: Pubkey, 
        timeout: Duration,
        commitment: CommitmentLevel,
    ) -> Self {
        let rpc_client = RpcClient::new_with_timeout_and_commitment(
            rpc_url.to_string(),
            timeout,
            CommitmentConfig { commitment },
        );
        
        Self {
            rpc_client,
            program_id,
        }
    }

    /// Crear un mercado de predicción
    pub fn create_market(
        &self,
        payer: &Keypair,
        market_account: &Keypair,
        token_mint: &Pubkey,
        market_token_account: &Pubkey,
        title: String,
        description: String,
        end_time: i64,
        outcome_options: Vec<String>,
        token_decimals: u8,
    ) -> Result<String, Box<dyn std::error::Error>> {
        let instruction = Instruction {
            program_id: self.program_id,
            accounts: vec![
                AccountMeta::new(payer.pubkey(), true),
                AccountMeta::new(market_account.pubkey(), false),
                AccountMeta::new(*token_mint, false),
                AccountMeta::new(*market_token_account, false),
                AccountMeta::new_readonly(spl_token::id(), false),
                AccountMeta::new_readonly(system_program::id(), false),
            ],
            data: TokenIntegrationInstruction::CreateTokenMarket {
                title,
                description,
                end_time,
                outcome_options,
                token_decimals,
            }
            .try_to_vec()?,
        };

        let recent_blockhash = self.rpc_client.get_latest_blockhash()?;
        let transaction = Transaction::new_signed_with_payer(
            &[instruction],
            Some(&payer.pubkey()),
            &[payer, market_account],
            recent_blockhash,
        );

        // Configuración optimizada para envío de transacciones
        let config = RpcSendTransactionConfig {
            skip_preflight: false,
            preflight_commitment: Some(CommitmentLevel::Confirmed),
            max_retries: Some(3),
            min_context_slot: None,
        };

        let signature = self.rpc_client.send_and_confirm_transaction_with_config(
            &transaction,
            config,
        )?;
        Ok(signature.to_string())
    }

    /// Hacer una apuesta en un mercado
    pub fn stake_tokens(
        &self,
        bettor: &Keypair,
        market_account: &Pubkey,
        bettor_token_account: &Pubkey,
        market_token_account: &Pubkey,
        market_id: Pubkey,
        outcome_index: u8,
        amount: u64,
    ) -> Result<String, Box<dyn std::error::Error>> {
        let instruction = Instruction {
            program_id: self.program_id,
            accounts: vec![
                AccountMeta::new(bettor.pubkey(), true),
                AccountMeta::new(*market_account, false),
                AccountMeta::new(*bettor_token_account, false),
                AccountMeta::new(*market_token_account, false),
                AccountMeta::new_readonly(spl_token::id(), false),
            ],
            data: TokenIntegrationInstruction::StakeTokens {
                market_id,
                outcome_index,
                amount,
            }
            .try_to_vec()?,
        };

        let recent_blockhash = self.rpc_client.get_latest_blockhash()?;
        let transaction = Transaction::new_signed_with_payer(
            &[instruction],
            Some(&bettor.pubkey()),
            &[bettor],
            recent_blockhash,
        );

        let signature = self.rpc_client.send_and_confirm_transaction(&transaction)?;
        Ok(signature.to_string())
    }

    /// Distribuir ganancias de un mercado
    pub fn distribute_winnings(
        &self,
        creator: &Keypair,
        market_account: &Pubkey,
        market_token_account: &Pubkey,
        market_id: Pubkey,
        winning_outcome: u8,
    ) -> Result<String, Box<dyn std::error::Error>> {
        let instruction = Instruction {
            program_id: self.program_id,
            accounts: vec![
                AccountMeta::new(creator.pubkey(), true),
                AccountMeta::new(*market_account, false),
                AccountMeta::new(*market_token_account, false),
                AccountMeta::new_readonly(spl_token::id(), false),
            ],
            data: TokenIntegrationInstruction::DistributeWinnings {
                market_id,
                winning_outcome,
            }
            .try_to_vec()?,
        };

        let recent_blockhash = self.rpc_client.get_latest_blockhash()?;
        let transaction = Transaction::new_signed_with_payer(
            &[instruction],
            Some(&creator.pubkey()),
            &[creator],
            recent_blockhash,
        );

        let signature = self.rpc_client.send_and_confirm_transaction(&transaction)?;
        Ok(signature.to_string())
    }

    /// Obtener información de un mercado
    pub fn get_market(&self, market_account: &Pubkey) -> Result<TokenMarket, Box<dyn std::error::Error>> {
        let account_data = self.rpc_client.get_account_data(market_account)?;
        let market = TokenMarket::try_from_slice(&account_data)?;
        Ok(market)
    }

    /// Obtener el balance de una cuenta
    pub fn get_balance(&self, pubkey: &Pubkey) -> Result<u64, Box<dyn std::error::Error>> {
        let balance = self.rpc_client.get_balance(pubkey)?;
        Ok(balance)
    }

    /// Obtener información de una transacción
    pub fn get_transaction(&self, signature: &str) -> Result<serde_json::Value, Box<dyn std::error::Error>> {
        let signature = bs58::decode(signature).into_vec()?;
        let signature = solana_sdk::signature::Signature::try_from(signature.as_slice())?;
        let transaction = self.rpc_client.get_transaction(&signature, solana_client::rpc_config::RpcTransactionConfig::default())?;
        Ok(serde_json::to_value(transaction)?)
    }
}

/// Utilidades para el cliente Oráculo
pub mod utils {
    use super::*;
    use solana_sdk::pubkey::Pubkey;

    /// Crear un cliente para devnet
    pub fn create_devnet_client(program_id: &str) -> Result<OraculoClient, Box<dyn std::error::Error>> {
        let program_id = Pubkey::from_str(program_id)?;
        Ok(OraculoClient::new("https://api.devnet.solana.com", program_id))
    }

    /// Crear un cliente para mainnet
    pub fn create_mainnet_client(program_id: &str) -> Result<OraculoClient, Box<dyn std::error::Error>> {
        let program_id = Pubkey::from_str(program_id)?;
        Ok(OraculoClient::new("https://api.mainnet-beta.solana.com", program_id))
    }

    /// Crear un cliente para localhost
    pub fn create_local_client(program_id: &str) -> Result<OraculoClient, Box<dyn std::error::Error>> {
        let program_id = Pubkey::from_str(program_id)?;
        Ok(OraculoClient::new("http://127.0.0.1:8899", program_id))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use solana_sdk::signature::Keypair;

    #[test]
    fn test_client_creation() {
        let program_id = Pubkey::new_unique();
        let client = OraculoClient::new("https://api.devnet.solana.com", program_id);
        assert_eq!(client.program_id, program_id);
    }

    #[test]
    fn test_utils() {
        let program_id = "11111111111111111111111111111111";
        let client = utils::create_devnet_client(program_id);
        assert!(client.is_ok());
    }
}
