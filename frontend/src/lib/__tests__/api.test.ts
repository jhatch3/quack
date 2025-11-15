/**
 * Test cases for API functions
 * 
 * These tests verify that:
 * 1. fetchUserDeposit returns correct deposit amount
 * 2. fetchUserDeposit defaults to 0 when API is unavailable
 * 3. fetchUserDeposit handles errors gracefully
 */

import { fetchUserDeposit } from '../api';

// Mock fetch globally
global.fetch = jest.fn();

describe('fetchUserDeposit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return deposit amount when API call succeeds', async () => {
    const mockDeposit = 10.5;
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ depositedAmount: mockDeposit }),
    });

    const result = await fetchUserDeposit('DW4MTest1234567890abcdefghijklmnopqrstuvwxyz1bP6');

    expect(result).toBe(mockDeposit);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/users/')
    );
  });

  it('should return 0 when API returns 404 (user not found)', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const result = await fetchUserDeposit('DW4MTest1234567890abcdefghijklmnopqrstuvwxyz1bP6');

    expect(result).toBe(0);
  });

  it('should return 0 when API call fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const result = await fetchUserDeposit('DW4MTest1234567890abcdefghijklmnopqrstuvwxyz1bP6');

    expect(result).toBe(0);
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('should return 0 when API returns invalid data', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}), // Missing depositedAmount
    });

    const result = await fetchUserDeposit('DW4MTest1234567890abcdefghijklmnopqrstuvwxyz1bP6');

    expect(result).toBe(0);
  });

  it('should use correct API endpoint', async () => {
    const walletAddress = 'DW4MTest1234567890abcdefghijklmnopqrstuvwxyz1bP6';
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ depositedAmount: 5 }),
    });

    await fetchUserDeposit(walletAddress);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining(`/api/users/${walletAddress}/deposit`)
    );
  });
});

