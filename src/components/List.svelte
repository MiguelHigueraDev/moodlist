<script>
    //@ts-nocheck
	import { afterUpdate, onMount } from "svelte";
    import { token, timeRange, tokenExpired, selectedArtists, selectedTracks } from "../stores";

    export let collectionType, collectionMap;

    // Handle list selections

    function addItem(uri, name, artist_name, art) {
        let artists = $selectedArtists;
        let tracks = $selectedTracks;
        let type = "";
            // Check if selected item is an artist or a track
            if (uri.endsWith(":ar")) type = "artist"
            if (uri.endsWith(":tr")) type = "track"
            if (type != "") {
                const finalUri = uri.slice(0, -3)
                if(type == "artist") {
                    const check = $selectedArtists.findIndex(item => item.uri == finalUri)
                    if (check != -1) {
                        $selectedArtists.splice(check, 1)
                        $selectedArtists = $selectedArtists
                    } else {
                        if(artists.length + tracks.length > 4) return alert("¡Solo puedes agregar un máximo de 5 elementos!")
                        addArtist(finalUri, name, art)
                    }
                }

                if(type == "track") {
                    const check = $selectedTracks.findIndex(item => item.uri == finalUri)
                    if (check != -1) {
                        $selectedTracks.splice(check, 1)
                        $selectedTracks = $selectedTracks
                    } else {
                        if(artists.length + tracks.length > 4) return alert("¡Solo puedes agregar un máximo de 5 elementos!")
                        addTrack(finalUri, name, artist_name, art)
                    }
                }
                //if (type == "artist") addArtist(finalUri, name, art)
                //if (type == "track") addTrack(finalUri, name, artist_name, art)
            }
        }

    const addArtist = (uri, name, art) => {
        $selectedArtists = [...$selectedArtists, {
            uri: uri,
            name: name,
            art: art,
        }]
    }

    const addTrack = (uri, name, artistName, art) => {
        //if($selectedTracks.some(obj => obj["uri" === uri])) return
        $selectedTracks = [...$selectedTracks, {
            uri: uri,
            name: name,
            artistName: artistName,
            art: art,
        }]
    }

    // Fetch artists or tracks
    let collection;
    async function getCollection() {
        const accessToken = $token;
        const url = new URL(`https://api.spotify.com/v1/me/top/${collectionType}?`);
        const params = new URLSearchParams({
            time_range: $timeRange,
            limit: 15,
            offset: 0,
        });

        if (accessToken) {
            const res = await fetch(url + params, {
                headers: {
                    Authorization: "Bearer " + accessToken,
                },
            });
            
            if (res.ok) {
                const data = await res.json();
                collection = data.items.map(collectionMap);
            } else {
                tokenExpired.set(true);
            }
        }
    }

    onMount(getCollection);

</script>
<div class="px-10 py-5">
    <ul class="grid gap-2 grid-cols-fluid" style="grid-auto-rows: 1fr;"> 
        {#if collection}
            {#each collection as {name, art, artist_name, info, link, uri}, i}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <li on:click={addItem(uri, name, artist_name, art)}>
                <div class="bg-slate-700 flex flex-col items-center rounded p-6 m-4 h-[230px] hover:bg-slate-600 hover:cursor-pointer">
                    <img src={art} alt={name} class="w-[150px] h-[150px] object-cover" />
                    {#if artist_name != undefined && artist_name != null}
                        <p class="text-white text-xs text-center mt-2">{artist_name} - {name}</p>
                    {:else}
                        <p class="text-white text-xs text-center mt-2">{name}</p>
                    {/if}
                </div>
            </li>
            {/each}
        {/if}
    </ul>
</div>
