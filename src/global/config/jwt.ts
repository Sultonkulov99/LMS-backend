import { JwtSignOptions } from '@nestjs/jwt';

export const JWTAccessOptions = {
  secret: 'j+El3er&nI!n}g~S8623x',
  expiresIn: '2000h' as const,
};

export const JWTRefreshOptions = {
  secret: 'e0rE5Fs#543T]q34{4HLL7jsT8/83',
  expiresIn: '29d' as const,
};
