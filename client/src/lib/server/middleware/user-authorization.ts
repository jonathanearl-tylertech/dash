import { base } from '$app/paths';
import { logger } from '$lib/server/logger';
import { redirect, type Handle } from '@sveltejs/kit';
import { getAuthorizationUrl, getUserClaims } from '../oauth';
import { encryptToken } from '../jwe';
import { dev } from '$app/environment';

const CODE_VERIFIER_COOKIE = 'code_verifier';
const USER_CLAIMS_COOKIE = 'uc';

export const useUserAuthorization: Handle = async ({ event, resolve }) => {
    logger.info({ path: event.url.pathname })
    switch (event.url.pathname) {
        case `${base}/auth/signin`: {
            const { authorizationUrl, code_verifier } = await getAuthorizationUrl();
            logger.debug({ path: event.url.pathname, authorizationUrl, code_verifier })
            event.cookies.set(CODE_VERIFIER_COOKIE, code_verifier, { httpOnly: true, secure: !dev, path: `/`, sameSite: 'strict' })
            throw redirect(302, authorizationUrl);
        }
        case `${base}/auth/signout`: {
            event.cookies.delete(USER_CLAIMS_COOKIE, { httpOnly: true, secure: !dev, path: `/`, sameSite: 'strict' })
            throw redirect(302, '/');
        }
        case `${base}/auth/callback`: {
            const code_verifier = event.cookies.get(CODE_VERIFIER_COOKIE) ?? '';
            logger.debug({ path: event.url.pathname, code_verifier })
            const claims = await getUserClaims(event.url, code_verifier);
            logger.debug({ path: event.url.pathname, claims })
            event.cookies.delete(code_verifier);
            const uc = await encryptToken(claims as any);
            logger.debug({ path: event.url.pathname, uc })
            event.cookies.set(USER_CLAIMS_COOKIE, uc, { httpOnly: true, secure: !dev, path: `/`, sameSite: 'strict' });
            throw redirect(302, '/')
        }
        default: {
            return resolve(event);
        }
    }
}