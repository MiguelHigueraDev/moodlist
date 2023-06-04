<script>
    //@ts-nocheck
    import { selectedTracks, selectedArtists, token, tokenExpired, recommendations, showOptions, showRecommendations } from "../stores";

    let energy = 5
    let valence = 5
    let popularity = 50
    let danceability = 5

    let useEnergy = false
    let useValence = false
    let usePopularity = false
    let useDanceability = false

    let screenWidth
    let screenHeight

    const removeArtist = (uri) => {
        const index = $selectedArtists.findIndex(item => item.uri == uri)
        $selectedArtists.splice(index, 1)
        $selectedArtists = $selectedArtists
        removeClasses(uri)
        
    }

    const removeTrack = (uri) => {
        const index = $selectedTracks.findIndex(item => item.uri == uri)
        $selectedTracks.splice(index, 1)
        $selectedTracks = $selectedTracks
        removeClasses(uri)
    }

    const toggleMenu = () => {
        // Hide the other menu if the user is browsing in a small width device.
        if (screenWidth < 900) $showRecommendations = false
        $showOptions = !$showOptions
    }

    const hideAllMenus = () => {
        $showOptions = false
        $showRecommendations = false
    }

    const removeClasses = (uri) => {
        const element = document.getElementById(uri)
        if (element != null) {
            element.classList.add("bg-slate-700", "hover:bg-slate-600")
            element.classList.remove("bg-emerald-600", "hover:bg-red-400")
        }
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
        let params = new URLSearchParams({
            seed_artists: artists,
            seed_tracks: tracks,
        })

        // Add search parameters if they are not disabled
        if(useEnergy) params.append("target_energy", en)
        if(useValence) params.append("target_valence", va)
        if(useDanceability) params.append("target_danceability", da)
        if(usePopularity) params.append("target_popularity", popularity)

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
                // If the device is small hide the parameters panel.
                if (screenWidth < 900) $showOptions = false
                $showRecommendations = true
            } else {
                tokenExpired.set(true)
            }
        }
    }

    // Converts numbers from 1-10 to 0.1-1
    const convertNumbers = (num) => {
        return (num - 1) / 9 * 0.9 + 0.1
    }

    // Convert all numeric values to words.
    function mapDanceability(da) {
        if(da == 1) return "extremadamente rígido, cero coordinación, arítmico"
        if(da > 1 && da < 4) return "rígido, robótico"
        if(da == 4) return "tieso, torpe, poco coordinado"
        if(da == 5) return "quizás bailable"
        if(da > 5 && da < 8) return "rítmico, coordinado"
        if(da == 8) return "melódico, fluido, rítmico"
        if(da == 9) return "pegajoso, movido, bailable"
        if(da == 10) return "muy movido, energético, contagioso, de discoteca"
        if(da < 0 || da > 10) return "error... esto no debería pasar."
    }

    function mapEnergy(en) {
        if(en == 1) return "letárgico, sin vida, drenado"
        if(en > 1 && en < 4) return "cansado, poco entusiasmante"
        if(en == 4) return "poco inspirador, pasivo"
        if(en == 5) return "meh"
        if(en > 5 && en < 8) return "vibrante, entusiasmante"
        if(en == 8) return "poderoso, dinámico"
        if(en == 9) return "energético, vivo, intenso"
        if(en == 10) return "electrizante, envigorante, frenético, de alto octanaje"
        if(en < 0 || en > 10) return "error... esto no debería pasar."
    }

    function mapPopularity(po) {
        if(po == 10) return "probablemente menos de 5000 reproducciones en el mundo, o canción desconocida de un artista popular"
        if(po > 10 && po < 40) return "probablemente seas el único que escucha esto en tu ciudad"
        if(po >= 40 && po < 50) return "poco popular"
        if(po >= 50 && po < 60) return "término medio"
        if(po >= 60 && po < 80) return "conocido por muchos, especialmente localmente"
        if(po >= 80 && po < 90) return "popular"
        if(po >= 90 && po < 97) return "top de listas"
        if(po >= 97) return "probablemente la conoces, o algún amigo la conoce"
        if(po < 10 || po > 100) return "error... esto no debería pasar."
    }

    function mapValence(va) {
        if(va == 1) return "miserable, trágico | iracundo"
        if(va > 1 && va < 3) return "desesperado, deprimido | enojado"
        if(va == 3) return "melancólico, desolado | irritado"
        if(va == 4) return "triste, oscuro | molesto"
        if(va == 5) return "pensativo"
        if(va > 5 && va < 8) return "jovial"
        if(va == 8) return "alegre, contento"
        if(va == 9) return "feliz, animado, radiante"
        if(va == 10) return "exhuberante, eufórico, dichoso, en las nubes"
        if(va < 0 || va > 10) return "error... esto no debería pasar."
    }

