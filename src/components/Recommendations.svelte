<script>
    //@ts-nocheck
    import { token, tokenExpired, recommendations } from '../stores'

    let isVisible = false

    let audioPlayers = []

    const toggleMenu = () => {
        isVisible = !isVisible
    }

    const playAudio = (index) => {
        for (const player of audioPlayers) {
            player.pause();
        }
        audioPlayers[index].play();
    }

    async function saveTrack(id) {
        const accessToken = $token
        const url = new URL(`https://api.spotify.com/v1/me/tracks?`)
        const params = new URLSearchParams({
            ids: id,
        })

        if (accessToken) {
            const res = await fetch(url + params, {
                headers: {
                    Authorization: "Bearer " + accessToken,
                },
            })

            if (res.ok) {
                const data = await res.json();
            } else {
                tokenExpired.set(true)
            }
        }
    }


</script>

{#if $recommendations != "" && $recommendations != null}
<div class="fixed top-0 left-0 w-full h-full z-30 {isVisible ? '' : 'hidden'}" style="background-color: rgba(0, 0, 0, 0.5)"></div>

<div class="fixed top-[20px] left-[20px] bg-white p-4 rounded-sm shadow-md z-40 max-w-[400px] md:max-w-[400px] max-h-[800px] 2xl:max-h-[950px] overflow-auto {isVisible ? '' : 'hidden'}">
    <h1 class="text-center text-xl tracking-wider font-semibold mb-5">Recomendaciones para ti</h1>

    {#each $recommendations as rec, i}
        <div class="flex flex-row gap-3 items-center mt-2 rounded">
            <div class="flex justify-between mt-2"></div>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <img on:click={saveTrack(rec.uri.replace(/^spotify:track:/, ''))} class="w-14 h-14 object-contain" src={rec.album.images[1].url} alt={rec.name} />
            <p>{rec.artists[0].name} - {rec.name}</p>
            <button on:click={() => playAudio(i)}><svg fill="#000000" height="20px" width="20px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                viewBox="0 0 60 60" xml:space="preserve">
           <g> <path d="M45.563,29.174l-22-15c-0.307-0.208-0.703-0.231-1.031-0.058C22.205,14.289,22,14.629,22,15v30
                   c0,0.371,0.205,0.711,0.533,0.884C22.679,45.962,22.84,46,23,46c0.197,0,0.394-0.059,0.563-0.174l22-15
                   C45.836,30.64,46,30.331,46,30S45.836,29.36,45.563,29.174z M24,43.107V16.893L43.225,30L24,43.107z"/><path d="M30,0C13.458,0,0,13.458,0,30s13.458,30,30,30s30-13.458,30-30S46.542,0,30,0z M30,58C14.561,58,2,45.439,2,30
                   S14.561,2,30,2s28,12.561,28,28S45.439,58,30,58z"/></g></svg></button>
            <audio bind:this={audioPlayers[i]} src={rec.preview_url}></audio>
        </div>
    {/each}

    
</div>

<button class="fixed bottom-[20px] left-[20px] p-4 rounded-sm shadow-md z-50 max-w-[300px] md:max-w-[400px] bg-green-400" on:click={toggleMenu}>
    Recomendaciones
</button>
{/if}
