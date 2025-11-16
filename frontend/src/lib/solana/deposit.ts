import { 
  Connection, 
  PublicKey, 
  Transaction,
} from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from '@solana/spl-token';
import { Program, AnchorProvider, BN, Wallet as AnchorWallet } from '@coral-xyz/anchor';
import { Wallet } from '@solana/wallet-adapter-react';

// Vault Program ID from Anchor.toml
export const VAULT_PROGRAM_ID = new PublicKey('FTH14TtpbEBjvxLDqJ5V436hfpJ5aR6btgx89DQ4Yz8m');

// Vault Config PDA seeds
const VAULT_CONFIG_SEED = 'vault_config';

/**
 * Get the vault config PDA
 */
export async function getVaultConfigPDA(
  underlyingMint: PublicKey,
  programId: PublicKey = VAULT_PROGRAM_ID
): Promise<[PublicKey, number]> {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(VAULT_CONFIG_SEED), underlyingMint.toBuffer()],
    programId
  );
}

/**
 * Convert wallet adapter wallet to Anchor wallet
 */
function toAnchorWallet(wallet: Wallet): AnchorWallet {
  return {
    publicKey: wallet.publicKey!,
    signTransaction: wallet.signTransaction!,
    signAllTransactions: wallet.signAllTransactions!,
  };
}

/**
 * Deposit into the vault using Anchor program
 * This function requires:
 * 1. The vault program IDL loaded
 * 2. Proper account derivation
 * 3. The underlying mint (USDC or SOL)
 */
export async function depositToVault(
  connection: Connection,
  wallet: Wallet,
  amount: number, // Amount in base units (e.g., lamports for SOL, or 6 decimals for USDC)
  underlyingMint: PublicKey // The mint address of the underlying asset
): Promise<{ success: boolean; txSignature?: string; error?: string }> {
  try {
    if (!wallet.publicKey || !wallet.signTransaction) {
      return {
        success: false,
        error: 'Wallet not connected or does not support signing',
      };
    }

    // Convert wallet adapter to Anchor wallet
    const anchorWallet = toAnchorWallet(wallet);
    const provider = new AnchorProvider(connection, anchorWallet, {
      commitment: 'confirmed',
    });

    // TODO: Load the program IDL
    // You'll need to:
    // 1. Build the Anchor program: `anchor build` in the solana directory
    // 2. Copy the IDL from `solana/target/idl/vault.json` to `frontend/src/lib/solana/vault.json`
    // 3. Import and use it here:
    //    import idl from './vault.json';
    //    const program = new Program(idl as any, VAULT_PROGRAM_ID, provider);

    // For now, return an error indicating setup is needed
    return {
      success: false,
      error: 'Vault program IDL not loaded. Please build the Anchor program and load the IDL.',
    };

    // Once IDL is loaded, the code would look like:
    /*
    const [vaultConfigPDA] = await getVaultConfigPDA(underlyingMint);
    
    // Get vault config to find vault accounts
    const vaultConfig = await program.account.vaultConfig.fetch(vaultConfigPDA);
    
    // Derive user token accounts
    const userUnderlyingAta = await getAssociatedTokenAddress(
      underlyingMint,
      wallet.publicKey
    );
    
    const userShareAta = await getAssociatedTokenAddress(
      vaultConfig.shareMint,
      wallet.publicKey
    );
    
    // Build and send deposit transaction
    const txSignature = await program.methods
      .deposit(new BN(amount))
      .accounts({
        vaultConfig: vaultConfigPDA,
        vaultUnderlying: vaultConfig.vaultUnderlying,
        shareMint: vaultConfig.shareMint,
        user: wallet.publicKey,
        userUnderlyingAta: userUnderlyingAta,
        userShareAta: userShareAta,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .rpc();
    
    return {
      success: true,
      txSignature,
    };
    */
  } catch (error: any) {
    console.error('Deposit error:', error);
    return {
      success: false,
      error: error.message || 'Failed to process deposit',
    };
  }
}

/**
 * Simplified deposit function that can be called from the UI
 * This is a placeholder that navigates to the deposit page
 * The actual deposit will be handled on the deposit page
 */
export async function handleDeposit(
  connection: Connection,
  wallet: Wallet,
  amount: number
): Promise<{ success: boolean; txSignature?: string; error?: string }> {
  // For now, this is a placeholder
  // The actual deposit should be implemented on the Deposit page
  // where users can enter the amount and confirm the transaction
  
  return {
    success: false,
    error: 'Please use the Deposit page to complete your deposit transaction.',
  };
}
