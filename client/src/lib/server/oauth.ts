import { env } from "$env/dynamic/private";
import type { RequestEvent } from "@sveltejs/kit";
import * as oauth from 'oauth4webapi';
import { decryptToken } from "./jwe";
import { logger } from "./logger";
import { building } from "$app/environment";

export interface UserClaims {
    sub: string;
    email: string;
    email_verified: boolean;
    name: string;
    picture: string | undefined;
}

const state = oauth.generateRandomCodeVerifier();

export const getAuthorizationUrl = async () => {
    const issuer = new URL(env.OAUTH_ISSUER_URL as string)
    const as = await oauth
        .discoveryRequest(issuer)
        .then(response => oauth.processDiscoveryResponse(issuer, response));

    if (as.code_challenge_methods_supported?.includes('S256') !== true) {
        // This example assumes S256 PKCE support is signalled
        // If it isn't supported, random `state` must be used for CSRF protection.
        logger.error("does not support S256")
        throw new Error("does not support S256");
    }
    const code_verifier = oauth.generateRandomCodeVerifier();
    const code_challenge = await oauth.calculatePKCECodeChallenge(code_verifier);
    const code_challenge_method = 'S256';
    const authorizationUrl = new URL(as.authorization_endpoint!);
    authorizationUrl.searchParams.set('client_id', env.OAUTH_CLIENT_ID as string);
    authorizationUrl.searchParams.set('code_challenge', code_challenge);
    authorizationUrl.searchParams.set('code_challenge_method', code_challenge_method);
    authorizationUrl.searchParams.set('redirect_uri', env.OAUTH_CLIENT_REDIRECT as string);
    authorizationUrl.searchParams.set('response_type', 'code');
    authorizationUrl.searchParams.set('state', state);
    authorizationUrl.searchParams.set('scope', 'openid profile email');
    return { authorizationUrl, code_verifier };
}

export const getUserClaims = async (currentUrl: URL, code_verifier: string) => {
    try {
        const issuer = new URL(env.OAUTH_ISSUER_URL as string)

        const as = await oauth
            .discoveryRequest(issuer)
            .then(response => oauth.processDiscoveryResponse(issuer, response));

        const client = {
            client_id: env.OAUTH_CLIENT_ID as string,
            client_secret: env.OAUTH_CLIENT_SECRET as string,
        }

        logger.debug({ method: 'getUserClaims', as, client, code_verifier, currentUrl });

        if (!code_verifier) {
            logger.error({ message: 'Missing code_verifier', code_verifier, currentUrl })
            throw new Error("Missing code_verifier");
        }

        logger.debug({ method: 'validateAuthResponse', currentUrl });
        const parameters = oauth.validateAuthResponse(as, client, currentUrl, state)
        if (oauth.isOAuth2Error(parameters)) {
            logger.error({ message: 'failed to validate', parameters })
            throw new Error() // Handle OAuth 2.0 redirect error
        }
        logger.debug({ method: 'authorizationCodeGrantRequest', parameters, OAUTH_CLIENT_REDIRECT: env.OAUTH_CLIENT_REDIRECT, code_verifier });
        const response = await oauth.authorizationCodeGrantRequest(
            as,
            client,
            parameters,
            env.OAUTH_CLIENT_REDIRECT as string,
            code_verifier,
        )


        logger.debug({ method: 'processAuthorizationCodeOpenIDResponse', response })
        let challenges: oauth.WWWAuthenticateChallenge[] | undefined
        if ((challenges = oauth.parseWwwAuthenticateChallenges(response))) {
            for (const challenge of challenges) {
                logger.error({ message: 'challenge failed', challenge })
            }
            throw new Error() // Handle www-authenticate challenges as needed
        }
        logger.debug({ method: 'processAuthorizationCodeOpenIDResponse', as, client, response })
        const result = await oauth.processAuthorizationCodeOpenIDResponse(as, client, response)
        if (oauth.isOAuth2Error(result)) {
            logger.error({ message: 'processAuthorizationCodeOpenIDResponse', result })
            throw new Error() // Handle OAuth 2.0 response body error
        }

        logger.debug({ method: 'getValidatedIdTokenClaims', result })
        const claims = oauth.getValidatedIdTokenClaims(result);
        logger.debug({ method: 'getValidatedIdTokenClaims', claims })
        return {
            sub: claims.sub,
            name: claims.name?.toString() ?? '',
            email: claims.email?.toString() ?? '',
            email_verified: claims.email_verified ?? false,
            picture: claims.picture ?? '',
        } as UserClaims;
    } catch (error) {
        logger.debug(Object.keys(error as Object));
        logger.error({ error, message: 'unable to retrieve claims' });
        return null;
    }
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