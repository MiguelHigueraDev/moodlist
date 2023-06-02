// @ts-nocheck
import { readable, writable } from 'svelte/store'

export const token = readable(null, function start(set) {
    const hashParams = {};
    const r = /([^&;=]+)=?([^&;]*)/g;
    const q = window.location.hash.substring(1);
    let e;
    while (e = r.exec(q)) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    const access_token = hashParams.access_token;
    set(access_token);

    window.history.pushState("object or string", "Title", "/");
});

export const appUrl = readable(null, function start(set){
    set("https://moodlist.vercel.app/");
});

export const timeRange = writable('short_term');

export const selectedArtists = writable([]);
export const selectedTracks = writable([]);

export const recommendations = writable([]);

export const tokenExpired = writable(false);