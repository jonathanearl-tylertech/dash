import { env } from '$env/dynamic/private';
import * as jose from 'jose'

const ISSUER = 'dash';
const AUDIENCE = 'dash';
const EXPIRATION = '24h';

export const encryptToken = async (payload: jose.JWTPayload) => {
    const { SESSION_SECRET } = env;
    const secret = jose.base64url.decode(SESSION_SECRET);
    const jwt = await new jose.EncryptJWT(payload)
        .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
        .setIssuedAt()
        .setIssuer(ISSUER)
        .setAudience(AUDIENCE)
        .setExpirationTime(EXPIRATION)
        .encrypt(secret);
    return jwt;
}

export const decryptToken = async (jwt: string) => {
    const { SESSION_SECRET } = env;
    const secret = jose.base64url.decode(SESSION_SECRET);
    const { payload } = await jose.jwtDecrypt(jwt, secret, {
        issuer: ISSUER,
        audience: AUDIENCE,
    })
    return payload;
}