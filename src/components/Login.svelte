<script>
    //@ts-nocheck
    import Typewriter from 'svelte-typewriter'
    import {token, tokenExpired, appUrl} from "../stores.js";

    const clientId = "642257438a7f44b0a61e7b1a9016ca9c";

    function generateRandomString(length) {
        let text = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    const url = new URL("https://accounts.spotify.com/authorize?");
    const scope = "user-read-private user-read-email user-top-read user-library-modify";
    const state = generateRandomString(16);
    let rememberMe = true;

    $: params = new URLSearchParams({
    response_type: "token",
    show_dialog: !rememberMe,
    client_id: clientId,
    scope,
    redirect_uri: $appUrl,
    state
    });
    $: loginLink = url + params;
</script>

{#if !$token}
<section class="relative w-full h-screen mx-auto">
    <div class="paddingX absolute inset-0 max-w-7xl mx-auto flex justify-center items-center">
        <div class="flex justify-center align-bottom flex-col gap-4">
            <h1 class="font-black text-white lg:text-[80px] sm:text-[60px] xs:text-[50px] text-[40px] lg:leading-[98px] sm:text-center mt-2">Obtén recomendaciones basadas en tus gustos</h1>
            <h2 class="font-black text-center text-white lg:text-[60px] sm:text-[45px] xs:text-[35px] text-[30px] lg:leading-[98px] mt-2">De acuerdo a 
                <Typewriter mode={"loopRandom"} interval={100} unwriteInterval={50}>
                <span class="green-text-gradient text-center">su positividad</span>
                <span class="green-text-gradient text-center">su nivel de energía</span>
                <span class="green-text-gradient text-center">su tonalidad</span>
                <span class="green-text-gradient text-center">si son bailables</span>
                <span class="green-text-gradient text-center">si son instrumentales</span>
                <span class="green-text-gradient text-center">su popularidad</span>
                <span class="green-text-gradient text-center">si son acústicas</span>
                <span class="green-text-gradient text-center">su tempo</span>
                </Typewriter>
            </h2>
            <div id="login" class="mt-6">
                <a class="flex items-center justify-center bg-green-500 hover:bg-green-700 text-white font-bold text-xl py-2 px-4 rounded-full mx-auto w-[300px] h-[100px]" href={loginLink}>Inicia sesión con Spotify</a>
                <br />
                <div id="checkbox-container" class="text-center rounded-md">
                    <label id="checkbox-text" for="remember-me" class="text-white ml-2">Recúerdame</label>
                    <input id="remember-me" name="remember-me" type="checkbox" bind:checked={rememberMe} />
                </div>
            </div>
        </div>
    </div>
</section>
{/if}

{#if $tokenExpired}
<section class="expired-token">
    <p>Expiró el token. Por favor cierra tu sesión y entra nuevamente.</p>
</section>
{/if}


