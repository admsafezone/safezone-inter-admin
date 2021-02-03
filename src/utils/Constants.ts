const Constants = {
  app: {
    appName: process.env.REACT_APP_NAME || 'Ant Admin',
  },
  storage: {
    TOKEN: 'ANT-DASHBOARD-TOKEN',
    LANG: 'ANT-DASHBOARD-LANG',
    LOGGED: 'ANT-DASHBOARD-LOGGED',
    USER: 'ANT-DASHBOARD-USER',
  },
  api: {
    AUTH: 'auth',
    USERS: 'users',
    PROFILES: 'profiles',
    RESOURCES: 'resources',
  },
  message: {
    INVALID_TOKEN: 'Invalid token',
  },
  acl: {
    USERS: 'users',
    PROFILES: 'profiles',
  },
  permissions: {
    R: 'r',
    W: 'w',
    M: 'm',
    NONE: 'n',
  },
};

export default Constants;
