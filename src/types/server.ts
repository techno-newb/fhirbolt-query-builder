export interface AuthConfig {
  username?: string;
  password?: string;
  token?: string;
  clientId?: string;
  clientSecret?: string;
}

export interface ServerConfig {
  id: string;
  name: string;
  baseUrl: string;
  version: string;
  auth: {
    type: 'none' | 'basic' | 'bearer' | 'oauth2';
    config: AuthConfig;
  };
  capabilities?: any;
  lastSync?: Date;
}
