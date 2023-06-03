<script>
	//@ts-nocheck

	export let isVisible = false;
	export let songName = '';
	export let artistName = '';
	export let songUrl = '';

	export let time = 0
	let duration = 0
	export let paused = true
    let volume = 0.2

	/**
	 * @param {number} time
	 */
	function format(time) {
		if (isNaN(time)) return '...'

		const minutes = Math.floor(time / 60)
		const seconds = Math.floor(time % 60)

		return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
	}
</script>

<div
	class="fixed top-[600px] md:top-[600px] left-[20px] bg-white p-4 rounded-sm shadow-md z-50 w-[350px] md:w-[400px] overflow-auto {isVisible
		? ''
		: 'hidden'}"
>
	{#if songName != ''}
		<h2>Ahora está sonando</h2>

		<div class="player" class:paused>
			<audio src={songUrl} bind:currentTime={time} bind:duration bind:paused bind:volume on:ended={() => {
                time = 0;
            }} />
			<button class="play" aria-label={paused ? 'play' : 'pause'} on:click={() => (paused = !paused)}></button>
			<div class="info">
				<div class="description">
					<h2><span class="font-semibold">{artistName}</span> - {songName}</h2>
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
        <div class="px-4">
            <h3>Volumen</h3>
            <input type="range" min="0.01" max="0.5" step="0.01" class="w-full accent-green-400" bind:value={volume}/>
        </div>
	{:else}
		<h1>No hay nada sonando.</h1>
	{/if}
</div>

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

	.description {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		line-height: 1.2;
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
