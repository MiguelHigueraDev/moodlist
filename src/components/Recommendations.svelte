<script>
    //@ts-nocheck
    import { recommendations, showOptions, showRecommendations } from '../stores'
    import { toast } from '@zerodevx/svelte-toast'
    import { fade } from 'svelte/transition'
    import AudioPlayer from './AudioPlayer.svelte';

    let songName = ""
    let artistName = ""
    let songUrl = ""
    let songUri = ""
    let songTime = 0
    let pausedSong = true

    let screenWidth
    let screenHeight

    let audioPlayers = []

    const toggleMenu = () => {
        // Hide the other menu if the user is browsing in a small width device.
        if (screenWidth < 900) $showOptions = false
        $showRecommendations = !$showRecommendations
    }

    const hideAllMenus = () => {
        $showOptions = false
        $showRecommendations = false
    }

    const playAudio = (song) => {
        songName = song.name
        artistName = song.artists[0].name
        songUrl = song.preview_url
        // Remove spotify:track: from the URI so it works
        songUri = song.uri.replace(/^spotify:track:/, "")
        songTime = 0
        pausedSong = false
    }

    const showError = () => {
        toast.push('La vista previa está desactivada para esta canción.')
    }
</script>

<svelte:window bind:innerWidth={screenWidth} bind:innerHeight={screenHeight} />

{#if $recommendations != "" && $recommendations != null}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="fixed top-0 left-0 w-full h-full z-30 {$showRecommendations ? '' : 'hidden'}" on:click={hideAllMenus} style="background-color: rgba(0, 0, 0, 0.5)"></div>

<div style="width: {screenWidth-35}px; height: {screenHeight-290}px;" class="fixed top-[20px] left-[20px] bg-white p-4 rounded-lg shadow-md z-40 max-w-[400px] overflow-auto {$showRecommendations ? '' : 'hidden'}">
    <div class="overflow-hidden">
        <h1 class="text-center text-xl tracking-wider font-semibold mb-3">{$recommendations.length} recomendaciones encontradas</h1>
    </div>

    {#key $recommendations}
        {#each $recommendations as rec, i}
        <div class="flex flex-row gap-3 items-center mt-3 rounded" transition:fade>
            <img class="w-14 h-14 object-contain" src={rec.album.images[1].url} alt={rec.name} />
            <div class="flex flex-col w-[250px]">
                <p class="text-gray-600 font-semibold text-sm">{rec.artists[0].name}</p>
                <a href={rec.external_urls.spotify} target="_blank" ><p class="text-black font-semibold">{rec.name}</p></a>
            </div>
            
            {#if rec.preview_url != null}
                <button on:click={() => playAudio(rec)}><svg fill="#000000" height="25px" width="25px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 60 60" xml:space="preserve"><g> <path d="M45.563,29.174l-22-15c-0.307-0.208-0.703-0.231-1.031-0.058C22.205,14.289,22,14.629,22,15v30 c0,0.371,0.205,0.711,0.533,0.884C22.679,45.962,22.84,46,23,46c0.197,0,0.394-0.059,0.563-0.174l22-15 C45.836,30.64,46,30.331,46,30S45.836,29.36,45.563,29.174z M24,43.107V16.893L43.225,30L24,43.107z"/><path d="M30,0C13.458,0,0,13.458,0,30s13.458,30,30,30s30-13.458,30-30S46.542,0,30,0z M30,58C14.561,58,2,45.439,2,30 S14.561,2,30,2s28,12.561,28,28S45.439,58,30,58z"/></g></svg></button>
            {:else}
                <button on:click={() => showError()}><svg width="27px" height="27px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 16H12.01M12 8V12M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="#880808" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
            {/if}
            <audio bind:this={audioPlayers[i]} src={rec.preview_url}></audio>
        </div>
        {/each}
    {/key}
    

    
</div>

<AudioPlayer isVisible={$showRecommendations} songName={songName} artistName={artistName} songUrl={songUrl} songUri={songUri} time={songTime} paused={pausedSong} />

<button class="fixed bottom-[20px] left-[20px] p-4 rounded-lg shadow-md z-50 max-w-[300px] md:max-w-[400px] bg-green-400" on:click={toggleMenu}>
    🎵
</button>
{/if}
