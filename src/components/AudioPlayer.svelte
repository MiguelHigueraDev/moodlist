<script>
	//@ts-nocheck
    import { token, tokenExpired } from '../stores'
	import { toast } from '@zerodevx/svelte-toast'

	export let isVisible = false;
	export let songName = '';
	export let artistName = '';
	export let songUrl = '';
	export let songUri = '';

	export let time = 0;
	let duration = 0;
	export let paused = true;
	let volume = 0.2;

	let screenWidth
    let screenHeight

	/**
	 * @param {number} time
	 */
	function format(time) {
		if (isNaN(time)) return '...';

		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);

		return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
	}

	const toggleHeart = (element, show) => {
        const blackHeart = element.target.querySelector('.blackheart')
		const greenHeart = element.target.querySelector('.greenheart')
        if (show) {
            blackHeart.classList.add('hidden')
            greenHeart.classList.remove('hidden')
			greenHeart.classList.add('block')
        } else {
            blackHeart.classList.add('block')
			blackHeart.classList.remove('hidden')
            greenHeart.classList.add('hidden')
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

<svelte:window bind:innerWidth={screenWidth} bind:innerHeight={screenHeight} />

{#if songName != ''}
<div
	style="width: {screenWidth-35}px; max-height: 170px; top: {screenHeight-250}px;"
	class="fixed left-[20px] bg-white p-4 rounded-lg shadow-md z-50 max-w-[400px] overflow-auto {isVisible
		? ''
		: 'hidden'}"
>

		<div class="player-container flex">
			<div class="player w-full" class:paused>
				<audio
					src={songUrl}
					bind:currentTime={time}
					bind:duration
					bind:paused
					bind:volume
					on:canplay={() => (paused = !paused)}
					on:canplaythrough={() => (paused = !paused)}
					on:ended={() => {
						time = 0;
					}}
				/>
				<button
					class="play"
					aria-label={paused ? 'play' : 'pause'}
					on:click={() => (paused = !paused)}
				/>
				<div class="info">
					<div>
						<h2><span class="font-semibold break-words">{artistName}</span> - {songName}</h2>
					</div>
					<div class="time">
						<span>{format(time)}</span>
						<div
							class="slider"
							on:pointerdown={(e) => {
								const div = e.currentTarget;
	
								function seek(e) {
									const { left, width } = div.getBoundingClientRect();
	
									let p = (e.clientX - left) / width;
									if (p < 0) p = 0;
									if (p > 1) p = 1;
	
									time = p * duration;
								}
	
								seek(e);
	
								window.addEventListener('pointermove', seek);
	
								window.addEventListener(
									'pointerup',
									() => {
										window.removeEventListener('pointermove', seek);
									},
									{
										once: true
									}
								);
							}}
						>
							<div class="progress" style="--progress: {time / duration}%" />
						</div>
						<span>{duration ? format(duration) : '--:--'}</span>
					</div>
				</div>
			</div>
			<div>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div class="cursor-pointer" on:mouseenter={(i) => toggleHeart(i, true)} on:mouseleave={(i) => toggleHeart(i, false)} on:click={saveTrack(songUri)}>
					<svg class="mt-3 hidden greenheart" style="right:13px; top:15px;" fill="#4ade80" width="30px" height="30px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><title>Agregar a tus "Me gusta"</title><path d="M0.256 12.16q0.544 2.080 2.080 3.616l13.664 14.144 13.664-14.144q1.536-1.536 2.080-3.616t0-4.128-2.080-3.584-3.584-2.080-4.16 0-3.584 2.080l-2.336 2.816-2.336-2.816q-1.536-1.536-3.584-2.080t-4.128 0-3.616 2.080-2.080 3.584 0 4.128z"></path></svg>
					<svg class="mt-3 blackheart" style="right:13px; top:15px;" fill="#000000" width="30px" height="30px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><title>Agregar a tus "Me gusta"</title><path d="M0.256 12.16q0.544 2.080 2.080 3.616l13.664 14.144 13.664-14.144q1.536-1.536 2.080-3.616t0-4.128-2.080-3.584-3.584-2.080-4.16 0-3.584 2.080l-2.336 2.816-2.336-2.816q-1.536-1.536-3.584-2.080t-4.128 0-3.616 2.080-2.080 3.584 0 4.128z"></path></svg>
				</div>
			</div>
		</div>

		<div class="px-4">
			<h3>Volumen</h3>
			<input
				type="range"
				min="0"
				max="0.95"
				step="0.01"
				class="w-full accent-green-400"
				bind:value={volume}
			/>
		</div>
</div>
{/if}

<style>
	.player {
		display: grid;
		grid-template-columns: 2.5em 1fr;
		align-items: center;
		gap: 1em;
		padding: 0.5em 1em 0.5em 0.5em;
		border-radius: 2em;
		background: var(--bg-1);
		transition: filter 0.2s;
		color: #000000;
		user-select: none;
	}

	.player:not(.paused) {
		color: var(--fg-1);
		filter: drop-shadow(0.5em 0.5em 1em rgba(0, 0, 0, 0.1));
	}

	button {
		width: 100%;
		aspect-ratio: 1;
		background-repeat: no-repeat;
		background-position: 50% 50%;
		border-radius: 50%;
	}

	[aria-label='pause'] {
		background-image: url($lib/assets/pause.svg);
	}

	[aria-label='play'] {
		background-image: url($lib/assets/play.svg);
	}

	.info {
		overflow: hidden;
	}

	.time {
		display: flex;
		align-items: center;
		gap: 0.5em;
	}

	.time span {
		font-size: 0.7em;
	}

	.slider {
		flex: 1;
		height: 0.5em;
		background: rgba(0, 0, 0, 0.3);
		border-radius: 0.5em;
		overflow: hidden;
	}

	.progress {
		width: calc(100 * var(--progress));
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
	}
</style>
