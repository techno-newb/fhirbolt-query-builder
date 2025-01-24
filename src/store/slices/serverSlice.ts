import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ServerConfig } from '../../types/server';
import { CapabilityStatement } from '../../types/fhir';
import fhirService from '../../services/fhirService';

interface ServerState {
  servers: ServerConfig[];
  activeServerId: string | null;
  isConnecting: boolean;
  error: string | null;
  capabilities: Record<string, CapabilityStatement>;
}

const initialState: ServerState = {
  servers: [],
  activeServerId: null,
  isConnecting: false,
  error: null,
  capabilities: {},
};

export const fetchCapabilities = createAsyncThunk(
  'server/fetchCapabilities',
  async (server: ServerConfig) => {
    return await fhirService.getCapabilityStatement(server);
  }
);

const serverSlice = createSlice({
  name: 'server',
  initialState,
  reducers: {
    addServer: (state, action: PayloadAction<ServerConfig>) => {
      state.servers.push(action.payload);
    },
    setActiveServer: (state, action: PayloadAction<string>) => {
      state.activeServerId = action.payload;
    },
    setConnecting: (state, action: PayloadAction<boolean>) => {
      state.isConnecting = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateServerAuth: (state, action: PayloadAction<{ id: string; auth: ServerConfig['auth'] }>) => {
      const server = state.servers.find(s => s.id === action.payload.id);
      if (server) {
        server.auth = action.payload.auth;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCapabilities.pending, (state) => {
        state.isConnecting = true;
        state.error = null;
      })
      .addCase(fetchCapabilities.fulfilled, (state, action) => {
        if (state.activeServerId) {
          state.capabilities[state.activeServerId] = action.payload;
        }
        state.isConnecting = false;
      })
      .addCase(fetchCapabilities.rejected, (state, action) => {
        state.isConnecting = false;
        state.error = action.error.message || 'Failed to fetch capabilities';
      });
  },
});

export const { 
  addServer, 
  setActiveServer, 
  setConnecting, 
  setError,
  updateServerAuth,
} = serverSlice.actions;

export default serverSlice.reducer;
