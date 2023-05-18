import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import App from '../App';
import { renderWithRouterAndRedux } from './helpers/renderWith';
import { mockData } from './helpers/mockData';
import Table from '../components/Table';

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
const mockTableHeaders = [
  'Descrição',
  'Tag',
  'Método de pagamento',
  'Valor',
  'Moeda',
  'Câmbio utilizado',
  'Valor convertido',
  'Moeda de conversão',
  'Editar/Excluir',
];

describe('Testando o componente Table', () => {
  it('Testando o cabeçalho da aplicação', () => {
    act(() => {
      renderWithRouterAndRedux(<Table />);
    });
    const tableHeader = screen.getAllByRole('columnheader');
    tableHeader.forEach((each, i) => {
      expect(each.innerHTML).toBe(mockTableHeaders[i]);
    });
    expect(tableHeader).toHaveLength(9);
  });
  it('Testando se a table é renderizada com os elementos da store', async () => {
    const { store } = renderWithRouterAndRedux(<App />, { initialEntries: ['/carteira'] });
    const h1Table = screen.getByRole('heading', {
      name: /descrição dos gastos/i,
    });
    expect(h1Table).toBeInTheDocument();
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
    const cellEntries = screen.getAllByRole('cell');
    cellEntries.forEach((each) => {
      expect(each).toBeInTheDocument();
    });
    const valorConvertido = await screen.findAllByText('584.63');
    expect(valorConvertido[1].innerHTML).toBe('584.63');
  });
  it('Testando se é possível deletar elementos', async () => {
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
    const cellEntries = screen.getAllByRole('cell');
    cellEntries.forEach((each) => {
      expect(each).toBeInTheDocument();
    });
    const deleteBtn = screen.getByTestId('delete-btn');
    expect(deleteBtn).toBeInTheDocument();
    userEvent.click(deleteBtn);
    cellEntries.forEach((each) => {
      expect(each).not.toBeInTheDocument();
    });
  });
});
