const Constants = {
  app: {
    appName: process.env.REACT_APP_NAME || 'Safezone',
  },
  storage: {
    TOKEN: 'SAFEZONE-TOKEN',
    LANG: 'SAFEZONE-LANG',
    LOGGED: 'SAFEZONE-LOGGED',
    USER: 'SAFEZONE-USER',
    COMPANY: 'SAFEZONE-COMPANY',
  },
  api: {
    AUTH: 'auth',
    USERS: 'users',
    COMPANIES: 'companies',
    PROFILES: 'profiles',
    RESOURCES: 'resources',
    COMPANIES: 'companies',
  },
  message: {
    INVALID_TOKEN: 'Invalid token',
  },
  acl: {
    USERS: 'users',
    COMPANIES: 'companies',
    PROFILES: 'profiles',
    COMPANIES: 'companies',
  },
  permissions: {
    R: 'r',
    W: 'w',
    M: 'm',
    NONE: 'n',
  },
};

export default Constants;
