import { deleteSession } from '$lib/appwrite.server';
import { redirect } from '@sveltejs/kit';
import type { Actions } from '../$types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const { account } = await parent();

	if (!account) throw redirect(303, '/');
};

export const actions: Actions = {
	default: async () => {
		await deleteSession('current');
	}
};
