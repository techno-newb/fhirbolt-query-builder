import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import fhirService from '../services/fhirService';
import { FHIRResponse } from '../types/fhir';

const QueryPreview: React.FC = () => {
  const { currentQuery } = useSelector((state: RootState) => state.query);
  const { activeServerId, servers } = useSelector((state: RootState) => state.server);
  const [isExecuting, setIsExecuting] = useState(false);
  const [results, setResults] = useState<FHIRResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const activeServer = servers.find((s) => s.id === activeServerId);

  const buildQueryUrl = () => {
    if (!activeServer || !currentQuery.resourceType) return '';

    const baseUrl = activeServer.baseUrl.replace(/\/$/, '');
    const params = currentQuery.parameters
      .filter((p) => p.name && p.value)
      .map((p) => {
        const prefix = p.prefix ? p.prefix + '|' : '';
        return `${p.name}=${prefix}${encodeURIComponent(p.value)}`;
      })
      .join('&');

    return `${baseUrl}/${currentQuery.resourceType}${params ? '?' + params : ''}`;
  };

  const handleExecuteQuery = async () => {
    if (!activeServer || !currentQuery.resourceType) return;

    setIsExecuting(true);
    setError(null);

    try {
      const params = currentQuery.parameters
        .filter((p) => p.name && p.value)
        .map((p) => {
          const prefix = p.prefix ? p.prefix + '|' : '';
          return `${p.name}=${prefix}${encodeURIComponent(p.value)}`;
        })
        .join('&');

      const response = await fhirService.executeQuery(
        activeServer,
        currentQuery.resourceType,
        params
      );
      setResults(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to execute query');
    } finally {
      setIsExecuting(false);
    }
  };

  const queryUrl = buildQueryUrl();

  if (!queryUrl) {
    return null;
  }

  return (
    <section className="card">
      <h2 className="text-xl font-semibold mb-6">Query Preview</h2>
      
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <code className="font-mono text-sm break-all text-gray-800">{queryUrl}</code>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleExecuteQuery}
            disabled={isExecuting}
            className="btn btn-primary"
          >
            {isExecuting ? 'Executing...' : 'Execute Query'}
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {results && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Results</h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-auto max-h-96">
              <pre className="text-sm">
                {JSON.stringify(results, null, 2)}
              </pre>
            </div>
            {results.total !== undefined && (
              <div className="mt-2 text-sm text-gray-600">
                Total results: {results.total}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default QueryPreview;
