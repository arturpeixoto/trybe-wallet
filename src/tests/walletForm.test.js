import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import App from '../App';
import { renderWithRouterAndRedux } from './helpers/renderWith';
import { mockData } from './helpers/mockData';

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
    value: '123',
    description: '123 dólares',
    currency: 'USD',
    tag: 'Alimentação',
    method: 'Dinheiro',
  }, {
    value: '345',
    description: '345 libras',
    currency: 'GBP',
    tag: 'Lazer',
    method: 'Cartão de débito',
  }];

describe('Testando o WalletForm', () => {
  it('Testando se existem os inputs no formulário depois do login', async () => {
    const { history } = renderWithRouterAndRedux(<App />);
    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const loginButton = screen.getByRole('button', {
      name: /entrar/i,
    });
    act(() => {
      userEvent.type(emailInput, 'artur@gmail.com');
      userEvent.type(passwordInput, '123456');
      userEvent.click(loginButton);
      const { pathname } = history.location;
      expect(pathname).toBe('/carteira');
    });
    await waitFor(() => {
      const valueInput = screen.getByTestId(valueTestID);
      const currencySelector = screen.getByTestId(currencyInput);
      const descriptionInput = screen.getByTestId(descriptionTestID);
      const methodInput = screen.getByTestId(methodTestID);
      const tagInput = screen.getByTestId(tagTestID);
      expect(valueInput).toBeInTheDocument();
      expect(currencySelector).toBeInTheDocument();
      expect(descriptionInput).toBeInTheDocument();
      expect(methodInput).toBeInTheDocument();
      expect(tagInput).toBeInTheDocument();
    });
  });
  it('Teste se o fetch com as chaves de currency estão ocorrendo', async () => {
    const { store } = renderWithRouterAndRedux(<App />, { initialEntries: ['/carteira'] });
    const currencySelector = screen.getByTestId(currencyInput);
    await waitFor(() => {
      expect(store.getState().wallet.currencies).toHaveLength(15);
      userEvent.selectOptions(currencySelector, 'GBP');
      expect(currencySelector.childElementCount).toEqual(15);
    });
  });
  it('Teste se adiciona um gasto ao estado global', async () => {
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
    userEvent.type(valueInput, mockInputs[1].value);
    userEvent.selectOptions(tagInput, mockInputs[1].tag);
    await waitFor(() => {
      userEvent.selectOptions(currencySelector, mockInputs[1].currency);
    });
    userEvent.selectOptions(methodInput, mockInputs[1].method);
    userEvent.type(descriptionInput, mockInputs[1].description);
    act(() => {
      userEvent.click(addExpenseBtn);
    });
    await waitFor(() => {
      expect(store.getState().wallet.expenses).toHaveLength(2);
    });
  });
  it('Testa se ao clicar editar despesa, a despesa é mostrada nos inputs e alterada no documento', async () => {
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
    act(() => userEvent.click(addExpenseBtn));
    await waitFor(() => {
      expect(store.getState().wallet.expenses).toHaveLength(1);
    });
    const editBtn = screen.getByTestId('edit-btn');
    act(() => {
      userEvent.click(editBtn);
    });
    expect(valueInput).toHaveValue(123);
    expect(currencySelector).toHaveValue('USD');
    expect(methodInput).toHaveValue('Dinheiro');
    expect(descriptionInput).toHaveValue('123 dólares');
    const editExpenseBtn = screen.getByRole('button', {
      name: /editar despesa/i,
    });
    expect(editExpenseBtn).toBeInTheDocument();
    act(() => {
      userEvent.clear(valueInput);
      userEvent.clear(descriptionInput);
      userEvent.type(descriptionInput, '144 dólares');
      userEvent.type(valueInput, '144');
      userEvent.click(editExpenseBtn);
    });
    await waitFor(() => {
      expect(store.getState().wallet.expenses[0].value).toBe('144');
    });
    const newValue = await screen.findByText('144 dólares');
    expect(newValue).toBeInTheDocument();
  });
});
