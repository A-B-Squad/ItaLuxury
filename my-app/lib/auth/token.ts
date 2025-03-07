import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';
import { DecodedToken } from './types';

export const getToken = (): string | undefined => {
    return Cookies.get('Token');
    
};

export const decodeToken = (token: string): DecodedToken | null => {
    try {
        const decoded = jwt.decode(token) as DecodedToken;
        if (decoded && decoded.exp * 1000 > Date.now()) {
            return decoded;
        }
        return null;
    } catch {
        return null;
    }
};

export const removeToken = () => {
    Cookies.remove('Token', { domain: '.ita-luxury.com', path: '/' });
};