import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from '../renderWithRouter';
import App from '../App';


describe('testa a pagina de login', () => {
    it('verifica se os inputs e botão estão na tela', () => {
        const userName = screen.getByTestId('input-player-name');
        const emailUser = screen.getByTestId('input-gravatar-email');
        const buttonPlay = screen.getByRole('button', { name: /play/i });

        expect(userName).toBeInTheDocument();
        expect(emailUser).toBeInTheDocument();
        expect(buttonPlay).toBeInTheDocument();
    });
})