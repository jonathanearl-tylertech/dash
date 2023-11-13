import * as dotenv from 'dotenv';
import readline from 'node:readline/promises';
import path from 'node:path';

dotenv.config({ path: '../../client/.env' });

const getWellknownEndpoints = async () => {
    const issuer = process.env.OAUTH_ISSUER_URL as string;
    const wellknown = path.join(issuer, '.well-known/openid-configuration');
    const url = new URL(wellknown);
    const res = await fetch(url.toString())
        .then(res => res.json()) as { authorization_endpoint: string, token_endpoint: string, userinfo_endpoint: string }
    return res;
}

const getAuthorizationUrl = async (authorization_endpoint: string) => {
    const authUrl = new URL(authorization_endpoint);
    authUrl.searchParams.append('response_type', 'code')
    authUrl.searchParams.append('client_id', process.env.OAUTH_CLIENT_ID as string)
    authUrl.searchParams.append('scope', 'openid email')
    authUrl.searchParams.append('redirect_uri', process.env.OAUTH_CLIENT_REDIRECT as string)
    return authUrl.toString()
}

const getTokens = async (current_url: string, token_endpoint: string) => {
    const url = new URL(current_url);
    const code = url.searchParams.get('code')
    var details = {
        'client_id': process.env.OAUTH_CLIENT_ID as string,
        'client_secret': process.env.OAUTH_CLIENT_SECRET as string,
        'redirect_uri': process.env.OAUTH_CLIENT_REDIRECT as string,
        grant_type: 'authorization_code',
        code
    } as any;

    const formBody = Object.keys(details).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key])).join('&');

    const response = await fetch(token_endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: formBody
    }).then(res => res.json())
    return response as { id_token: string };
}

const getInfo = async (userinfo_endpoint: string, id_token: string) => {

}

console.log(process.env.OAUTH_CLIENT_ID)
async function main() {
    const endpoints = await getWellknownEndpoints();
    console.log(endpoints);
    const authorizationUrl = await getAuthorizationUrl(endpoints.authorization_endpoint);
    console.log(authorizationUrl);
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const callbackUrl = await rl.question('\nVisit the link, what is the call back url?\n')
    const tokens = await getTokens(
        callbackUrl,
        endpoints.token_endpoint
    );
    console.log(tokens);
    // token data
    var base64Url = tokens.id_token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(Buffer.from(base64, 'base64').toString().split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    console.log(JSON.parse(jsonPayload));
}

main();


