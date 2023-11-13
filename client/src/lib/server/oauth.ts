import { env } from "$env/dynamic/private";
import type { RequestEvent } from "@sveltejs/kit";
import * as oauth from 'oauth4webapi';
import { decryptToken, encryptToken } from "./jwe";
import { base } from '$app/paths';
import { redirect, type Handle } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { logger } from "./logger";

export interface UserClaims {
    sub: string;
    email: string;
    email_verified: boolean;
    name: string;
    picture: string | undefined;
}

export const getAuthorizationUrl = async () => {
    const issuer = new URL(env.OAUTH_ISSUER_URL as string)
    const as = await oauth
        .discoveryRequest(issuer)
        .then(response => oauth.processDiscoveryResponse(issuer, response));

    const client: oauth.Client = {
        client_id: env.OAUTH_CLIENT_ID as string,
        client_secret: env.OAUTH_CLIENT_SECRET as string,
        token_endpoint_auth_method: 'client_secret_basic',
    }
    const redirect_uri = env.OAUTH_CLIENT_REDIRECT as string;
    if (as.code_challenge_methods_supported?.includes('S256') !== true) {
        // This example assumes S256 PKCE support is signalled
        // If it isn't supported, random `state` must be used for CSRF protection.
        throw new Error();
    }
    const code_verifier = oauth.generateRandomCodeVerifier();
    const code_challenge = await oauth.calculatePKCECodeChallenge(code_verifier);
    const code_challenge_method = 'S256';
    const authorizationUrl = new URL(as.authorization_endpoint!);
    authorizationUrl.searchParams.set('client_id', client.client_id);
    authorizationUrl.searchParams.set('code_challenge', code_challenge);
    authorizationUrl.searchParams.set('code_challenge_method', code_challenge_method);
    authorizationUrl.searchParams.set('redirect_uri', redirect_uri);
    authorizationUrl.searchParams.set('response_type', 'code');
    authorizationUrl.searchParams.set('scope', 'openid profile email');
    return { authorizationUrl, code_verifier };
}

export const getUserClaims = async (currentUrl: URL, code_verifier: string) => {
    if (!code_verifier) {
        logger.error({ message: 'Missing code_verifier', code_verifier, currentUrl })
        throw new Error("Missing code_verifier");
    }

    const issuer = new URL(env.OAUTH_ISSUER_URL as string)
    const as = await oauth
        .discoveryRequest(issuer)
        .then(response => oauth.processDiscoveryResponse(issuer, response));

    const client: oauth.Client = {
        client_id: env.OAUTH_CLIENT_ID as string,
        client_secret: env.OAUTH_CLIENT_SECRET as string,
        token_endpoint_auth_method: 'client_secret_basic',
    }

    const parameters = oauth.validateAuthResponse(as, client, currentUrl, oauth.expectNoState)
    if (oauth.isOAuth2Error(parameters)) {
        logger.error({ message: 'failed to validate', parameters })
        throw new Error() // Handle OAuth 2.0 redirect error
    }

    const response = await oauth.authorizationCodeGrantRequest(
        as,
        client,
        parameters,
        env.OAUTH_CLIENT_REDIRECT as string,
        code_verifier,
    )

    let challenges: oauth.WWWAuthenticateChallenge[] | undefined
    if ((challenges = oauth.parseWwwAuthenticateChallenges(response))) {
        for (const challenge of challenges) {
            logger.error({ message: 'challenge failed', challenge })
        }
        throw new Error() // Handle www-authenticate challenges as needed
    }

    const result = await oauth.processAuthorizationCodeOpenIDResponse(as, client, response)
    if (oauth.isOAuth2Error(result)) {
        logger.error({ message: 'processAuthorizationCodeOpenIDResponse', result })
        throw new Error() // Handle OAuth 2.0 response body error
    }
    const claims = oauth.getValidatedIdTokenClaims(result);
    logger.info({ method: 'getValidatedIdTokenClaims', claims })
    return {
        sub: claims.sub,
        name: claims.name?.toString() ?? '',
        email: claims.email?.toString() ?? '',
        email_verified: claims.email_verified ?? false,
        picture: claims.picture ?? '',
    } as UserClaims;
}

export const getUser = async (event: RequestEvent) => {
    const userClaimToken = event.cookies.get('uc');
    logger.info({ userClaimToken, method: 'getUser' });
    if (!userClaimToken)
        return null;

    const claims = await decryptToken(userClaimToken);
    logger.info({ claims, method: 'getUser' });
    if (!claims)
        return null;

    return {
        sub: claims.sub as string,
        email: claims.email as string,
        email_verified: claims.email_verified as boolean,
        name: claims.name as string,
        picture: claims.picture as string,
    } as UserClaims;
}

const CODE_VERIFIER_COOKIE = 'code_verifier';
const USER_CLAIMS_COOKIE = 'uc';

export const useAuthHook: Handle = async ({ event, resolve }) => {
    logger.info({ path: event.url.pathname })
    switch (event.url.pathname) {
        case `${base}/auth/signin`: {
            const { authorizationUrl, code_verifier } = await getAuthorizationUrl();
            logger.debug({ path: event.url.pathname, authorizationUrl, code_verifier })
            event.cookies.set(CODE_VERIFIER_COOKIE, code_verifier, { httpOnly: true, secure: !dev, path: `${base}/`, sameSite: 'strict' })
            throw redirect(302, authorizationUrl);
        }
        case `${base}/auth/signout`: {
            event.cookies.delete(USER_CLAIMS_COOKIE, { httpOnly: true, secure: !dev, path: `${base}/`, sameSite: 'strict' })
            throw redirect(302, '/');
        }
        case `${base}/auth/callback`: {
            const code_verifier = event.cookies.get(CODE_VERIFIER_COOKIE) ?? '';
            logger.debug({ path: event.url.pathname, code_verifier })
            const claims = await getUserClaims(event.url, code_verifier);
            logger.debug({ path: event.url.pathname, claims })
            event.cookies.delete(code_verifier);
            const uc = await encryptToken(claims as any);
            logger.debug({ uc })
            event.cookies.set(USER_CLAIMS_COOKIE, uc, { httpOnly: true, secure: !dev, path: `${base}/`, sameSite: 'strict' });
            throw redirect(302, '/')
        }
        default: {
            return resolve(event);
        }
    }
}