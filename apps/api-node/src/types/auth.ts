export interface JwtPayload {
  sub: number;
  email: string;
  roles: string[];
  // gezet bij impersonatie (zie AuthService.impersonate)
  impersonated?: boolean;
  act?: { sub: string }; // actor = de admin die impersoneert (RFC 8693)
}

export interface Session {
  id: number;
  email: string;
  roles: string[];
}
