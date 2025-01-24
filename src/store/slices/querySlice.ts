import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { QueryConfig } from '../../types/query';

interface QueryState {
  currentQuery: QueryConfig;
  history: QueryConfig[];
  favorites: QueryConfig[];
}

const initialState: QueryState = {
  currentQuery: {
    resourceType: '',
    parameters: [],
    includes: [],
    revIncludes: [],
    modifiers: [],
    sorting: [],
    pagination: {},
  },
  history: [],
  favorites: [],
};

const querySlice = createSlice({
  name: 'query',
  initialState,
  reducers: {
    setResourceType: (state, action: PayloadAction<string>) => {
      state.currentQuery.resourceType = action.payload;
    },
    addParameter: (state, action: PayloadAction<any>) => {
      state.currentQuery.parameters.push(action.payload);
    },
    updateParameter: (state, action: PayloadAction<{ index: number; parameter: any }>) => {
      state.currentQuery.parameters[action.payload.index] = action.payload.parameter;
    },
    removeParameter: (state, action: PayloadAction<number>) => {
      state.currentQuery.parameters.splice(action.payload, 1);
    },
  },
});

export const { setResourceType, addParameter, updateParameter, removeParameter } = querySlice.actions;
export default querySlice.reducer;
