export class TokenModel {
  accessToken?: string;
  expiresIn?: number;
  refreshToken?: string;
  tokenType?: string;
  userId?: string;
  externalUserId?: string;
  requiresPassword?: boolean;
  expiresUtc?: string;
  permission?: 'EndUser' | 'NewUser';
}
