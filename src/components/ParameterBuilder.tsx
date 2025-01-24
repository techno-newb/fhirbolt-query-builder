import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { addParameter, removeParameter, updateParameter } from '../store/slices/querySlice';
import { SearchParameter } from '../types/query';
import { SearchParamDefinition } from '../types/fhir';

const PARAM_TYPE_PREFIXES: Record<string, string[]> = {
  number: ['eq', 'ne', 'gt', 'lt', 'ge', 'le'],
  date: ['eq', 'ne', 'gt', 'lt', 'ge', 'le', 'sa', 'eb'],
  quantity: ['eq', 'ne', 'gt', 'lt', 'ge', 'le'],
};

const ParameterBuilder: React.FC = () => {
  const dispatch = useDispatch();
  const { parameters, resourceType } = useSelector(
    (state: RootState) => state.query.currentQuery
  );
  const { activeServerId, capabilities } = useSelector((state: RootState) => state.server);

  const availableParams: SearchParamDefinition[] = 
    activeServerId && 
    capabilities[activeServerId]?.rest[0]?.resource?.find(r => r.type === resourceType)
      ?.searchParam || [];

  const handleAddParameter = () => {
    dispatch(
      addParameter({
        name: '',
        value: '',
        type: 'string',
        prefix: '',
      })
    );
  };

  const handleParameterChange = (index: number, field: keyof SearchParameter, value: string) => {
    const parameter = { ...parameters[index], [field]: value };
    
    // If changing the parameter name, update the type from the definition
    if (field === 'name') {
      const paramDef = availableParams.find(p => p.name === value);
      if (paramDef) {
        parameter.type = paramDef.type;
      }
    }
    
    dispatch(updateParameter({ index, parameter }));
  };

  if (!resourceType) {
    return null;
  }

  return (
    <section className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Search Parameters</h2>
        <button onClick={handleAddParameter} className="btn btn-primary">
          Add Parameter
        </button>
      </div>

      <div className="space-y-4">
        {parameters.map((param, index) => {
          const paramDef = availableParams.find(p => p.name === param.name);
          const prefixes = paramDef ? PARAM_TYPE_PREFIXES[paramDef.type] : undefined;

          return (
            <div key={index} className="flex gap-4 items-start">
              <div className="flex-1">
                <select
                  value={param.name}
                  onChange={(e) => handleParameterChange(index, 'name', e.target.value)}
                  className="input"
                >
                  <option value="">Select parameter</option>
                  {availableParams.map((p) => (
                    <option key={p.name} value={p.name}>
                      {p.name} ({p.type})
                    </option>
                  ))}
                </select>
                {paramDef?.documentation && (
                  <div className="mt-1 text-xs text-gray-500">
                    {paramDef.documentation}
                  </div>
                )}
              </div>

              {prefixes && (
                <div className="w-24">
                  <select
                    value={param.prefix || ''}
                    onChange={(e) => handleParameterChange(index, 'prefix', e.target.value)}
                    className="input"
                  >
                    <option value="">No prefix</option>
                    {prefixes.map((prefix) => (
                      <option key={prefix} value={prefix}>
                        {prefix}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex-1">
                <input
                  type="text"
                  value={param.value}
                  onChange={(e) => handleParameterChange(index, 'value', e.target.value)}
                  placeholder="Value"
                  className="input"
                />
              </div>

              <button
                onClick={() => dispatch(removeParameter(index))}
                className="btn border border-red-200 text-red-600 hover:bg-red-50 px-3"
              >
                Remove
              </button>
            </div>
          );
        })}
        
        {parameters.length === 0 && (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            No parameters added yet. Click "Add Parameter" to start building your query.
          </div>
        )}
      </div>
    </section>
  );
};

export default ParameterBuilder;
