import { login } from '$lib/appwrite.server';
import type { Actions } from '../$types';

import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getFormData } from '../../utils/form';

export const load: PageServerLoad = async ({ parent }) => {
	const { account } = await parent();

	if (account) throw redirect(303, '/');
};

export const actions: Actions = {
	login: async ({ request, cookies }) => {
		const formData = await getFormData(request);

		try {
			const res = await login(formData, cookies);
			return { success: res.isLoggedIn, formEntries: formData };
		} catch (e) {
			return { success: false, formEntries: formData };
		}
	},
	togglePassword: async ({ request }) => {
		const formData = await getFormData(request);

		formData.showPassword = formData.showPassword === 'true' ? 'false' : 'true';

		return { formEntries: formData };
	}
};
