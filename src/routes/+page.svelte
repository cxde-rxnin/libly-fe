<script lang="ts">
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

<div class="flex min-h-screen">
    <!-- Left: Login Form -->
    <div class="flex flex-col justify-center items-center w-full md:w-1/2 bg-black text-white px-8 py-12">

        <h1 class="text-3xl font-bold mb-2 w-full px-20">Login to your account</h1>
        <p class="mb-6 w-full text-gray-300 px-20">Enter your username below to login to your account</p>
        <form on:submit|preventDefault={login} class="flex flex-col gap-4 w-full max-w-md">
            <div>
                <label class="block mb-1 font-medium">Username</label>
                <input type="text" placeholder="yourusername" bind:value={username} required class="w-full px-4 py-3 bg-black border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg text-white placeholder-gray-500" />
            </div>
            <div class="flex justify-between items-center">
                <label class="font-medium">Password</label>
            </div>
            <input type="password" placeholder="••••••••" bind:value={password} required class="w-full px-4 py-3 bg-black border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg text-white placeholder-gray-500" />
            <button type="submit" disabled={loading} class="w-full px-4 py-3 bg-white text-black rounded font-semibold text-lg hover:bg-gray-200 transition disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed">
                {loading ? 'Logging in...' : 'Login'}
            </button>
            {#if error}
                <p class="text-red-500 text-base mt-2 text-center">{error}</p>
            {/if}
        </form>
        
    </div>
    <!-- Right: Image -->
    <div class="hidden md:block w-1/2 bg-gray-900 relative">
        <img src="/src/lib/assets/libra.jpg" alt="Library" class="absolute inset-0 w-full h-full object-cover opacity-80" />
    </div>
</div>
