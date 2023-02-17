import { getAccount } from '$lib/appwrite.server';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, route }) => {
	const account = await getAccount(cookies);

	return {
		account
	};
};
