import { env } from "$env/dynamic/private";
import type { RequestEvent } from "@sveltejs/kit";
import oauth from 'oauth4webapi';
import { decryptToken } from "./jwe";

export interface UserClaims {
    sub: string;
    email: string;
    email_verified: boolean;
    name: string;
    picture: string | undefined;
}

export const getAuthorizationUrl = async () => {
    const issuer = new URL(env.OAUTH_ISSUER_URL)
    const as = await oauth
        .discoveryRequest(issuer)
        .then(response => oauth.processDiscoveryResponse(issuer, response));

    const client: oauth.Client = {
        client_id: env.OAUTH_CLIENT_ID,
        client_secret: env.OAUTH_CLIENT_SECRET,
        token_endpoint_auth_method: 'client_secret_basic',
    }
    const redirect_uri = 'http://localhost:5173/auth/callback';
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
        throw new Error("Missing code_verifier");
    }

    const issuer = new URL(env.OAUTH_ISSUER_URL)
    const as = await oauth
        .discoveryRequest(issuer)
        .then(response => oauth.processDiscoveryResponse(issuer, response));

    const client: oauth.Client = {
        client_id: env.OAUTH_CLIENT_ID,
        client_secret: env.OAUTH_CLIENT_SECRET,
        token_endpoint_auth_method: 'client_secret_basic',
    }

    const parameters = oauth.validateAuthResponse(as, client, currentUrl, oauth.expectNoState)
    if (oauth.isOAuth2Error(parameters)) {
        console.log('error', parameters)
        throw new Error() // Handle OAuth 2.0 redirect error
    }

    const response = await oauth.authorizationCodeGrantRequest(
        as,
        client,
        parameters,
        env.OAUTH_CLIENT_REDIRECT,
        code_verifier,
    )

    let challenges: oauth.WWWAuthenticateChallenge[] | undefined
    if ((challenges = oauth.parseWwwAuthenticateChallenges(response))) {
        for (const challenge of challenges) {
            console.log('challenge', challenge)
        }
        throw new Error() // Handle www-authenticate challenges as needed
    }

    const result = await oauth.processAuthorizationCodeOpenIDResponse(as, client, response)
    if (oauth.isOAuth2Error(result)) {
        console.log('error', result)
        throw new Error() // Handle OAuth 2.0 response body error
    }
    const claims = oauth.getValidatedIdTokenClaims(result);
    console.log({ claims })
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
    if (!userClaimToken)
        return null;

    const claims = await decryptToken(userClaimToken);
    return {
        sub: claims.sub as string,
        email: claims.email as string,
        email_verified: claims.email_verified as boolean,
        name: claims.name as string,
        picture: claims.picture as string,
    } as UserClaims;
}