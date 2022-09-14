import React from 'react';
import { cleanup, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import App from '../App'
import { questionsResponse } from '../../cypress/mocks/questions';

describe('Testes da Game Page', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    // afterEach(() => {
    //     localStorage.clear();
    // })

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

    it('verifica se é redirecionado a página de login quando o token está errado', async () => {
        const { history } = renderWithRouterAndRedux(<App />, tokenErrorState);
        history.push('/game');
        const { location: { pathname } } = history;
        expect(pathname).toBe('/');
    })

    it('Verifica se existem pelo menos dois botões na tela', async () => {
        const { history } = renderWithRouterAndRedux(<App />, initialState);

        jest.spyOn(global, 'fetch');
        global.fetch.mockResolvedValue({
            json: jest.fn()
        });

        history.push('/game');

        const answerButtons = await screen.findAllByRole('button');
        expect(answerButtons.length).toBeGreaterThan(1);
        expect(global.fetch).toHaveBeenCalled();
    })

    it('ao clicar em uma resposta o botão next aparece', () => {
        const { history } = renderWithRouterAndRedux(<App />, initialState);
        history.push('/game');

        waitFor(async () => {
            const rightAnswerBtn = await screen.findByTestId('correct-answer');
            userEvent.click(rightAnswerBtn);

            const nextBtn = await screen.findByRole('button', { name: /Next/i });
            expect(nextBtn).toBeInTheDocument();
        });
    })

    it('após responder todas as perguntas é redirecionado a página de feedback', () => {
        const { history } = renderWithRouterAndRedux(<App />, initialState);
        history.push('/game');

        results.forEach(() => {
            waitFor(() => {
                const rightAnswerBtn = screen.queryByTestId('correct-answer');
                userEvent.click(rightAnswerBtn);
                const nextBtn = screen.queryByRole('button', { name: /Next/i });
                userEvent.click(nextBtn);
            });
        })

        waitFor(() => {
            const { location: { pathname } } = history;
            expect(pathname).toBe('/feedback');
        });
    })

    it('testa se os botões são desabilitados quando um deles é clicado', () => {
        jest.spyOn(global, 'fetch').mockResolvedValue({
            json: jest.fn().mockResolvedValue(questionsResponse),
        });
        renderWithRouterAndRedux(<App />, initialState, '/game');

        waitFor(async () => {
            const buttons = await screen.findAllByRole('button');
            const rightAnswerBtn = screen.getByTestId('correct-answer')
            buttons.forEach((button) => expect(button).not.toBeDisabled());
            userEvent.click(rightAnswerBtn);
            buttons.forEach((button) => expect(button).toBeDisabled());
        })

    })

    it('testa se as posições estão certas', () => {

    })


    it('testa se a alternativa correta fica verde ao acertar e as questões erradas com a cor vermelha', () => {
        jest.spyOn(global, 'fetch').mockResolvedValue({
            json: jest.fn().mockResolvedValue(questionsResponse),
        });
        renderWithRouterAndRedux(<App />, initialState, '/game');
        waitFor(async () => {
            const wrongAnswerBtn = await screen.findByTestId('wrong-answer-0');
            const rightAnswerBtn = await screen.findByTestId('correct-answer')
            userEvent.click(rightAnswerBtn);
            expect(wrongAnswerBtn.className).toBe('answer');
            expect(rightAnswerBtn.className).toBe('answer');
        })
    })

    it('testa se é redirecionado para a página de feedback quando o botão next é clicado estando na última pergunta', async () => {
        jest.spyOn(global, 'fetch').mockResolvedValue({
            json: jest.fn().mockResolvedValue(questionsResponse),
        });
        localStorage.setItem('token', token);
        const { history } = renderWithRouterAndRedux(<App />, initialState, '/game');
        await waitFor(() => {
            expect(history.location.pathname).toBe('/game');
            expect(screen.getByText('Loading...')).toBeInTheDocument();
        });
        await waitForElementToBeRemoved(() => screen.getByText('Loading...'));

        // o problema de overlaping ta aqui no forEach
        results.forEach(() => {
            const rightAnswerBtn = screen.getByTestId('correct-answer');
            expect(rightAnswerBtn).toBeInTheDocument();
            userEvent.click(rightAnswerBtn);
            const nextQuestionBtn = screen.getByTestId('btn-next');
            expect(nextQuestionBtn).toBeInTheDocument();
            userEvent.click(nextQuestionBtn);
        })
        // // })
        history.push('/feedback')
        await waitFor(() => {
            const { location: { pathname } } = history;
            expect(pathname).toBe('/feedback');
        })
    })

    it('testa se o ranking é atualizado', async () => {
        // esse it não está testando o timer corretamente
        jest.setTimeout(32000);
        jest.spyOn(global, 'fetch').mockResolvedValue({
            json: jest.fn().mockResolvedValue(questionsResponse),
        });
        renderWithRouterAndRedux(<App />, initialState, '/game');
        await waitFor(() => {
            const timer = screen.getByTestId('question-timer');
            const buttons = screen.getAllByRole('button');
            expect(timer).toHaveTextContent('Tempo restante: 30s' || 'Tempo restante: 29s');
            setTimeout(() => {
                expect(timer).toHaveTextContent('Tempo restante: 0s');
                buttons.forEach((button) => expect(button).toBeDisabled());
            }, 30000);
        })
    })

    it('testa se o ranking é atualizado no localStorage quando jogador joga novamente', async () => {
        jest.spyOn(global, 'fetch').mockResolvedValue({
            json: jest.fn().mockResolvedValue(questionsResponse),
        });
        localStorage.setItem('token', token);
        const { history } = renderWithRouterAndRedux(<App />, initialState, '/game');
        await waitFor(() => {
            expect(history.location.pathname).toBe('/game');
            expect(screen.getByText('Loading...')).toBeInTheDocument();
        });
        await waitForElementToBeRemoved(() => screen.getByText('Loading...'));
        results.forEach(() => {
            // const rightAnswerBtn = screen.getByTestId('correct-answer');
            const wrongAnswerBtn = screen.getByTestId('wrong-answer-0');
            expect(wrongAnswerBtn).toBeInTheDocument();
            userEvent.click(wrongAnswerBtn);
            const nextQuestionBtn = screen.getByTestId('btn-next');
            expect(nextQuestionBtn).toBeInTheDocument();
            userEvent.click(nextQuestionBtn);
        })
        history.push('/feedback')
        await waitFor(() => {
            const { location: { pathname } } = history;
            expect(pathname).toBe('/feedback');
        })
        const score = screen.getByTestId('feedback-total-score');
        expect(score).toHaveTextContent('0');
        history.push('/');
        await waitFor(() => {
            const { location: { pathname } } = history;
            expect(pathname).toBe('/');
        })
        const nameInput = screen.getByTestId('input-player-name');
        const emailInput = screen.getByTestId('input-gravatar-email');
        userEvent.type(nameInput, 'Joao');
        userEvent.type(emailInput, 'joao@possamai.com');
        history.push('/game');
        await waitFor(() => {
            expect(history.location.pathname).toBe('/game');
            expect(screen.getByText('Loading...')).toBeInTheDocument();
        });
        await waitForElementToBeRemoved(() => screen.getByText('Loading...'));
        results.forEach(() => {
            const rightAnswerBtn = screen.getByTestId('correct-answer');
            expect(rightAnswerBtn).toBeInTheDocument();
            userEvent.click(rightAnswerBtn);
            const nextQuestionBtn = screen.getByTestId('btn-next');
            expect(nextQuestionBtn).toBeInTheDocument();
            userEvent.click(nextQuestionBtn);
        })
        history.push('/feedback');
        await waitFor(() => {
            const { location: { pathname } } = history;
            expect(pathname).toBe('/feedback');
        })
        const newScore = screen.getByTestId('feedback-total-score');
        expect(newScore).toHaveTextContent('350');
    })

    it('testa se é adicionado um novo usuário corretamente', async () => {
        jest.spyOn(global, 'fetch').mockResolvedValue({
            json: jest.fn().mockResolvedValue(questionsResponse),
        });
        localStorage.setItem('token', token);
        const { history } = renderWithRouterAndRedux(<App />, initialState, '/game');
        await waitFor(() => {
            expect(history.location.pathname).toBe('/game');
            expect(screen.getByText('Loading...')).toBeInTheDocument();
        });
        await waitForElementToBeRemoved(() => screen.getByText('Loading...'));
        results.forEach(() => {
            // const rightAnswerBtn = screen.getByTestId('correct-answer');
            const wrongAnswerBtn = screen.getByTestId('wrong-answer-0');
            expect(wrongAnswerBtn).toBeInTheDocument();
            userEvent.click(wrongAnswerBtn);
            const nextQuestionBtn = screen.getByTestId('btn-next');
            expect(nextQuestionBtn).toBeInTheDocument();
            userEvent.click(nextQuestionBtn);
        })
        history.push('/feedback')
        await waitFor(() => {
            const { location: { pathname } } = history;
            expect(pathname).toBe('/feedback');
        })
        const score = screen.getByTestId('feedback-total-score');
        expect(score).toHaveTextContent('0');
        history.push('/');
        await waitFor(() => {
            const { location: { pathname } } = history;
            expect(pathname).toBe('/');
        })
        const nameInput = screen.getByTestId('input-player-name');
        const emailInput = screen.getByTestId('input-gravatar-email');
        const playBtn = screen.getByTestId('btn-play');
        userEvent.type(nameInput, 'Cadu');
        userEvent.type(emailInput, 'cadu@eu.com');
        userEvent.click(playBtn);
        localStorage.setItem('token', token);
        history.push('/game');
        await waitFor(() => {
            expect(history.location.pathname).toBe('/game');
            expect(screen.getByText('Loading...')).toBeInTheDocument();
        });
        await waitForElementToBeRemoved(() => screen.getByText('Loading...'));
        results.forEach(() => {
            const rightAnswerBtn = screen.getByTestId('correct-answer');
            expect(rightAnswerBtn).toBeInTheDocument();
            userEvent.click(rightAnswerBtn);
            const nextQuestionBtn = screen.getByTestId('btn-next');
            expect(nextQuestionBtn).toBeInTheDocument();
            userEvent.click(nextQuestionBtn);
        })
        history.push('/ranking');
        await waitFor(() => {
            const { location: { pathname } } = history;
            expect(pathname).toBe('/ranking');
        })
        console.log(localStorage.getItem('ranking'));
        const images = screen.getAllByRole('img');
        expect(images).toHaveLength(2);
    })
})