<script lang="ts">
import { goto } from '$app/navigation';
import { setAuth } from '$lib/auth'; // Correct import path
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
            setAuth(data.token); // Use setAuth from the auth store
            goto('/dashboard');
        }
    } catch (e) {
        error = 'Network error.';
    }
    loading = false;
}
</script>

<main class="flex min-h-screen">
    <!-- Left: Login Form -->
    <div class="flex flex-col justify-center items-center w-full md:w-1/2 bg-black text-white px-8">
        <div class="w-full max-w-xs">
            <h1 class="text-3xl font-bold mb-2">Login to your account</h1>
            <p class="mb-6 text-gray-300">Enter your email below to login to your account</p>
            <form on:submit|preventDefault={login} class="flex flex-col gap-4">
                <div class="flex flex-col gap-1">
                    <label for="username" class="font-semibold">Username</label>
                    <input 
                        id="username"
                        type="text" 
                        placeholder="Enter your username" 
                        bind:value={username} 
                        required 
                        class="px-4 py-3 rounded bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg text-white" 
                    />
                </div>
                <div class="flex flex-col gap-1">
                    <div class="flex justify-between items-center">
                        <label for="password" class="font-semibold">Password</label>
                    </div>
                    <input 
                        id="password"
                        type="password" 
                        placeholder="Enter your password" 
                        bind:value={password} 
                        required 
                        class="px-4 py-3 rounded bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg text-white" 
                    />
                </div>
                <button type="submit" disabled={loading} class="px-4 py-3 bg-white text-black rounded font-semibold text-lg hover:bg-gray-200 transition disabled:bg-gray-400 disabled:cursor-not-allowed">
                    {loading ? 'Logging in...' : 'Login'}
                </button>
                {#if error}
                    <p class="text-red-400 text-base mt-2 text-center">{error}</p>
                {/if}
            </form>
            
        </div>
    </div>
    <!-- Right: Background Image -->
    <div class="hidden md:block md:w-1/2 bg-gray-900 relative">
        <img src="/libra.jpg" alt="Library" class="absolute inset-0 w-full h-full object-cover opacity-80" />
    </div>
</main>