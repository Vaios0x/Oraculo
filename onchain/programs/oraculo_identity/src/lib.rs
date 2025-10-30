use anchor_lang::prelude::*;

declare_id!("GjRYbLkypR51mhWpYEj5py7tfi1b3VPR3Hk51yYytSvd");

#[program]
pub mod oraculo_identity {
    use super::*;

    pub fn init_config(
        ctx: Context<InitConfig>,
        allowed_issuers_root: [u8; 32],
        version: u32,
    ) -> Result<()> {
        let cfg = &mut ctx.accounts.verifier_config;
        cfg.admin = ctx.accounts.admin.key();
        cfg.allowed_issuers_root = allowed_issuers_root;
        cfg.version = version;
        Ok(())
    }

    pub fn verify_identity_proof(
        ctx: Context<VerifyIdentityProof>,
        vk_id: [u8; 32],
        predicate_hash: [u8; 32],
        issuer_hash: [u8; 32],
        expires_at: u64,
        nonce: [u8; 16],
        public_inputs: Vec<u8>,
        proof: Vec<u8>,
    ) -> Result<()> {
        // Initialize verifier_config if it doesn't exist
        if ctx.accounts.verifier_config.version == 0 {
            let config = &mut ctx.accounts.verifier_config;
            config.version = 1;
            config.admin = ctx.accounts.subject.key();
            config.allowed_issuers_root = [0u8; 32]; // Empty for now
        }

        // Initialize nonce_pda if it doesn't exist
        if ctx.accounts.nonce_pda.subject == Pubkey::default() {
            let nonce_pda = &mut ctx.accounts.nonce_pda;
            nonce_pda.subject = ctx.accounts.subject.key();
            nonce_pda.slot = 0; // Will be set below
            nonce_pda.nonce = [0u8; 16]; // Will be set below
        }

        // Placeholder verification: ensure lengths are non-zero.
        // Replace with SP1 or verifier-specific check.
        require!(proof.len() > 0 && public_inputs.len() > 0, IdentityError::ProofVerificationFailed);

        // Basic anti-replay: store last nonce and a NoncePda tied to (subject, slot)
        let subject = ctx.accounts.subject.key();
        let clock = Clock::get()?;
        let nonce_pda = &mut ctx.accounts.nonce_pda;
        nonce_pda.subject = subject;
        nonce_pda.slot = clock.slot;
        nonce_pda.nonce = nonce;

        // Policy checks: expiry in the future
        let now = clock.unix_timestamp as u64;
        require!(expires_at > now, IdentityError::Expired);

        // Write/update attestation
        let att = &mut ctx.accounts.attestation_pda;
        att.subject = subject;
        att.predicate_hash = predicate_hash;
        att.issuer_hash = issuer_hash;
        att.vk_id = vk_id;
        att.issued_at = now;
        att.expires_at = expires_at;
        att.last_nonce = nonce;

        emit!(IdentityVerified {
            subject,
            predicate_hash,
            issuer_hash,
            expires_at,
        });
        Ok(())
    }

    pub fn revoke_attestation(ctx: Context<RevokeAttestation>) -> Result<()> {
        let att = &mut ctx.accounts.attestation_pda;
        require_keys_eq!(att.subject, ctx.accounts.subject.key(), IdentityError::Unauthorized);
        att.expires_at = 0;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitConfig<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(
        init_if_needed,
        payer = admin,
        space = 8 + VerifierConfig::SIZE,
        seeds = [b"config"],
        bump
    )]
    pub verifier_config: Account<'info, VerifierConfig>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(vk_id: [u8; 32], predicate_hash: [u8; 32])]
pub struct VerifyIdentityProof<'info> {
    #[account(mut)]
    pub subject: Signer<'info>,
    #[account(
        init_if_needed,
        payer = subject,
        space = 8 + AttestationPda::SIZE,
        seeds = [b"attest", subject.key().as_ref(), &predicate_hash],
        bump
    )]
    pub attestation_pda: Account<'info, AttestationPda>,
    #[account(
        init_if_needed,
        payer = subject,
        space = 8 + VerifierConfig::SIZE,
        seeds = [b"config"],
        bump
    )]
    pub verifier_config: Account<'info, VerifierConfig>,
    #[account(
        init_if_needed,
        payer = subject,
        space = 8 + NoncePda::SIZE,
        seeds = [b"nonce", subject.key().as_ref()],
        bump
    )]
    pub nonce_pda: Account<'info, NoncePda>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RevokeAttestation<'info> {
    #[account(mut)]
    pub subject: Signer<'info>,
    #[account(mut, has_one = subject)]
    pub attestation_pda: Account<'info, AttestationPda>,
}

#[account]
pub struct VerifierConfig {
    pub admin: Pubkey,
    pub allowed_issuers_root: [u8; 32],
    pub version: u32,
}
impl VerifierConfig { pub const SIZE: usize = 32 + 32 + 4; }

#[account]
pub struct AttestationPda {
    pub subject: Pubkey,
    pub predicate_hash: [u8; 32],
    pub issuer_hash: [u8; 32],
    pub vk_id: [u8; 32],
    pub issued_at: u64,
    pub expires_at: u64,
    pub last_nonce: [u8; 16],
}
impl AttestationPda { 
    // 32 + 32 + 32 + 32 + 8 + 8 + 16 = 160 bytes
    pub const SIZE: usize = 32 + 32 + 32 + 32 + 8 + 8 + 16; 
}

#[account]
pub struct NoncePda {
    pub subject: Pubkey,
    pub slot: u64,
    pub nonce: [u8; 16],
}
impl NoncePda { pub const SIZE: usize = 32 + 8 + 16; }

#[event]
pub struct IdentityVerified {
    pub subject: Pubkey,
    pub predicate_hash: [u8; 32],
    pub issuer_hash: [u8; 32],
    pub expires_at: u64,
}

#[error_code]
pub enum IdentityError {
    #[msg("ZK proof verification failed")]
    ProofVerificationFailed,
    #[msg("Issuer not allowed")]
    IssuerNotAllowed,
    #[msg("Replay detected")]
    ReplayDetected,
    #[msg("Attestation expired")]
    Expired,
    #[msg("Unauthorized")]
    Unauthorized,
}