<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let form: ActionData;
	$: showPassword = form?.formEntries?.showPassword === 'true';
</script>

<form
	class="form u-width-full-line u-max-width-500 u-margin-inline-auto"
	method="POST"
	action="?/login"
	use:enhance={({ action, cancel }) => {
		if (action.search === '?/togglePassword') {
			form = {
				...form,
				formEntries: {
					...form?.formEntries,
					showPassword: form?.formEntries?.showPassword === 'true' ? 'false' : 'true'
				}
			};
			cancel();
		}
	}}
>
	<!-- Hidden button so when the user presses enter, this button is trigerred, instead of the showPassword one -->
	<button class="u-hide" type="submit" tabindex="-1" />
	<ul class="form-list">
		<li class="form-item">
			<label class="label" for="email">Email</label>
			<div class="input-text-wrapper">
				<input
					name="email"
					type="text"
					class="input-text"
					placeholder="john.doe@appwrite.io"
					value={form?.formEntries?.email ?? ''}
				/>
			</div>
		</li>
		<li class="form-item">
			<label class="label" for="password">Password</label>
			<div class="input-text-wrapper" style:--amount-of-buttons="1">
				<input
					name="password"
					type={showPassword ? 'text' : 'password'}
					class="input-text"
					placeholder="SuperSecretPassword"
					value={form?.formEntries?.password ?? ''}
				/>

				<input type="hidden" name="showPassword" value={!!showPassword} />
				<button
					class="show-password-button"
					aria-label="show password"
					formaction="?/togglePassword"
				>
					<span class="icon-eye" aria-hidden="true" />
				</button>
			</div>
		</li>
		<li class="form-item">
			<div class="u-flex u-main-end">
				<button class="button" type="submit"> Login </button>
			</div>
		</li>
		{#if form?.success === false}
			<li class="form-item">
				<div class="u-flex u-main-center">
					<p class="u-bold u-color-text-danger">Login failed</p>
				</div>
			</li>
		{/if}
	</ul>
</form>
