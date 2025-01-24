export interface CapabilityStatement {
  resourceType: string;
  status: string;
  date: string;
  rest: Array<{
    mode: string;
    resource: Array<{
      type: string;
      searchParam?: Array<{
        name: string;
        type: string;
        documentation?: string;
      }>;
    }>;
  }>;
}

export type SearchParamType = 
  | 'string'
  | 'token'
  | 'reference'
  | 'date'
  | 'number'
  | 'quantity'
  | 'uri'
  | 'special';

export interface SearchParamDefinition {
  name: string;
  type: SearchParamType;
  documentation?: string;
}

export interface FHIRResponse {
  resourceType: string;
  type: string;
  total?: number;
  entry?: Array<{
    resource: any;
  }>;
}
