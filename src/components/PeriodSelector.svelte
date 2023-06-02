
<script>
    import { timeRange } from "../stores";
    export let text = "";
    
</script>

<div class="mt-10 ml-10 flex gap-3">
    <h1 class="text-left text-white font-black text-xl sm:text-2xl md:text-4xl">{text}</h1>
    <select bind:value={$timeRange} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mx-10 md:mx-4">
        <option value="short_term">este mes</option>
        <option value="medium_term">en los últimos 6 meses</option>
        <option value="long_term">desde siempre</option>
    </select>
</div>