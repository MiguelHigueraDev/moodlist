<script>
    //@ts-nocheck
	import { afterUpdate, onMount } from "svelte"
    import { token, timeRange, tokenExpired, selectedArtists, selectedTracks, collectionSize } from "../stores"
    import { toast } from '@zerodevx/svelte-toast'
    import { fade } from 'svelte/transition'
    import open from '$lib/assets/open-external.svg'

    export let collectionType, collectionMap;

    let tiles = []
    let mobileTiles = []

    let screenWidth

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
                        if(screenWidth > 568) switchColor(finalUri, false)
                        if(screenWidth < 569) switchMobileColor(finalUri, false)
                    } else {
                        if(artists.length + tracks.length > 4) return toast.push('¡Sólo puedes agregar un máximo de 5 elementos!')
                        addArtist(finalUri, name, art)
                        if(screenWidth > 568) switchColor(finalUri, true)
                        if(screenWidth < 569) switchMobileColor(finalUri, true)
                    }
                }

                if(type == "track") {
                    const check = $selectedTracks.findIndex(item => item.uri == finalUri)
                    if (check != -1) {
                        $selectedTracks.splice(check, 1)
                        $selectedTracks = $selectedTracks
                        if(screenWidth > 568) switchColor(finalUri, false)
                        if(screenWidth < 569) switchMobileColor(finalUri, false)
                    } else {
                        if(artists.length + tracks.length > 4) return toast.push('¡Sólo puedes agregar un máximo de 5 elementos!')
                        addTrack(finalUri, name, artist_name, art)
                        if(screenWidth > 568) switchColor(finalUri, true)
                        if(screenWidth < 569) switchMobileColor(finalUri, true)
                    }
                }
            }
        }

    const switchColor = (uri, enable) => {
        if(enable) {
            tiles[uri].classList.add("bg-emerald-600", "hover:bg-red-400")
            tiles[uri].classList.remove("bg-slate-700", "hover:bg-slate-600")
        } else {
            tiles[uri].classList.add("bg-slate-700", "hover:bg-slate-600")
            tiles[uri].classList.remove("bg-emerald-600", "hover:bg-red-400")
        }
    }

    const switchMobileColor = (uri, enable) => {
        if(enable) {
            mobileTiles[uri].classList.add("bg-emerald-600", "hover:bg-red-400")
            mobileTiles[uri].classList.remove("bg-slate-700", "hover:bg-slate-600")
        } else {
            mobileTiles[uri].classList.add("bg-slate-700", "hover:bg-slate-600")
            mobileTiles[uri].classList.remove("bg-emerald-600", "hover:bg-red-400")
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
            limit: $collectionSize,
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

<svelte:window bind:innerWidth={screenWidth} />

<div class="px-10 py-5">
    {#if screenWidth > 568}
        <ul class="grid gap-2 grid-cols-fluid" style="grid-auto-rows: 1fr;">
            {#if collection}
                {#each collection as {name, art, artist_name, info, link, uri}, i}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <li on:click={addItem(uri, name, artist_name, art)} transition:fade>
                    <div class="flex flex-col items-center rounded p-6 m-4 h-[280px] hover:cursor-pointer bg-slate-700 hover:bg-slate-600" bind:this={tiles[uri.slice(0, -3)]} id={uri.slice(0, -3)}>
                        <img src={art} alt={name} class="w-[150px] h-[150px] object-cover" />
                        {#if artist_name != undefined && artist_name != null}
                            <div class="flex flex-col">
                                <p class="text-gray-300 font-semibold text-xs text-center mt-2">{artist_name}</p>
                                <p class="text-white font-semibold text-sm text-center mt-2">{name}</p>
                                <a href={link} target="_blank" class="mx-auto mt-1"><img src={open} width="20px" height="20px"  alt="Abrir en otra ventana" /></a>
                            </div>
                            
                        {:else}
                            <p class="text-white font-semibold text-sm text-center mt-2">{name}</p>
                            <a href={link} target="_blank" class="mx-auto mt-1"><img src={open} width="20px" height="20px"  alt="Abrir en otra ventana" /></a>
                        {/if}
                    </div>
                </li>
                {/each}
            {/if}
        </ul>
    {:else}
        <ul class="flex flex-col gap-10">
            {#if collection}
                {#each collection as {name, art, artist_name, info, link, uri}, i}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <li on:click={addItem(uri, name, artist_name, art)} transition:fade>
                    <div class="flex flex-row gap-2 rounded-lg bg-slate-700 hover:bg-slate-600 hover:cursor-pointer p-4" bind:this={mobileTiles[uri.slice(0, -3)]} id={uri.slice(0, -3)}>
                        <img src={art} alt={name} class="w-[50px]"/>
                        {#if artist_name != undefined && artist_name != null}
                        <div class="flex flex-col w-full">
                            <p class="text-gray-300 font-semibold text-xs text-center">{artist_name}</p>
                            <p class="text-white font-semibold text-sm text-center mt-2">{name}</p>
                        </div>
                        <a href={link} target="_blank" class="float-right relative top-3 right-2 z-30"><img src={open} width="30px" height="30px" alt="Abrir en otra ventana" /></a>
                        {:else}
                        <div class="flex flex-col w-full">
                            <p class="text-white font-semibold text-sm text-center mt-2">{name}</p>
                        </div>
                        <a href={link} target="_blank" class="float-right relative top-3 right-2 z-30"><img src={open} width="30px" height="30px" alt="Abrir en otra ventana" /></a>
                        {/if}
                    </div>
                </li>
                {/each}
            {/if}
        </ul>
    {/if}
    
</div>
