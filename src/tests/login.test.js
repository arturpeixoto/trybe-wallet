import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { renderWithRouterAndRedux } from './helpers/renderWith';
import { defaultEmail } from './helpers/mockData';

describe('Testando a página de login', () => {
  it('Testando se existe um input para email', () => {
    renderWithRouterAndRedux(<App />);
    const emailLabel = screen.getByText(/email/i);
    const emailInput = screen.getByLabelText(/email/i);
    expect(emailLabel).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
  });
  it('Testando se existe um input para senha', () => {
    renderWithRouterAndRedux(<App />);
    const passwordLabel = screen.getByText(/senha/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    expect(passwordLabel).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });
  it('Testando se colocando email inválido e senha, com numero de caracteres maior que 6, o botão fica clicável', () => {
    renderWithRouterAndRedux(<App />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const loginButton = screen.getByRole('button', {
      name: /entrar/i,
    });
    userEvent.type(emailInput, 'artur@gmail.ks');
    userEvent.type(passwordInput, '123456');
    expect(loginButton).toBeDisabled();
  });
  it('Testando se colocando email válido e senha, com numero de caracteres menor que 6, o botão fica clicável', () => {
    renderWithRouterAndRedux(<App />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const loginButton = screen.getByRole('button', {
      name: /entrar/i,
    });
    userEvent.type(emailInput, defaultEmail);
    userEvent.type(passwordInput, '12345');
    expect(loginButton).toBeDisabled();
  });
  it('Testando se colocando email válido e senha, com numero de caracteres maior que 6, o botão fica clicável', () => {
    renderWithRouterAndRedux(<App />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const loginButton = screen.getByRole('button', {
      name: /entrar/i,
    });
    userEvent.type(emailInput, defaultEmail);
    userEvent.type(passwordInput, '123456');
    expect(loginButton).not.toBeDisabled();
  });
  it('Testando se input envia informações pro estado global e a página renderizada é carteira', () => {
    const initialState = { initialState: { user: {
      email: '',
      password: '',
    } } };
    const { store, history } = renderWithRouterAndRedux(<App />, initialState);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const loginButton = screen.getByRole('button', {
      name: /entrar/i,
    });
    userEvent.type(emailInput, defaultEmail);
    userEvent.type(passwordInput, '123456');
    userEvent.click(loginButton);
    expect(store.getState().user.email).toBe(defaultEmail);
    const { pathname } = history.location;
    expect(pathname).toBe('/carteira');
  });
});
