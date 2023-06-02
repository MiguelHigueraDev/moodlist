
<script>
    import { timeRange, collectionSize } from "../stores"
    export let firstText = ""
    export let lastText = ""
    
</script>

<div class="px-14 py-4 md:p-4 md:ml-10 flex flex-col mx-auto md:mx-0 lg:flex-row gap-3">
    <h1 class="text-left text-white font-black text-xl sm:text-2xl md:text-4xl">{firstText}</h1>
    <select bind:value={$collectionSize} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mx-1 md:mx-4">
        <option value={15}>15</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
    </select>
    <h1 class="text-white font-black text-xl sm:text-2xl md:text-4xl">{lastText}</h1>
    <select bind:value={$timeRange} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mx-1 md:mx-4">
        <option value="short_term">este mes</option>
        <option value="medium_term">en los últimos 6 meses</option>
        <option value="long_term">desde siempre</option>
    </select>
</div>