</script>

<svelte:window bind:innerWidth={screenWidth} bind:innerHeight={screenHeight} />

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="fixed top-0 left-0 w-full h-full z-30 {$showOptions ? '' : 'hidden'}" on:click={hideAllMenus} style="background-color: rgba(0, 0, 0, 0.5)"></div>

<div style="width: {screenWidth-35}px; max-height: {screenHeight-120}px;" class="fixed top-[20px] right-[20px] bg-white p-4 rounded-lg shadow-md z-40 max-w-[400px] overflow-auto {$showOptions ? '' : 'hidden'}">
    <h1 class="text-center text-xl tracking-wider font-semibold ">Parámetros</h1>

    <div class="flex justify-between mt-2">
        <h2 class="font-semibold">Energía <span class="text-sm text-gray-700">{energy}/10</span></h2>
        <div>
            <label for="use-energy">Usar</label>
            <input type="checkbox" id="use-energy" bind:checked={useEnergy} />
        </div>
    </div>
    <input type="range" class="accent-purple-400 w-full" min="1" max="10" bind:value={energy} disabled={!useEnergy} />
    {#if useEnergy}
    <p class="text-sm font-bold">{mapEnergy(energy)}</p>
    {/if}


    <div class="flex justify-between mt-2">
        <h2 class="font-semibold">Positividad <span class="text-sm text-gray-700">{valence}/10</span></h2>
        <div>
            <label for="use-valence">Usar</label>
            <input type="checkbox" id="use-valence" bind:checked={useValence} />
        </div>
    </div>
    <input type="range" class="accent-green-400 w-full" min="1" max="10" bind:value={valence} disabled={!useValence} />
    {#if useValence}
    <p class="text-sm font-bold">{mapValence(valence)}</p>
    {/if}

    <div class="flex justify-between mt-2">
        <h2 class="mt-2 font-semibold">Bailabilidad <span class="text-sm text-gray-700">{danceability}/10</span></h2>
        <div>
            <label for="use-danceability">Usar</label>
            <input type="checkbox" id="use-danceability" bind:checked={useDanceability} />
        </div>
    </div>
    <input type="range" class="accent-pink-400 w-full" min="1" max="10" bind:value={danceability} disabled={!useDanceability} />
    {#if useDanceability}
    <p class="text-sm font-bold">{mapDanceability(danceability)}</p>
    {/if}

    <div class="flex justify-between mt-2">
        <h2 class="mt-2 font-semibold">Popularidad <span class="text-sm text-gray-700">{popularity}/100</span></h2>
        <div>
            <label for="use-popularity">Usar</label>
            <input type="checkbox" id="use-popularity" bind:checked={usePopularity} />
        </div>
    </div>
    <input type="range" class="accent-yellow-400 w-full" min="10" max="100" bind:value={popularity} disabled={!usePopularity} />
    {#if usePopularity}
    <p class="text-sm font-bold">{mapPopularity(popularity)}</p>
    {/if}

    {#if $selectedArtists.length > 0}
        <h1 class="text-center text-xl tracking-wider font-semibold mt-5 mb-3">Artistas seleccionados</h1>
        <ul>
            {#each $selectedArtists as artist}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div class="flex flex-row gap-3 items-center mt-2 hover:bg-red-400 rounded hover:cursor-pointer" on:click={removeArtist(artist.uri)}>
                    <img class="w-14 h-14 object-contain" src={artist.art} alt={artist.name} />
                    <li class="text-black font-semibold">{artist.name}</li>
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
                    <div class="flex flex-col w-[250px]">
                        <p class="text-gray-600 font-semibold text-sm">{track.artistName}</p>
                        <p class="text-black font-semibold">{track.name}</p>
                    </div>
                </div>
            {/each}
        </ul>
    {/if}

    {#if $selectedTracks.length > 0 || $selectedArtists.length > 0}
        <button class="mt-5 w-full bg-slate-700 hover:bg-slate-600 rounded p-3 text-white tracking-widest uppercase font-semibold" on:click={getRecommendations}>Obtener Recomendaciones</button>
    {:else}
        <button class="mt-5 w-full bg-red-700 rounded p-3 text-white tracking-widest uppercase font-semibold cursor-not-allowed">Agrega al menos 1 elemento</button>
    {/if}
    
</div>

<button class="fixed bottom-[20px] right-[20px] bg-white p-4 rounded-lg shadow-md z-50 max-w-[300px] md:max-w-[400px]" on:click={toggleMenu}>
    Menú ({$selectedTracks.length + $selectedArtists.length}/5)
</button>

