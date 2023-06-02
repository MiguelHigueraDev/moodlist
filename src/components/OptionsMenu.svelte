<script>
    //@ts-nocheck
    import { selectedTracks, selectedArtists, token, tokenExpired, recommendations } from "../stores";

    let isVisible = false

    let energy = 5
    let valence = 5
    let popularity = 50
    let danceability = 5

    let useEnergy = false
    let useValence = false
    let usePopularity = false
    let useDanceability = false

    const removeArtist = (uri) => {
        const index = $selectedArtists.findIndex(item => item.uri == uri)
        $selectedArtists.splice(index, 1)
        $selectedArtists = $selectedArtists
    }

    const removeTrack = (uri) => {
        const index = $selectedTracks.findIndex(item => item.uri == uri)
        $selectedTracks.splice(index, 1)
        $selectedTracks = $selectedTracks
    }

    const toggleMenu = () => {
        isVisible = !isVisible
    }

    async function getRecommendations() {
        // First convert all parameters so they are valid
        const en = convertNumbers(energy)
        const va = convertNumbers(valence)
        const da = convertNumbers(danceability)

        // Convert all artists and tracks to a valid string
        let tracks = ""
        for (const tr of $selectedTracks) {
            tracks += tr.uri + ","
        }

        let artists = ""
        for (const ar of $selectedArtists) {
            artists += ar.uri + ","
        }

        // Create search string
        const accessToken = $token
        const url = new URL(`https://api.spotify.com/v1/recommendations?`)
        const params = new URLSearchParams({
            seed_artists: artists,
            seed_tracks: tracks,
            target_energy: en,
            target_valence: va,
            target_danceability: da,
            target_popularity: popularity
        })

        if (accessToken) {
            const res = await fetch(url + params, {
                headers: {
                    Authorization: "Bearer " + accessToken,
                },
            })

            if (res.ok) {
                const data = await res.json();
                //console.log(data.tracks)
                $recommendations = data.tracks
            } else {
                tokenExpired.set(true)
            }
        }
    }

    // Converts numbers from 1-10 to 0.1-1
    const convertNumbers = (num) => {
        return (num - 1) / 9 * 0.9 + 0.1
    }

</script>

<div class="fixed top-0 left-0 w-full h-full z-30 {isVisible ? '' : 'hidden'}" style="background-color: rgba(0, 0, 0, 0.5)"></div>

<div class="fixed top-[20px] right-[20px] bg-white p-4 rounded-sm shadow-md z-40 max-w-[300px] md:max-w-[400px] max-h-[800px] 2xl:max-h-[950px] overflow-auto {isVisible ? '' : 'hidden'}">
    <h1 class="text-center text-xl tracking-wider font-semibold ">Parámetros de la lista personalizada</h1>

    <div class="flex justify-between mt-2">
        <h2 class="font-semibold">Energía <span class="text-sm text-gray-700">{energy}/10</span></h2>
        <div>
            <label for="use-energy">Usar</label>
            <input type="checkbox" id="use-energy" bind:checked={useEnergy} />
        </div>
    </div>
    <input type="range" class="accent-purple-400 w-full" min="1" max="10" bind:value={energy} disabled={!useEnergy} />
    <p>El nivel de energía deseado de las canciones, es decir, los niveles de intensidad y actividad que se pueden percibir en la canción.</p>

    <div class="flex justify-between mt-2">
        <h2 class="font-semibold">Positividad <span class="text-sm text-gray-700">{valence}/10</span></h2>
        <div>
            <label for="use-valence">Usar</label>
            <input type="checkbox" id="use-valence" bind:checked={useValence} />
        </div>
    </div>
    <input type="range" class="accent-green-400 w-full" min="1" max="10" bind:value={valence} disabled={!useValence} />
    <p>El nivel de positividad deseado de las canciones. Un nivel alto entregará canciones que muestran emociones más positivas (alegría, euforia, etc.), y un nivel bajo emociones negativas (tristeza, ira, etc.) </p>

    <div class="flex justify-between mt-2">
        <h2 class="mt-2 font-semibold">Popularidad <span class="text-sm text-gray-700">{popularity}/100</span></h2>
        <div>
            <label for="use-popularity">Usar</label>
            <input type="checkbox" id="use-popularity" bind:checked={usePopularity} />
        </div>
    </div>
    <input type="range" class="accent-yellow-400 w-full" min="10" max="100" bind:value={popularity} disabled={!usePopularity} />
    <p>El nivel de popularidad deseado de las canciones, es decir, que tanto se escuchan. <span class="font-semibold text-sm">Ten en cuenta que valores muy bajos de esta opción pueden no entregar ningún resultado.</span></p>

    <div class="flex justify-between mt-2">
        <h2 class="mt-2 font-semibold">Bailabilidad <span class="text-sm text-gray-700">{danceability}/10</span></h2>
        <div>
            <label for="use-danceability">Usar</label>
            <input type="checkbox" id="use-danceability" bind:checked={useDanceability} />
        </div>
    </div>
    <input type="range" class="accent-pink-400 w-full" min="1" max="10" bind:value={danceability} disabled={!useDanceability} />
    <p>Que tan bailables serán las canciones seleccionadas.</p>


    {#if $selectedArtists.length > 0}
        <h1 class="text-center text-xl tracking-wider font-semibold mt-5 mb-3">Artistas seleccionados</h1>
        <ul>
            {#each $selectedArtists as artist}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div class="flex flex-row gap-3 items-center mt-2 hover:bg-red-400 rounded hover:cursor-pointer" on:click={removeArtist(artist.uri)}>
                    <img class="w-14 h-14 object-contain" src={artist.art} alt={artist.name} />
                    <li>{artist.name}</li>
                </div>
            {/each}
        </ul>
    {/if}

    {#if $selectedTracks.length > 0}
        <h1 class="text-center text-xl tracking-wider font-semibold mt-5 mb-3">Canciones seleccionadas</h1>
        <ul>
            {#each $selectedTracks as track}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div class="flex flex-row gap-3 items-center mt-2 hover:bg-red-400 rounded hover:cursor-pointer" on:click={removeTrack(track.uri)}>
                    <img class="w-14 h-14 object-contain" src={track.art} alt={track.name} />
                    <li>{track.artistName} - {track.name}</li>
                </div>
            {/each}
        </ul>
    {/if}

    {#if $selectedTracks.length > 0 || $selectedArtists.length > 0}
        <button class="mt-5 w-full bg-slate-700 hover:bg-slate-600 rounded p-3 text-white tracking-widest uppercase font-semibold" on:click={getRecommendations}>Generar lista de canciones</button>
    {:else}
        <button class="mt-5 w-full bg-red-700 rounded p-3 text-white tracking-widest uppercase font-semibold cursor-not-allowed">Agrega elementos para generar</button>
    {/if}
    
</div>

<button class="fixed bottom-[20px] right-[20px] bg-white p-4 rounded-sm shadow-md z-50 max-w-[300px] md:max-w-[400px]" on:click={toggleMenu}>
    Mostrar / ocultar menú
</button>

