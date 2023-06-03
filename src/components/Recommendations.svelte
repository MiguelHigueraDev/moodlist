<script>
    //@ts-nocheck
    import { token, tokenExpired, recommendations } from '../stores'
    import { toast } from '@zerodevx/svelte-toast'
    import { fade } from 'svelte/transition'
    import AudioPlayer from './AudioPlayer.svelte';

    let isVisible = false
    let songName = ""
    let artistName = ""
    let songUrl = ""
    let songTime = 0
    let pausedSong = true

    let audioPlayers = []

    const toggleMenu = () => {
        isVisible = !isVisible
    }

    const playAudio = (song) => {
        songName = song.name
        artistName = song.artists[0].name
        songUrl = song.preview_url
        songTime = 0
        pausedSong = true
    }

    const showError = () => {
        toast.push('La vista previa está desactivada para esta canción.')
    }

    const toggleHeart = (element, show) => {
        const heart = element.target.querySelector('.icon')
        if (show) {
            heart.classList.add('block')
            heart.classList.remove('hidden')
        } else {
            heart.classList.add('hidden')
            heart.classList.remove('block')
        }
    }

    async function saveTrack(id) {
        const accessToken = $token
        const url = new URL(`https://api.spotify.com/v1/me/tracks?`)
        const params = new URLSearchParams({
            ids: id,
        })

        if (accessToken) {
            const res = await fetch(url + params, {
                method: "PUT",
                headers: {
                    Authorization: "Bearer " + accessToken,
                },
            })

            if (res.ok) {
                toast.push('Canción guardada en tus me gusta.')
            } else {
                toast.push('Error al guardar canción en tus me gusta. Si esto persiste por favor recarga la página.')
                tokenExpired.set(true)
            }
        }
    }


</script>

{#if $recommendations != "" && $recommendations != null}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="fixed top-0 left-0 w-full h-full z-30 {isVisible ? '' : 'hidden'}" on:click={toggleMenu} style="background-color: rgba(0, 0, 0, 0.5)"></div>

<div class="fixed top-[20px] left-[20px] bg-white p-4 rounded-sm shadow-md z-40 max-w-[350px] md:max-w-[450px] max-h-[550px] 2xl:max-h-[850px] overflow-auto {isVisible ? '' : 'hidden'}">
    <div class="overflow-hidden">
        <h1 class="text-center text-xl tracking-wider font-semibold mb-3">Recomendaciones para ti</h1>
    </div>
    {#each $recommendations as rec, i}
        <div class="flex flex-row gap-3 items-center mt-3 rounded" transition:fade>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="relative cursor-pointer" on:mouseenter={(i) => toggleHeart(i, true)} on:mouseleave={(i) => toggleHeart(i, false)} on:click={saveTrack(rec.uri.replace(/^spotify:track:/, ''))}>
                <img class="w-14 h-14 object-contain" src={rec.album.images[1].url} alt={rec.name} />
                <svg class="absolute icon hidden" transition:fade style="right:13px; top:15px;" fill="#4ade80" width="30px" height="30px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><title>Agregar a tus "Me gusta"</title><path d="M0.256 12.16q0.544 2.080 2.080 3.616l13.664 14.144 13.664-14.144q1.536-1.536 2.080-3.616t0-4.128-2.080-3.584-3.584-2.080-4.16 0-3.584 2.080l-2.336 2.816-2.336-2.816q-1.536-1.536-3.584-2.080t-4.128 0-3.616 2.080-2.080 3.584 0 4.128z"></path></svg>
            </div>
            <div class="flex flex-col w-[250px]">
                <p class="text-black font-semibold">{rec.artists[0].name}</p>
                <p class="text-gray-600 font-semibold">{rec.name}</p>
            </div>
            
            {#if rec.preview_url != null}
                <button on:click={() => playAudio(rec)}><svg fill="#000000" height="20px" width="20px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 60 60" xml:space="preserve"><g> <path d="M45.563,29.174l-22-15c-0.307-0.208-0.703-0.231-1.031-0.058C22.205,14.289,22,14.629,22,15v30 c0,0.371,0.205,0.711,0.533,0.884C22.679,45.962,22.84,46,23,46c0.197,0,0.394-0.059,0.563-0.174l22-15 C45.836,30.64,46,30.331,46,30S45.836,29.36,45.563,29.174z M24,43.107V16.893L43.225,30L24,43.107z"/><path d="M30,0C13.458,0,0,13.458,0,30s13.458,30,30,30s30-13.458,30-30S46.542,0,30,0z M30,58C14.561,58,2,45.439,2,30 S14.561,2,30,2s28,12.561,28,28S45.439,58,30,58z"/></g></svg></button>
            {:else}
                <button on:click={() => showError()}><svg width="22px" height="22px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 16H12.01M12 8V12M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="#880808" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
            {/if}
            <audio bind:this={audioPlayers[i]} src={rec.preview_url}></audio>
        </div>
    {/each}

    
</div>

<AudioPlayer isVisible={isVisible} songName={songName} artistName={artistName} songUrl={songUrl} time={songTime} />

<button class="fixed bottom-[20px] left-[20px] p-4 rounded-sm shadow-md z-50 max-w-[300px] md:max-w-[400px] bg-green-400" on:click={toggleMenu}>
    🎵
</button>
{/if}
