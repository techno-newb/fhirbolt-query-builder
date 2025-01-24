import React from 'react';
import ServerConnection from './ServerConnection';
import ResourceSelector from './ResourceSelector';
import ParameterBuilder from './ParameterBuilder';
import QueryPreview from './QueryPreview';

const QueryBuilder: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <ServerConnection />
      <ResourceSelector />
      <ParameterBuilder />
      <QueryPreview />
    </div>
  );
};

export default QueryBuilder;
