import React from 'react';
import { getByTestId, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import App from '../App'

describe('Testes da Game Page', () => {
    it('Verifica se ao responder todas as perguntas a tela é redirecinada para Feedback', () => {
        const { history } = renderWithRouterAndRedux(<App />);
        history.push('/game')

    })

    it('testa se a partida possui 5 perguntas.', () => {

    })

    it('testa o temporizador das perguntas.', () => {

    })

    it('testa se a alternativa correta fica verde ao acertar e as questões erradas com a cor vermelha', () => {

    })

    it('testa o player score', () => {

    })

    it('', () => {

    })

    it('', () => {

    })

    it('', () => {

    })
})
