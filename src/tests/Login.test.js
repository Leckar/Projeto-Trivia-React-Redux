import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import App from '../App';
import { tokenResponse } from '../../cypress/mocks/token';

describe('testa a pagina de login', () => {
	const email = 'joao@possamai.com';
	const name = 'Joao';
	const wrongEmail = 'joaopossamaicom';
	const wrongName = 'Jo';
	const initialState = {
		login: {
			requesting: true,
			token: '',
			player: {
				name: 'Joao',
				gravatarEmail: 'joao@possamai.com',
				score: 0,
				assertions: 0
			}
		}
	}

	afterEach(() => jest.clearAllMocks());

	it('verifica se os inputs e botão estão na tela', () => {
		renderWithRouterAndRedux(<App />);
		const userName = screen.getByTestId('input-player-name');
		const emailUser = screen.getByTestId('input-gravatar-email');
		const buttonPlay = screen.getByRole('button', { name: /play/i });

		expect(userName).toBeInTheDocument();
		expect(emailUser).toBeInTheDocument();
		expect(buttonPlay).toBeInTheDocument();
	});

	it('verifica se os inputs funcionam corretamente', () => {
		renderWithRouterAndRedux(<App />);
		const nameInput = screen.getByTestId('input-player-name');
		const emailInput = screen.getByTestId('input-gravatar-email');

		userEvent.type(nameInput, name);
		userEvent.type(emailInput, email);

		expect(nameInput).toHaveValue(name);
		expect(emailInput).toHaveValue(email);
	});

	it('verifica se o botão é habilitado corretamente', () => {
		renderWithRouterAndRedux(<App />);
		const nameInput = screen.getByTestId('input-player-name');
		const emailInput = screen.getByTestId('input-gravatar-email');
		const buttonPlay = screen.getByRole('button', { name: /play/i });

		userEvent.type(nameInput, wrongName);
		userEvent.type(emailInput, wrongEmail);

		expect(buttonPlay).toBeDisabled();

		userEvent.type(nameInput, name);

		expect(buttonPlay).toBeDisabled();

		userEvent.type(emailInput, email);

		expect(buttonPlay).not.toBeDisabled();
	});

	it('verifica se clicar no botão play faz o fetch do token e redireciona para a página games', async () => {
		const { history, store } = renderWithRouterAndRedux(<App />, initialState);
		jest.spyOn(global, 'fetch');
		global.fetch.mockResolvedValue({
			json: jest.fn().mockResolvedValue(tokenResponse),
		});

		const nameInput = screen.getByTestId('input-player-name');
		const emailInput = screen.getByTestId('input-gravatar-email');
		const buttonPlay = screen.getByRole('button', { name: /play/i });

		userEvent.type(nameInput, name);
		userEvent.type(emailInput, email);

		userEvent.click(buttonPlay);
		expect(global.fetch).toHaveBeenCalledTimes(1);
		expect(global.fetch).toHaveBeenCalledWith('https://opentdb.com/api_token.php?command=request');

		await waitFor(() => {
			const { login: { token } } = store.getState();
			expect(token).toBe(tokenResponse.token);
		});

		await waitFor(() => {
			const { location: { pathname } } = history;
			expect(pathname).toBe('/game')
		});
	})
})