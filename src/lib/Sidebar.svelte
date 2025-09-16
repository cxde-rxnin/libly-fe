<script lang="ts">
import { page } from '$app/stores';
import { onMount } from 'svelte';
import { isLoggedIn, setAuth } from './auth';
import { get } from 'svelte/store';

let isMobile = false;

function checkMobile() {
    isMobile = window.innerWidth < 768;
}

onMount(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
        window.removeEventListener('resize', checkMobile);
    };
});

const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/books', label: 'Books', icon: '📚' },
    { href: '/checkouts', label: 'Checkouts', icon: '📋' },
    { href: '/users', label: 'Users', icon: '👥' },
];

$: currentPath = $page.url.pathname;
$: shouldShowSidebar = $isLoggedIn && !currentPath.includes('/login') && currentPath !== '/';
</script>

{#if shouldShowSidebar}
    {#if isMobile}
        <!-- Mobile Bottom Navigation -->
        <nav class="fixed bottom-0 left-0 right-0 bg-black/15 backdrop-blur-3xl border-t border-gray-200 flex justify-around items-center h-16 z-50 shadow-lg">
            {#each navLinks as link}
                <a 
                    href={link.href} 
                    class="flex flex-col items-center justify-center transition px-2 {currentPath === link.href ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}"
                    aria-current={currentPath === link.href ? 'page' : undefined}
                >
                    <span class="material-icons text-2xl">{link.icon}</span>
                    <span class="text-xs">{link.label}</span>
                </a>
            {/each}
        </nav>
    {:else}
        <!-- Desktop Sidebar -->
        <aside class="fixed top-0 left-0 h-screen w-64 bg-black text-white flex flex-col py-8 px-4 shadow-lg z-40 border-r border-gray-700">
            <div class="mb-10 flex items-center gap-3 px-2">
                <span class="font-bold text-xl">Libly</span>
            </div>
            <nav class="flex flex-col gap-4">
                {#each navLinks as link}
                    <a 
                        href={link.href} 
                        class="flex items-center gap-3 px-4 py-2 rounded transition font-medium {currentPath === link.href ? 'bg-white text-black' : 'text-gray-300 hover:bg-gray-100/50 hover:text-white'}"
                        aria-current={currentPath === link.href ? 'page' : undefined}
                    >
                        <span class="material-icons text-xl">{link.icon}</span>
                        <span>{link.label}</span>
                    </a>
                {/each}
            </nav>

            <button 
                class="mt-auto px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold transition flex items-center gap-2"
                on:click={() => {
                    setAuth(null);
                    window.location.href = '/';
                }}
            >
                Logout
            </button>
        </aside>
    {/if}
{/if}

<style>
.material-icons {
    font-family: 'Material Icons';
    font-style: normal;
    font-weight: normal;
    font-size: inherit;
    line-height: 1;
    letter-spacing: normal;
    text-transform: none;
    display: inline-block;
    white-space: nowrap;
    direction: ltr;
    -webkit-font-feature-settings: 'liga';
    font-feature-settings: 'liga';
    -webkit-font-smoothing: antialiased;
}
</style>