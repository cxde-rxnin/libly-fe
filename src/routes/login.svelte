<script lang="ts">
import { onMount } from 'svelte';
import { goto } from '$app/navigation';
let username = '';
let password = '';
let error = '';
let loading = false;
const backendUrl = import.meta.env.VITE_BACKEND_URL;

async function login() {
    loading = true;
    error = '';
    try {
        const res = await fetch(`${backendUrl}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (!res.ok) {
            error = data.message || 'Login failed.';
        } else {
            localStorage.setItem('token', data.token);
            goto('/dashboard');
        }
    } catch (e) {
        error = 'Network error.';
    }
    loading = false;
}
</script>

<main class="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 class="text-3xl font-bold mb-6 text-center text-blue-700">Login</h1>
        <form on:submit|preventDefault={login} class="flex flex-col gap-4">
            <input type="text" placeholder="Username" bind:value={username} required class="px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg" />
            <input type="password" placeholder="Password" bind:value={password} required class="px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg" />
            <button type="submit" disabled={loading} class="px-4 py-3 bg-blue-600 text-white rounded font-semibold text-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed">
                {loading ? 'Logging in...' : 'Login'}
            </button>
            {#if error}
                <p class="text-red-600 text-base mt-2 text-center">{error}</p>
            {/if}
        </form>
    </div>
</main>
