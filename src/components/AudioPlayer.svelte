<script>
 export let isVisible = false
 export let songName = ""
 export let artistName = ""
</script>

<div class="fixed top-[750px] md:top-[750px] 2xl:top-[900px] left-[20px] bg-white p-4 rounded-sm shadow-md z-50 max-w-[350px] md:max-w-[450px] overflow-auto {isVisible ? '' : 'hidden'}">
    {#if songName != ""}
        <h2>Ahora está sonando</h2>
        <h2><span class="font-semibold">{artistName}</span> - {songName}</h2>
    {:else}
        <h1>No hay nada sonando.</h1>
    {/if}

</div>