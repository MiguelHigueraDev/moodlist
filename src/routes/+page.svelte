<script>
	//@ts-nocheck
	import Login from '../components/Login.svelte';
	import Header from '../components/Header.svelte';
	import List from '../components/List.svelte';
	import PeriodSelector from '../components/PeriodSelector.svelte';
	import OptionsMenu from '../components/OptionsMenu.svelte';
	import Recommendations from '../components/Recommendations.svelte';
	import { collectionSize, timeRange, token, tokenExpired } from '../stores.js';

	const artistMap = (item) => {
		item.uri = item.uri.replace(/^spotify:artist:/, '') + ':ar';
		return {
			name: item.name,
			art: item.images[1].url,
			info: 'Genres: ',
			link: item.external_urls.spotify,
			uri: item.uri
		};
	};

	const tracksMap = (item) => {
		item.uri = item.uri.replace(/^spotify:track:/, '') + ':tr';
		return {
			name: item.name,
			artist_name: item.artists[0].name,
			art: item.album.images[1].url,
			info: `Artist: ${item.artists[0].name}\nAlbum: ${item.album.name}`,
			link: item.external_urls.spotify,
			audio: item.preview_url,
			uri: item.uri
		};
	};
</script>

<main>
	<Login />
	{#key $timeRange}
		{#key $collectionSize}
			{#if $token}
			<Header />
			<div class="mt-4 px-10">
				<h1 class="text-left p-4 text-white font-black text-2xl sm:text-4xl md:text-5xl">
					Selecciona un máximo de 5 elementos
				</h1>
			</div>
			<PeriodSelector firstText={'Tus '} lastText=" canciones más escuchadas" />
			<List collectionType="tracks" collectionMap={tracksMap} />
			<PeriodSelector firstText={'Tus '} lastText=" artistas más escuchados" />
			<List collectionType="artists" collectionMap={artistMap} />
			<OptionsMenu />
			<Recommendations />
			<p class="text-white mt-2 mb-[100px] xl:mb-10 px-10 text-center text-md" id="disclaimer">Toda la información de canciones e imágenes es otorgada por Spotify y estas son propiedad de sus respectivos dueños.</p>
			<p class="text-white mt-2 mb-[100px] xl:mb-10 px-10 text-center text-md" id="disclaimer">Este sitio no está afiliado de ninguna forma con Spotify.</p>
		{:else}
			<!--<h1 class="text-xl text-red-400 text-center">
				Error. Por favor recarga la página e inicia sesión nuevamente.
			</h1>-->
		{/if}
		{/key}
	{/key}
</main>
