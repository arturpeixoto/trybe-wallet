import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import Header from '../components/Header';
import { renderWithRouterAndRedux } from './helpers/renderWith';
import { defaultEmail, mockData } from './helpers/mockData';
import App from '../App';

beforeEach(() => {
  jest.spyOn(global, 'fetch');
  global.fetch.mockResolvedValue({
    json: jest.fn().mockResolvedValue(mockData),
  });
});

afterEach(jest.restoreAllMocks);

const currencyInput = 'currency-input';
const valueTestID = 'value-input';
const descriptionTestID = 'description-input';
const methodTestID = 'method-input';
const tagTestID = 'tag-input';
const mockInputs = [
  {
    description: '123 dólares',
    tag: 'Alimentação',
    value: '123',
    method: 'Dinheiro',
    currency: 'USD',
  }, {
    value: '345',
    description: '345 libras',
    currency: 'GBP',
    tag: 'Lazer',
    method: 'Cartão de débito',
  }];

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
  it('Testando o valor do campo de total', async () => {
    const { store } = renderWithRouterAndRedux(<App />, { initialEntries: ['/carteira'] });
    const valueInput = screen.getByTestId(valueTestID);
    const currencySelector = screen.getByTestId(currencyInput);
    const descriptionInput = screen.getByTestId(descriptionTestID);
    const methodInput = screen.getByTestId(methodTestID);
    const tagInput = screen.getByTestId(tagTestID);
    const addExpenseBtn = screen.getByRole('button', {
      name: /adicionar despesa/i,
    });
    userEvent.type(valueInput, mockInputs[0].value);
    userEvent.selectOptions(tagInput, mockInputs[0].tag);
    await waitFor(() => {
      userEvent.selectOptions(currencySelector, mockInputs[0].currency);
    });
    userEvent.selectOptions(methodInput, mockInputs[0].method);
    userEvent.type(descriptionInput, mockInputs[0].description);
    act(() => {
      userEvent.click(addExpenseBtn);
    });
    await waitFor(() => {
      expect(store.getState().wallet.expenses).toHaveLength(1);
    });
    const totalPrice = screen.getByTestId('total-field');
    expect(totalPrice).toBeInTheDocument();
    expect(totalPrice.innerHTML).toEqual('584.63');
  });
});
