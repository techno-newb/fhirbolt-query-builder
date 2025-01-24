import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { ServerConfig } from '../types/server';
import { addServer, setActiveServer, updateServerAuth, fetchCapabilities } from '../store/slices/serverSlice';

const ServerConnection: React.FC = () => {
  const dispatch = useDispatch();
  const { servers, activeServerId, isConnecting, error } = useSelector((state: RootState) => state.server);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleAddServer = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newServer: ServerConfig = {
      id: crypto.randomUUID(),
      name: formData.get('name') as string,
      baseUrl: formData.get('baseUrl') as string,
      version: 'R4',
      auth: {
        type: 'none',
        config: {},
      },
    };

    dispatch(addServer(newServer));
    dispatch(setActiveServer(newServer.id));
    dispatch(fetchCapabilities(newServer));
  };

  const handleAuthUpdate = (serverId: string, authType: ServerConfig['auth']['type']) => {
    const formData = new FormData(document.getElementById('authForm') as HTMLFormElement);
    const authConfig: any = {};
    formData.forEach((value, key) => {
      authConfig[key] = value;
    });

    dispatch(updateServerAuth({
      id: serverId,
      auth: {
        type: authType,
        config: authConfig,
      },
    }));

    setShowAuthModal(false);
    
    // Refresh capabilities with new auth
    const server = servers.find(s => s.id === serverId);
    if (server) {
      dispatch(fetchCapabilities(server));
    }
  };

  return (
    <section className="card">
      <h2 className="text-xl font-semibold mb-6">Server Connection</h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleAddServer} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Server Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="input"
            placeholder="e.g., HAPI FHIR Server"
            required
          />
        </div>
        
        <div>
          <label htmlFor="baseUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Base URL
          </label>
          <input
            type="url"
            id="baseUrl"
            name="baseUrl"
            className="input"
            placeholder="https://hapi.fhir.org/baseR4"
            required
          />
        </div>

        <div className="pt-2">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isConnecting}
          >
            {isConnecting ? 'Connecting...' : 'Add Server'}
          </button>
        </div>
      </form>

      {servers.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Saved Servers</h3>
          <div className="space-y-3">
            {servers.map((server) => (
              <div
                key={server.id}
                className={`p-4 rounded-md transition-colors ${
                  server.id === activeServerId
                    ? 'bg-primary text-white'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{server.name}</div>
                    <div className={`text-sm ${
                      server.id === activeServerId ? 'text-white/90' : 'text-gray-500'
                    }`}>
                      {server.baseUrl}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowAuthModal(true)}
                      className="btn btn-secondary text-xs"
                    >
                      Auth
                    </button>
                    <button
                      onClick={() => dispatch(setActiveServer(server.id))}
                      className="btn btn-secondary text-xs"
                    >
                      Select
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Server Authentication</h3>
            <form id="authForm" className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Auth Type
                </label>
                <select 
                  className="input"
                  onChange={(e) => {
                    if (activeServerId) {
                      handleAuthUpdate(activeServerId, e.target.value as ServerConfig['auth']['type']);
                    }
                  }}
                >
                  <option value="none">None</option>
                  <option value="basic">Basic Auth</option>
                  <option value="bearer">Bearer Token</option>
                </select>
              </div>
              
              {/* Auth type specific fields rendered conditionally */}
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default ServerConnection;
