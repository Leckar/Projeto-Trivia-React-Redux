import React from 'react';
import { getByTestId, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import App from '../App'
import { questionsResponse } from '../../cypress/mocks/questions';

describe('Testes da Game Page', () => {
    // beforeEach(() => {
    //
    // });

    afterEach(() => {
        localStorage.clear();
    })

    const { results } = questionsResponse;

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
            token: 'f00cb469ce38726ee00a7c6836761b0a4fb808181a125dcde6d50a9f3c9127b6',
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
            waitFor(async () => {
                const rightAnswerBtn = await screen.findByTestId('correct-answer');
                userEvent.click(rightAnswerBtn);

                const nextBtn = await screen.findByRole('button', { name: /Next/i });
                userEvent.click(nextBtn);
            });
        })

        waitFor(() => {
            const { location: { pathname } } = history;
            expect(pathname).toBe('/feedback');
        });
    })

    it('testa se a alternativa correta fica verde ao acertar e as questões erradas com a cor vermelha', () => {

    })

    it('testa o player score', () => {

    })


    it('', () => {

    })

    it('', () => {

    })
})