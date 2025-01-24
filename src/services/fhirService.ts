import { CapabilityStatement, FHIRResponse } from '../types/fhir';
import { ServerConfig } from '../types/server';

class FHIRService {
  private capabilityCache: Map<string, { statement: CapabilityStatement; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 1000 * 60 * 60; // 1 hour

  constructor() {
    // Initialize service
  }

  private async fetchWithAuth(url: string, server: ServerConfig): Promise<Response> {
    const headers: HeadersInit = {
      'Accept': 'application/fhir+json',
      'Content-Type': 'application/fhir+json',
    };

    if (server.auth.type === 'basic') {
      const { username, password } = server.auth.config;
      const base64 = btoa(`${username}:${password}`);
      headers['Authorization'] = `Basic ${base64}`;
    } else if (server.auth.type === 'bearer') {
      headers['Authorization'] = `Bearer ${server.auth.config.token}`;
    }

    return fetch(url, { headers });
  }

  async getCapabilityStatement(server: ServerConfig): Promise<CapabilityStatement> {
    const cached = this.capabilityCache.get(server.id);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.statement;
    }

    const url = `${server.baseUrl}/metadata`;
    const response = await this.fetchWithAuth(url, server);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch capability statement: ${response.statusText}`);
    }

    const statement = await response.json();
    this.capabilityCache.set(server.id, {
      statement,
      timestamp: Date.now(),
    });

    return statement;
  }

  async executeQuery(server: ServerConfig, resourceType: string, parameters: string): Promise<FHIRResponse> {
    const url = `${server.baseUrl}/${resourceType}${parameters ? '?' + parameters : ''}`;
    const response = await this.fetchWithAuth(url, server);
    
    if (!response.ok) {
      throw new Error(`Query execution failed: ${response.statusText}`);
    }

    return response.json();
  }
}

// Export a single instance
export default new FHIRService();
