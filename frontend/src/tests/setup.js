import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock global fetch for all tests
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  }),
);
