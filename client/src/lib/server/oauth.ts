import { env } from "$env/dynamic/private";
import type { RequestEvent } from "@sveltejs/kit";
import * as oauth from 'oauth4webapi';
import { decryptToken, encryptToken } from "./jwe";
import { logger } from "./logger";

export interface UserClaims {
    sub: string;
    email: string;
    email_verified: boolean;
    name: string;
    picture: string | undefined;
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

export const getAuthorizationUrl = async () => {
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
    logger.debug({ method: 'getUserClaims', code_verifier, currentUrl });

    if (!code_verifier) {
        logger.error({ message: 'Missing code_verifier', code_verifier, currentUrl })
        throw new Error("Missing code_verifier");
    }

    logger.debug({ method: 'getUserClaims', OAUTH_ISSUER_URL: env.OAUTH_ISSUER_URL });
    logger.debug({ method: 'getUserClaims', as });
    logger.debug({ method: 'getUserClaims', client });

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