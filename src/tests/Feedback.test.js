import React from 'react';
import { getByTestId, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import App from '../App'

const initialState = {
    login: {
        requesting: true,
        token: '',
    },

    player: {
        name: 'Joao',
        gravatarEmail: 'joao@possamai.com',
        score: 0,
        assertions: 2
    }
}

const test = /Well Done!/i;

describe('testa a pagina de Feedback', () => {
    it('Verifica se o botão "Play again" redireciona para a página Home', () => {
        const { history } = renderWithRouterAndRedux(<App />);
        history.push('/feedback');
        const playButton = screen.getByRole('button', { name: /Play again/i });
        expect(playButton).toBeInTheDocument();
        userEvent.click(playButton);
        const { pathname } = history.location;
        expect(pathname).toBe('/');
    })

    it('Testa se o botão "Ranking" redireciona para a página Ranking', () => {
        const { history } = renderWithRouterAndRedux(<App />)
        history.push('/feedback');
        const rankButton = screen.getByText(/Ranking/i);
        expect(rankButton).toBeInTheDocument();
        userEvent.click(rankButton);
        const { pathname } = history.location;
        expect(pathname).toBe('/ranking');
      })
      
      it('Testa as mensagem em Feedback', () => {
        const { history } = renderWithRouterAndRedux(<App />, initialState)
        history.push('/feedback')
        // expect(test).toBe('Well Done!');
        

            const CouldBeBetterText = screen.getByText(/Could be better/i);
            expect(CouldBeBetterText).toBeInTheDocument();
       
            // const assertionText = screen.getByText(/Well Done!/i);
            // expect(assertionText).not.toBe();
    });

    it('Testa as mensagem em Feedback', () => {
        const { history } = renderWithRouterAndRedux(<App />)
        history.push('/ranking')
        const CouldBeBetterText = screen.getByRole('heading', /Could be better/i);
        expect(CouldBeBetterText).toBeInTheDocument();
    });
});