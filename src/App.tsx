import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import QueryBuilder from './components/QueryBuilder';

function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-surface">
        <header className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-gray-900">FHIR Query Builder</h1>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <QueryBuilder />
        </main>
      </div>
    </Provider>
  );
}

export default App;
