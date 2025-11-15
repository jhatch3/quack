/**
 * Test cases for useSolBalance hook
 * 
 * These tests verify that:
 * 1. Balance is fetched correctly when wallet is connected
 * 2. Balance returns null when wallet is not connected
 * 3. Loading state is managed correctly
 * 4. Errors are handled properly
 * 5. Balance updates on wallet connection changes
 */

import { renderHook, waitFor } from '@testing-library/react';
import { useSolBalance } from '../useSolBalance';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

// Mock the wallet adapter hooks
jest.mock('@solana/wallet-adapter-react', () => ({
  useWallet: jest.fn(),
  useConnection: jest.fn(),
}));

// Mock PublicKey
jest.mock('@solana/web3.js', () => ({
  ...jest.requireActual('@solana/web3.js'),
  PublicKey: jest.fn(),
  LAMPORTS_PER_SOL: 1_000_000_000,
}));

describe('useSolBalance', () => {
  const mockConnection = {
    getBalance: jest.fn(),
  } as unknown as Connection;

  const mockPublicKey = {
    toString: () => 'DW4MTest1234567890abcdefghijklmnopqrstuvwxyz1bP6',
  } as unknown as PublicKey;

  beforeEach(() => {
    jest.clearAllMocks();
    (useWallet as jest.Mock).mockReturnValue({
      publicKey: null,
      connected: false,
    });
    (useConnection as jest.Mock).mockReturnValue({
      connection: null,
    });
  });

  it('should return null balance when wallet is not connected', () => {
    (useWallet as jest.Mock).mockReturnValue({
      publicKey: null,
      connected: false,
    });
    (useConnection as jest.Mock).mockReturnValue({
      connection: null,
    });

    const { result } = renderHook(() => useSolBalance());

    expect(result.current.balance).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should fetch balance when wallet is connected', async () => {
    const mockBalance = 5.23 * LAMPORTS_PER_SOL; // 5.23 SOL

    (useWallet as jest.Mock).mockReturnValue({
      publicKey: mockPublicKey,
      connected: true,
    });
    (useConnection as jest.Mock).mockReturnValue({
      connection: mockConnection,
    });
    (mockConnection.getBalance as jest.Mock).mockResolvedValue(mockBalance);

    const { result } = renderHook(() => useSolBalance());

    // Initially loading
    expect(result.current.loading).toBe(true);

    // Wait for balance to be fetched
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.balance).toBeCloseTo(5.23, 2);
    expect(result.current.error).toBeNull();
    expect(mockConnection.getBalance).toHaveBeenCalledWith(mockPublicKey);
  });

  it('should handle errors gracefully', async () => {
    const mockError = new Error('Network error');

    (useWallet as jest.Mock).mockReturnValue({
      publicKey: mockPublicKey,
      connected: true,
    });
    (useConnection as jest.Mock).mockReturnValue({
      connection: mockConnection,
    });
    (mockConnection.getBalance as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useSolBalance());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.balance).toBeNull();
    expect(result.current.error).toBe(mockError);
  });

  it('should update balance when publicKey changes', async () => {
    const mockBalance1 = 5.23 * LAMPORTS_PER_SOL;
    const mockBalance2 = 10.5 * LAMPORTS_PER_SOL;

    (useWallet as jest.Mock).mockReturnValue({
      publicKey: mockPublicKey,
      connected: true,
    });
    (useConnection as jest.Mock).mockReturnValue({
      connection: mockConnection,
    });
    (mockConnection.getBalance as jest.Mock).mockResolvedValueOnce(mockBalance1);

    const { result, rerender } = renderHook(() => useSolBalance());

    await waitFor(() => {
      expect(result.current.balance).toBeCloseTo(5.23, 2);
    });

    // Change balance
    (mockConnection.getBalance as jest.Mock).mockResolvedValueOnce(mockBalance2);
    
    // Trigger rerender (simulating wallet change)
    rerender();

    await waitFor(() => {
      expect(result.current.balance).toBeCloseTo(10.5, 2);
    });
  });
});

