import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setResourceType } from '../store/slices/querySlice';

const ResourceSelector: React.FC = () => {
  const dispatch = useDispatch();
  const { resourceType } = useSelector((state: RootState) => state.query.currentQuery);
  const { activeServerId, capabilities, isConnecting } = useSelector((state: RootState) => state.server);

  // Safely get available resources
  const availableResources = React.useMemo(() => {
    if (!activeServerId || !capabilities || !capabilities[activeServerId]) {
      return [];
    }
    
    const serverCapabilities = capabilities[activeServerId];
    return serverCapabilities?.rest?.[0]?.resource?.map(r => r.type) || [];
  }, [activeServerId, capabilities]);

  if (!activeServerId) {
    return (
      <section className="card">
        <div className="text-center py-8 text-gray-500">
          Please connect to a FHIR server first to view available resources.
        </div>
      </section>
    );
  }

  if (isConnecting) {
    return (
      <section className="card">
        <div className="text-center py-8 text-gray-500">
          Loading available resources...
        </div>
      </section>
    );
  }

  if (availableResources.length === 0) {
    return (
      <section className="card">
        <div className="text-center py-8 text-gray-500">
          No resources available from the server.
        </div>
      </section>
    );
  }

  return (
    <section className="card">
      <h2 className="text-xl font-semibold mb-6">Select Resource</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {availableResources.map((resource) => (
          <button
            key={resource}
            onClick={() => dispatch(setResourceType(resource))}
            className={`
              p-4 rounded-lg border transition-all
              ${resourceType === resource
                ? 'border-primary bg-primary text-white shadow-sm'
                : 'border-gray-200 hover:border-primary hover:shadow-sm'
              }
            `}
          >
            <span className="font-medium">{resource}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default ResourceSelector;
