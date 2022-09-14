import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import App from '../App'

describe('Testes do GameQuestion', () => {
    jest.setTimeout(35000)
    it('should render the elements correctly', async () => {
        const { history } = renderWithRouterAndRedux(<App />);
        const userName = screen.getByTestId('input-player-name');
        const userEmail = screen.getByTestId('input-gravatar-email');
        const playBttn = screen.getByTestId('btn-play');
        userEvent.type(userName, 'thisIsATest');
        userEvent.type(userEmail, 'test@test.com');
        userEvent.click(playBttn);
        await waitFor(() => {
            const { location: { pathname } } = history;
            expect(pathname).toBe('/game')
        });
        await waitFor(() => {
            const gameHeader = screen.getByTestId('question-category');
            const gameQuestion = screen.getByTestId('question-text');
            expect(gameHeader).toBeInTheDocument();
            expect(gameQuestion).toBeInTheDocument();
        });
        expect(screen.getByTestId('question-timer').innerHTML).toMatch(/Tempo restante: 30s/i);
        await new Promise((test) => setTimeout(test, 30000));
        expect(screen.getByTestId('question-timer').innerHTML).toMatch(/Tempo restante: 0s/i);
    });
    it('', () => {});
});
