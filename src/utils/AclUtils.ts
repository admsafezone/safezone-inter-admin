import jwt from 'jwt-decode';
import { sls } from './StorageUtils';
import Constants from './Constants';

function tokenDecode(token: string): any {
  try {
    return jwt(token);
  } catch (error) {}
}

function checkACL(resource: string, level = 'r'): boolean {
  if (!JSON.parse(process.env.REACT_APP_ACL || 'false')) {
    return true;
  }
  const { token } = sls.getItem(Constants.storage.TOKEN) || {};
  if (!token) {
    return false;
  }

  let decoded: any = {};
  try {
    decoded = tokenDecode(token);
  } catch (error) {}

  const permissions = decoded.acl;
  const levels: any = {
    r: ['r', 'w', 'm', 'f'],
    w: ['w', 'm', 'f'],
    m: ['m', 'f'],
    f: ['f'],
  };

  return levels[level].includes(permissions[resource]);
}

export { checkACL, tokenDecode };
