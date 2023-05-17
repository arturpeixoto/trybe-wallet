import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { renderWithRouterAndRedux } from './helpers/renderWith';

describe('Testando o WalletForm', () => {
  it('Testando se existem os inputs no formulário', () => {
    const { history } = renderWithRouterAndRedux(<App />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const loginButton = screen.getByRole('button', {
      name: /entrar/i,
    });
    userEvent.type(emailInput, 'artur@gmail.com');
    userEvent.type(passwordInput, '123456');
    userEvent.click(loginButton);
    const { pathname } = history.location;
    expect(pathname).toBe('/carteira');
    const valueInput = screen.getByTestId('value-input');
    const currencySelector = screen.getByTestId('currency-input');
    const descriptionInput = screen.getByTestId('description-input');
    const methodInput = screen.getByTestId('method-input');
    const tagInput = screen.getByTestId('tag-input');
    expect(valueInput).toBeInTheDocument();
    expect(currencySelector).toBeInTheDocument();
    expect(descriptionInput).toBeInTheDocument();
    expect(methodInput).toBeInTheDocument();
    expect(tagInput).toBeInTheDocument();
  });
  it.skip('', () => {
  });
});
