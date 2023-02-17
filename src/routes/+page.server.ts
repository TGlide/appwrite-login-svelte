import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const { account } = await parent();

	if (!account) throw redirect(303, '/login');
	throw redirect(303, '/dashboard');
};
