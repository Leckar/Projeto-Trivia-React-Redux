import React from 'react';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import App from '../App';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { saveInStorage, RANKING } from '../services/localStorage';

describe('Testa a página Ranking', () => {
  const mockedRank = [
    {
      name: 'Cadu',
      score: 200,
      picture: '',
    },
    {
      name: 'Luidi',
      score: 50,
      picture: '',
    },
    {
      name: 'Caio',
      score: 0,
      picture: '',
    },
    {
      name: 'Joao',
      score: 300,
      picture: '',
    },
  ]

  it('verifica se o título é renderizado', () => {
    const { history } = renderWithRouterAndRedux(<App />);
    history.push('/ranking');
    const rankingTitle = screen.queryByRole('heading', { level: 1 });
    expect(rankingTitle).toHaveTextContent(/Ranking/i);
  });

  it('verifica se o link é renderizado', () => {
    const { history } = renderWithRouterAndRedux(<App />);
    history.push('/ranking');
    const rankingLink = screen.queryByRole('link');
    expect(rankingLink).toBeInTheDocument();
  });

  it('verifica se o ranking é renderizado corretamente', () => {
    const { history } = renderWithRouterAndRedux(<App />);
    saveInStorage(RANKING, mockedRank)
    history.push('/ranking');

    // expect(rankingTitle).toHaveTextContent(/Ranking/i);
    mockedRank.forEach(({ score }, i) => {
      const userScore = screen.queryByTestId(`player-score-${i}`);
      expect(userScore).toBeInTheDocument();
      // expect(userScore).toBeHaveTextContent(score);
    })
  });
});