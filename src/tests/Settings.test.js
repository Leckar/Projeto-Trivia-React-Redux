import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import App from '../App'

describe('Testando as seguintes', () => {
    it('Testando o componente Settings', () => {
        const { history } = renderWithRouterAndRedux(<App />);
        const configButton = screen.getByRole('button', { name: /configurações/i });
        expect(configButton).toBeInTheDocument();

        userEvent.click(configButton);
        expect(history.location.pathname).toBe('/settings');

        const settingsInfo = screen.getByText(/Settings/i);
        expect(settingsInfo).toBeInTheDocument();
    })
})