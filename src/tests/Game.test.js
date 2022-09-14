import React from 'react';
import { cleanup, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import App from '../App'
import { questionsResponse, invalidTokenQuestionsResponse } from '../../cypress/mocks/questions';
import { tokenResponse } from '../../cypress/mocks/token';

describe('Testes da Game Page', () => {
    jest.setTimeout(35000);

    const { results } = questionsResponse;
    const token = 'f00cb469ce38726ee00a7c6836761b0a4fb808181a125dcde6d50a9f3c9127b6';
    const tokenErrorState = {
        apiReducer: {
            requesting: false,
            token: '',
            error: 'Token Invalid!',
        },
        player: {
            name: 'Joao',
            gravatarEmail: 'joao@possamai.com',
            score: 0,
            assertions: 0
        }
    }
    const initialState = {
        apiReducer: {
            requesting: false,
            error: '',
            token: token,
            triviaQuestions: results,
        },
        player: {
            name: 'Joao',
            gravatarEmail: 'joao@possamai.com',
            score: 0,
            assertions: 0
        }
    }

    beforeEach(() => {
        jest.spyOn(global, 'fetch').mockResolvedValue({
            json: jest.fn().mockResolvedValue(questionsResponse),
        });
        global.localStorage = { setItem: jest.fn() }
        localStorage.clear();
    });

    it('verifica se é redirecionado a página de login quando o token está errado', async () => {
        jest.spyOn(global, 'fetch').mockResolvedValue({
            json: jest.fn().mockResolvedValue(invalidTokenQuestionsResponse)
        });
        const { history } = renderWithRouterAndRedux(<App />, tokenErrorState, '/game');
        const { location: { pathname } } = history;
        expect(pathname).toBe('/');
    })

    it('Verifica se os botões são renderizados', async () => {
        renderWithRouterAndRedux(<App />, initialState, '/game');
        const answerButtons = await screen.findAllByRole('button');
        expect(answerButtons.length).toBeGreaterThan(1);
        expect(global.fetch).toHaveBeenCalled();
    })

    it('ao clicar em uma resposta o botão next aparece', async () => {
        renderWithRouterAndRedux(<App />, initialState, '/game');
        const rightAnswerBtn = await screen.findByTestId('correct-answer');
        userEvent.click(rightAnswerBtn);
        const nextBtn = await screen.findByRole('button', { name: /Next/i });
        expect(nextBtn).toBeInTheDocument();
    })

    it('após responder todas as perguntas é redirecionado a página de feedback', async () => {
        const { history } = renderWithRouterAndRedux(<App />, initialState, '/game');
        results.forEach(() => {
            setTimeout(async () => {
                const rightAnswerBtn = await screen.findByTestId('correct-answer');
                userEvent.click(rightAnswerBtn);
                const nextBtn = await screen.findByRole('button', { name: /Next/i });
                userEvent.click(nextBtn);
            }, 500)
        })
        await waitFor(() => {
            const { location: { pathname } } = history;
            expect(pathname).toBe('/feedback');
        });
    })

    it('testa se os botões são desabilitados quando um deles é clicado', async () => {
        renderWithRouterAndRedux(<App />, initialState, '/game');
        const buttons = await screen.findAllByRole('button');
        const rightAnswerBtn = await screen.findByTestId('correct-answer')
        buttons.forEach((button) => expect(button).not.toBeDisabled());
        userEvent.click(rightAnswerBtn);
        buttons.forEach((button) => expect(button).toBeDisabled());
    })

    it('testa se as alternativas mudam de cor corretamente', async () => {
        renderWithRouterAndRedux(<App />, initialState, '/game');
        const wrongAnswerBtn = await screen.findByTestId('wrong-answer-0');
        const rightAnswerBtn = await screen.findByTestId('correct-answer')
        userEvent.click(rightAnswerBtn);
        expect(wrongAnswerBtn.className).toBe('answer');
        expect(rightAnswerBtn.className).toBe('answer');
    })

    it('testa se o timer chega em 0', async () => {
        renderWithRouterAndRedux(<App />, initialState, '/game');
        await new Promise((test) => setTimeout(test, 32000));
        expect(screen.getByTestId('question-timer')).toHaveTextContent('Tempo restante: 0s');
    })

    it('testa se o ranking é atualizado no localStorage', async () => {
        const { history } = renderWithRouterAndRedux(<App />, initialState, '/game');
        results.forEach(() => {
            setTimeout(async () => {
                const rightAnswerBtn = await screen.findByTestId('correct-answer');
                userEvent.click(rightAnswerBtn);
                const nextBtn = await screen.findByRole('button', { name: /Next/i });
                userEvent.click(nextBtn);
            }, 500)
        })
        await waitFor(() => {
            expect(history.location.pathname).toBe('/feedback');
            history.push('/')
        });
        await waitFor(() => {
            expect(history.location.pathname).toBe('/');
        });
        localStorage.setItem('token', token);
        const nameInput = screen.getByTestId('input-player-name');
        const emailInput = screen.getByTestId('input-gravatar-email');
        const playBtn = screen.getByTestId('btn-play');
        userEvent.type(nameInput, 'Cadu');
        userEvent.type(emailInput, 'cadu@eu.com');
        userEvent.click(playBtn);
        await waitFor(() => {
            expect(history.location.pathname).toBe('/game');
        });
        results.forEach(() => {
            setTimeout(async () => {
                const rightAnswerBtn = await screen.findByTestId('correct-answer');
                userEvent.click(rightAnswerBtn);
                const nextBtn = await screen.findByRole('button', { name: /Next/i });
                userEvent.click(nextBtn);
            }, 500)
        })
        await waitFor(() => {
            expect(history.location.pathname).toBe('/feedback');
            history.push('/ranking')
        });
        await waitFor(() => {
            expect(history.location.pathname).toBe('/ranking');
            const images = screen.getAllByRole('img');
            expect(images).toHaveLength(2);
            history.push('/')
        });

        // realizando o ciclo novamente

        localStorage.setItem('token', token);
        const nameInput2 = screen.getByTestId('input-player-name');
        const emailInput2 = screen.getByTestId('input-gravatar-email');
        const playBtn2 = screen.getByTestId('btn-play');
        userEvent.type(nameInput2, 'x');
        userEvent.type(emailInput2, 'x@x.x');
        userEvent.click(playBtn2);
        history.push('/game')
        await waitFor(() => {
            expect(history.location.pathname).toBe('/game');
        });
        results.forEach(() => {
            setTimeout(async () => {
                const rightAnswerBtn = await screen.findByTestId('correct-answer');
                userEvent.click(rightAnswerBtn);
                const nextBtn = await screen.findByRole('button', { name: /Next/i });
                userEvent.click(nextBtn);
            }, 500)
        })
        await waitFor(() => {
            expect(history.location.pathname).toBe('/feedback');
            history.push('/ranking')
        });
        await waitFor(() => {
            expect(history.location.pathname).toBe('/ranking');
            const images = screen.getAllByRole('img');
            expect(images).toHaveLength(2);
        });
    })
})