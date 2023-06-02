<script>
	//@ts-nocheck
	import Login from '../components/Login.svelte';
	import Header from '../components/Header.svelte';
	import List from '../components/List.svelte';
	import PeriodSelector from '../components/PeriodSelector.svelte';
  import OptionsMenu from '../components/OptionsMenu.svelte';
  import Recommendations from '../components/Recommendations.svelte';
  import { timeRange, token, tokenExpired } from "../stores.js";


	const artistMap = (item) => {
    item.uri = item.uri.replace(/^spotify:artist:/, '') + ":ar";
		return {
			name: item.name,
			art: item.images[1].url,
			info: 'Genres: ',
			link: item.external_urls.spotify,
      uri: item.uri,
		};
	};

	const tracksMap = (item) => {
    item.uri = item.uri.replace(/^spotify:track:/, '') + ":tr";
		return {
			name: item.name,
			artist_name: item.artists[0].name,
			art: item.album.images[1].url,
			info: `Artist: ${item.artists[0].name}\nAlbum: ${item.album.name}`,
			link: item.external_urls.spotify,
			audio: item.preview_url,
      uri: item.uri,
		};
	};
</script>

<main>
	<Header />
	<Login />
  {#key $timeRange}
    {#if $token}
      <div class="mt-10 ml-10">
        <h1 class="text-left text-white font-black text-2xl sm:text-4xl md:text-5xl">
          Selecciona un máximo de 5 elementos (canciones y/o artistas)
        </h1>
      </div>
      <PeriodSelector text={'Tus 15 canciones más escuchadas'} />
      <List collectionType="tracks" collectionMap={tracksMap} />
      <PeriodSelector text={'Tus 15 artistas más escuchados'} />
      <List collectionType="artists" collectionMap={artistMap} />
      <OptionsMenu />
      <Recommendations />
    {:else}
      <h1 class="text-xl text-red-400 text-center">Error. Por favor recarga la página e inicia sesión nuevamente.</h1>
    {/if}
  {/key}

</main>
