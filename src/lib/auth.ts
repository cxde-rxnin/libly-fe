import { writable } from 'svelte/store';

function getInitialAuth() {
    if (typeof window !== 'undefined') {
        return !!localStorage.getItem('token');
    }
    return false;
}

export const isLoggedIn = writable(getInitialAuth());

export function setAuth(token: string | null) {
    if (typeof window !== 'undefined') {
        if (token) {
            localStorage.setItem('token', token);
            isLoggedIn.set(true);
        } else {
            localStorage.removeItem('token');
            isLoggedIn.set(false);
        }
    }
}

if (typeof window !== 'undefined') {
    window.addEventListener('storage', () => {
        isLoggedIn.set(getInitialAuth());
    });
}
