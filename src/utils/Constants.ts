const Constants = {
  app: {
    appName: process.env.REACT_APP_NAME || 'Safezone',
  },
  storage: {
    TOKEN: 'SAFEZONE-TOKEN',
    LANG: 'SAFEZONE-LANG',
    OPTIONS: 'SAFEZONE-OPTIONS',
    LOGGED: 'SAFEZONE-LOGGED',
    USER: 'SAFEZONE-USER',
    COMPANY: 'SAFEZONE-COMPANY',
    LANGUAGES: 'SAFEZONE-LANGUAGES',
  },
  api: {
    AUTH: 'auth',
    ACTIVITIES: 'activities',
    COMPANIES: 'companies',
    LANGUAGES: 'languages',
    MEDIA: 'media',
    PARAMS: 'params',
    PROFILES: 'profiles',
    REFRESH: 'refresh',
    RESOURCES: 'resources',
    USERS: 'users',
  },
  message: {
    EXPIRED_TOKEN: 'jwt expired',
  },
  acl: {
    USERS: 'users',
    COMPANIES: 'companies',
    PROFILES: 'profiles',
    ACTIVITIES: 'activities',
    LANGUAGES: 'languages',
    DEFAULT: 'default',
  },
  permissions: {
    R: 'r',
    W: 'w',
    M: 'm',
    F: 'f',
    NONE: 'n',
  },
};

export default Constants;
