<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<form method="POST" use:enhance>
	<h1 class="heading-level-3">Welcome {data?.account?.name}</h1>
	<button class="button u-margin-block-start-16" type="submit"> logout </button>
</form>
