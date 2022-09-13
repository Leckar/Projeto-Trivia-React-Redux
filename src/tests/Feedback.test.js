import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import App from '../App'

const goodAssertionState = {
    apiReducer: {
        requesting: true,
        token: '',
    },
    player: {
        name: 'Joao',
        gravatarEmail: 'joao@possamai.com',
        score: 0,
        assertions: 4
    }
}

const badAssertionState = {
    apiReducer: {
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

    it('Testa a mensagem de Feedback quando assertions é menor que 3', () => {
        const { history } = renderWithRouterAndRedux(<App />, badAssertionState)
        history.push('/feedback')
        const couldBeBetterText = screen.getByRole('heading', { name: /Could be better.../i, level: 2 });
        expect(couldBeBetterText).toBeInTheDocument();
    });

    it('Testa a mensagem de Feedback quando assertions é maior ou igual a 3', () => {
        const { history } = renderWithRouterAndRedux(<App />, goodAssertionState)
        history.push('/feedback')
        const wellDoneText = screen.getByRole('heading', { name:/Well Done!/i, level: 2 });
        expect(wellDoneText).toBeInTheDocument();
    });
});









