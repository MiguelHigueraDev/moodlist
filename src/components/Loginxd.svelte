<script>
	//@ts-nocheck
	import { token, tokenExpired, appUrl } from '../stores.js';

	const clientId = '642257438a7f44b0a61e7b1a9016ca9c';

	function generateRandomString(length) {
		let text = '';
		const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

		for (let i = 0; i < length; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	}

	const url = new URL('https://accounts.spotify.com/authorize?');
	const scope = 'user-read-private user-read-email user-top-read';
	const state = generateRandomString(16);
	let rememberMe = true;

	$: params = new URLSearchParams({
		response_type: 'token',
		show_dialog: !rememberMe,
		clientId,
		scope,
		redirect_uri: $appUrl,
		state
	});
	$: loginLink = url + params;
</script>

{#if !$token}
	<div id="login">
		<a
			class="flex items-center justify-center bg-green-500 hover:bg-green-700 text-white font-bold text-xl py-2 px-4 rounded-full mx-auto w-[300px] h-[100px] mt-6"
			href={loginLink}>Inicia sesión con Spotify</a
		>
		<br />
		<div id="checkbox-container">
			<label id="checkbox-text" for="remember-me">Remember me?</label>
			<input id="checkbox-box" name="remember-me" type="checkbox" bind:checked={rememberMe} />
		</div>
	</div>
{/if}

{#if $tokenExpired}
	<section class="expired-token">
		<h1 class="text-xl text-red-400 text-center">
			Error. Por favor recarga la página e inicia sesión nuevamente.
		</h1>
	</section>
{/if}
