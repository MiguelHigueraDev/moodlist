<script>
    import "../app.css";
    import { SvelteToast } from '@zerodevx/svelte-toast'
</script>

<div>
    <slot />
    <SvelteToast />
</div>


