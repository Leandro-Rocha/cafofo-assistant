import axios from "axios";
import * as fs from 'fs';
import moment from "moment";
import { requireProperty } from "profile-env";

const GOOGLE_TOKEN_API = requireProperty('GOOGLE_TOKEN_API')
const GOOGLE_CLIENT_ID = requireProperty('GOOGLE_CLIENT_ID')
const GOOGLE_CLIENT_SECRET = requireProperty('GOOGLE_CLIENT_SECRET')
const GOOGLE_REFRESH_TOKEN = requireProperty('GOOGLE_REFRESH_TOKEN')
const TOKEN_PATH = 'resources/'
const TOKEN_FILE = 'token.json'


interface GoogleAccessToken {
    access_token: string,
    expires_in: number,
    expiration: number,
    scope: string,
    token_type: string
}

export async function getGoogleAccessToken(): Promise<GoogleAccessToken> {

    let token = loadTokenFile(TOKEN_PATH + TOKEN_FILE)
    const isExpired = moment(token.expiration || 0).isBefore(moment.now())

    if (isExpired) {
        token = await refreshAccessToken()

        console.debug(`New Google token expires ${moment(token.expiration).locale('en').fromNow()}`)
        saveToken(token)
    }

    return token
}

function saveToken(token: GoogleAccessToken) {
    if (!fs.existsSync(TOKEN_PATH))
        fs.mkdirSync(TOKEN_PATH)

    fs.writeFileSync(TOKEN_PATH + TOKEN_FILE, JSON.stringify(token))
}

function loadTokenFile(path: string): GoogleAccessToken {
    try {
        const content = fs.readFileSync(path)
        const token = JSON.parse(content.toString())
        return token
    }
    catch (err) {
        console.error(`Cannot parse [${path}]. Returning blank token`);
        return { access_token: '', expiration: 0, expires_in: 0, scope: '', token_type: '' }
    }
}

async function refreshAccessToken() {
    console.debug(`Refreshing Google Token`)

    const res = await axios.post(GOOGLE_TOKEN_API, {
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        refresh_token: GOOGLE_REFRESH_TOKEN,
        grant_type: 'refresh_token'
    }, {
        transformRequest: getQueryString
    })

    const token = res.data;
    token.expiration = moment.now() + token.expires_in * 1000
    return token
}

function getQueryString(data = {}): string {
    return Object.entries(data).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`).join('&');
}
