/**
 * @format
 */

import 'react-native';
import React from 'react';
import {it, jest, beforeEach} from '@jest/globals';
import renderer, {act} from 'react-test-renderer';

jest.mock('../database/database', () => ({
  getDBConnection: jest.fn().mockResolvedValue({}),
  createExpensesTable: jest.fn().mockResolvedValue(undefined),
  createDescriptionsTable: jest.fn().mockResolvedValue(undefined),
  getExpenses: jest.fn().mockResolvedValue([]),
  addExpense: jest.fn().mockResolvedValue(undefined),
  updateExpense: jest.fn().mockResolvedValue(undefined),
  deleteExpense: jest.fn().mockResolvedValue(undefined),
  deleteAllExpenses: jest.fn().mockResolvedValue(undefined),
  incrementDescription: jest.fn().mockResolvedValue(undefined),
  getTopDescriptions: jest.fn().mockResolvedValue([]),
  closeDB: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('react-native/Libraries/AppState/AppState', () => ({
  addEventListener: jest.fn(() => ({remove: jest.fn()})),
  currentState: 'active',
}));

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  addEventListener: jest.fn(() => ({remove: jest.fn()})),
  getInitialURL: jest.fn().mockResolvedValue(null),
}));

import App from '../App';

beforeEach(() => {
  jest.clearAllMocks();
});

it('renders correctly', async () => {
  await act(async () => {
    renderer.create(<App />);
  });
});
