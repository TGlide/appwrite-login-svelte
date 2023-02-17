import {
	APPWRITE_ENDPOINT,
	APPWRITE_HOSTNAME,
	APPWRITE_PROJECT_ID,
	APP_HOSTNAME
} from '$env/static/private';
import type { Cookies } from '@sveltejs/kit';
import { Account, Client, Databases } from 'appwrite';
import { z } from 'zod';
import { parseSerializedCookie } from '../utils/cookie';

const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID);

export const account = new Account(client);
const databases = new Databases(client);

export const AppwriteService = {};

function getHash(cookies: Cookies) {
	const sessionNames = [
		'a_session_' + APPWRITE_PROJECT_ID.toLowerCase(),
		'a_session_' + APPWRITE_PROJECT_ID.toLowerCase() + '_legacy'
	] as const;

	return cookies.get(sessionNames[0]) ?? cookies.get(sessionNames[1]) ?? '';
}

export function setSession(cookies: Cookies) {
	const authCookies: { [key: string]: string } = {};
	authCookies['a_session_' + APPWRITE_PROJECT_ID] = getHash(cookies);
	account.client.headers['X-Fallback-Cookies'] = JSON.stringify(authCookies);

	return authCookies;
}

export async function getAccount(cookies: Cookies) {
	setSession(cookies);

	try {
		const result = await account.get();
		return result;
	} catch (err) {
		return null;
	}
}

export async function getDb(dbId: string, collectionId: string) {
	return await databases.listDocuments(dbId, collectionId);
}

export async function deleteSession(session_id?: string) {
	return await account.deleteSession(session_id ? session_id : 'current');
}

const loginSchema = z.object({
	email: z.string(),
	password: z.string()
});

export async function login(input: unknown, cookies: Cookies) {
	const { email, password } = loginSchema.parse(input);

	const request = await fetch(APPWRITE_ENDPOINT + '/account/sessions/email', {
		method: 'POST',
		headers: {
			'x-appwrite-project': APPWRITE_PROJECT_ID,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ email, password })
	});

	const response = await request.json();
	const newHostname = APP_HOSTNAME == 'localhost' ? APP_HOSTNAME : '.' + APP_HOSTNAME;

	const cookie = (request.headers.get('set-cookie') ?? '')
		.split('.' + APPWRITE_HOSTNAME)
		.join(newHostname);
	const { name, value, options } = parseSerializedCookie(cookie);
	cookies.set(name, value, options);

	return { response, isLoggedIn: request.status == 201 ? true : false };
}
