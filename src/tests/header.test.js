import React from 'react';
import { screen } from '@testing-library/react';
import Header from '../components/Header';
import { renderWithRouterAndRedux } from './helpers/renderWith';
import mockData, { defaultEmail } from './helpers/mockData';

describe('Testando o Header', () => {
  it('Testando se o email digitado no login aparece na tela', () => {
    const initialState = { initialState: { user: {
      email: defaultEmail,
    } } };
    const { store } = renderWithRouterAndRedux(<Header />, initialState);
    expect(store.getState().user.email).toBe('artur@gmail.com');
    const emailField = screen.getByTestId('email-field').innerHTML;
    expect(emailField).toContain(store.getState().user.email);
  });
  it('Testando o valor do campo de total', () => {
    const initialState = {
      initialState: {
        user: {
          email: defaultEmail,
        },
        wallet: {
          expenses: [{
            value: '123',
            currency: 'USD',
            description: '123 Dólares',
            method: 'Dinheiro',
            tag: 'Alimentação',
            id: 0,
            exchangeRates: mockData,
          },
          {
            value: '345',
            currency: 'GBP',
            description: '345 Libras',
            method: 'Cartão de crédito',
            tag: 'Lazer',
            id: 1,
            exchangeRates: mockData,
          },
          ],
        },
      },
    };
    renderWithRouterAndRedux(<Header />, initialState);
    const totalField = screen.getByTestId('total-field').innerHTML;
    expect(totalField)
      .toBe(Number(123 * mockData.USD.ask + 345 * mockData.GBP.ask).toFixed(2));
  });
});
