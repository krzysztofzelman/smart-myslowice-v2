import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AIAssistant from '../components/AIAssistant';

const renderAssistant = () =>
  render(
    <MemoryRouter initialEntries={['/']}>
      <AIAssistant />
    </MemoryRouter>,
  );

beforeEach(() => {
  vi.clearAllMocks();
  global.fetch = vi.fn();
});

describe('AIAssistant', () => {
  it('should render the toggle button', () => {
    renderAssistant();
    expect(screen.getByLabelText('Otwórz asystenta')).toBeInTheDocument();
  });

  it('should show panel after clicking toggle', async () => {
    renderAssistant();
    const toggle = screen.getByLabelText('Otwórz asystenta');
    fireEvent.click(toggle);
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('should show initial greeting message when opened', async () => {
    renderAssistant();
    fireEvent.click(screen.getByLabelText('Otwórz asystenta'));
    await waitFor(() => {
      expect(screen.getByText(/Cześć!/)).toBeInTheDocument();
    });
  });

  it('should close the panel when toggle is clicked again', async () => {
    renderAssistant();
    const toggle = screen.getByLabelText('Otwórz asystenta');
    fireEvent.click(toggle);
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByLabelText('Zamknij asystenta'));
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('should send a query and display the response', async () => {
    const mockResponse = {
      answer: 'Jakość powietrza w Mysłowicach jest dobra. PM10: 16 µg/m³.',
      suggestedPath: '/',
      data: { pm10: 16 },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    renderAssistant();
    fireEvent.click(screen.getByLabelText('Otwórz asystenta'));

    const input = screen.getByLabelText('Zapytaj asystenta');
    fireEvent.change(input, { target: { value: 'jaka jest jakość powietrza?' } });
    fireEvent.click(screen.getByLabelText('Wyślij zapytanie'));

    await waitFor(() => {
      expect(screen.getByText(/Jakość powietrza/)).toBeInTheDocument();
    });
  });

  it('should show typing indicator while loading', async () => {
    // Return a promise that never resolves to keep loading state
    global.fetch = vi.fn().mockReturnValue(new Promise(() => {}));

    renderAssistant();
    fireEvent.click(screen.getByLabelText('Otwórz asystenta'));

    const input = screen.getByLabelText('Zapytaj asystenta');
    fireEvent.change(input, { target: { value: 'test query' } });
    fireEvent.click(screen.getByLabelText('Wyślij zapytanie'));

    await waitFor(() => {
      // The typing indicator should appear
      const messages = document.querySelectorAll('[aria-label="Asystent pisze"]');
      expect(messages.length).toBeGreaterThan(0);
    });
  });

  it('should display error message on API failure', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    renderAssistant();
    fireEvent.click(screen.getByLabelText('Otwórz asystenta'));

    const input = screen.getByLabelText('Zapytaj asystenta');
    fireEvent.change(input, { target: { value: 'test query' } });
    fireEvent.click(screen.getByLabelText('Wyślij zapytanie'));

    await waitFor(() => {
      expect(screen.getByText(/Network error/)).toBeInTheDocument();
    });
  });

  it('should disable send button when input is empty', async () => {
    renderAssistant();
    fireEvent.click(screen.getByLabelText('Otwórz asystenta'));

    const sendBtn = screen.getByLabelText('Wyślij zapytanie');
    expect(sendBtn).toBeDisabled();
  });

  it('should have accessible input field', async () => {
    renderAssistant();
    fireEvent.click(screen.getByLabelText('Otwórz asystenta'));

    const input = screen.getByLabelText('Zapytaj asystenta');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('maxLength', '500');
  });

  it('should navigate on suggestion click', async () => {
    const mockResponse = {
      answer: 'Sprawdź szczegóły na stronie powietrza.',
      suggestedPath: '/',
      data: null,
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    renderAssistant();
    fireEvent.click(screen.getByLabelText('Otwórz asystenta'));

    const input = screen.getByLabelText('Zapytaj asystenta');
    fireEvent.change(input, { target: { value: 'powietrze' } });
    fireEvent.click(screen.getByLabelText('Wyślij zapytanie'));

    await waitFor(() => {
      expect(screen.getByText('🔗 Zobacz szczegóły')).toBeInTheDocument();
    });
  });
});
