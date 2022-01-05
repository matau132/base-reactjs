import { AppState } from '../../reducer';
import { createSelector } from '@reduxjs/toolkit';

//get auth state
const getFeatureState = (state: AppState) => state.authentication;
export const authSelector = {
  authentication: createSelector(getFeatureState, (state) => state),
};
