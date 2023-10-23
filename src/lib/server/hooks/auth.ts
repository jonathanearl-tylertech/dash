import { base } from '$app/paths';
import { redirect, type Handle } from '@sveltejs/kit';
import { getAuthorizationUrl, getUser, getUserClaims } from '../oauth';
import { encryptToken } from '../jwe';
import { dev } from '$app/environment';

const CODE_VERIFIER_COOKIE = 'code_verifier';
const USER_CLAIMS_COOKIE = 'uc';

export const useAuthHook: Handle = async ({ event, resolve }) => {
    switch (event.url.pathname) {
        case `${base}/auth/signin`: {
            const { authorizationUrl, code_verifier } = await getAuthorizationUrl();
            event.cookies.set(CODE_VERIFIER_COOKIE, code_verifier, { httpOnly: true, secure: !dev, path: `${base}/`, sameSite: 'strict' })
            throw redirect(302, authorizationUrl);
        }
        case `${base}/auth/signout`: {
            event.cookies.delete(USER_CLAIMS_COOKIE, { httpOnly: true, secure: !dev, path: `${base}/`, sameSite: 'strict' })
            throw redirect(302, '/');
        }
        case `${base}/auth/callback`: {
            const code_verifier = event.cookies.get(CODE_VERIFIER_COOKIE) ?? '';
            const claims = await getUserClaims(event.url, code_verifier);
            event.cookies.delete(code_verifier);
            const uc = await encryptToken(claims as any);
            event.cookies.set(USER_CLAIMS_COOKIE, uc, { httpOnly: true, secure: !dev, path: `${base}/`, sameSite: 'strict' });
            throw redirect(302, '/')
        }
        default: {
            const user = await getUser(event);
            event.locals.user = user;
            return resolve(event);
        }
    }
}