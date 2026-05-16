const DEFAULT_USER_APP_URL = 'http://localhost:3001';

const normalizeBaseUrl = (value: string) => value.endsWith('/') ? value : `${value}/`;

export const USER_APP_URL = process.env.NEXT_PUBLIC_USER_APP_URL || DEFAULT_USER_APP_URL;

export const buildUserAppUrl = (path: string) => new URL(path.replace(/^\//, ''), normalizeBaseUrl(USER_APP_URL)).toString();