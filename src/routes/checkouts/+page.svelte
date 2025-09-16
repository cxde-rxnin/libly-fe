<script lang="ts">
export const title = 'Checkouts';
import { onMount } from 'svelte';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

let checkouts = [];
let overdue = [];
let books = [];
let users = [];
let error = '';
let loading = false;
let showDialog = false;
let selectedBookId = '';
let selectedUserId = '';

let booksLoading = false;
let booksError = '';

async function fetchCheckouts() {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${backendUrl}/api/checkouts`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    const data = await res.json();
    if (res.ok) {
      checkouts = data;
    }
  } catch (e) {
    error = 'Failed to fetch checkouts.';
  }
}

async function fetchOverdue() {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${backendUrl}/api/checkouts/overdue`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    const data = await res.json();
    if (res.ok) {
      overdue = data;
    }
  } catch (e) {
    error = 'Failed to fetch overdue checkouts.';
  }
}

async function fetchBooksAndUsers() {
  booksLoading = true;
  booksError = '';
  try {
    const token = localStorage.getItem('token');
    const [booksRes, usersRes] = await Promise.all([
      fetch(`${backendUrl}/api/books`, { headers: token ? { 'Authorization': `Bearer ${token}` } : {} }),
      fetch(`${backendUrl}/api/users`, { headers: token ? { 'Authorization': `Bearer ${token}` } : {} })
    ]);
    const booksData = await booksRes.json();
    if (Array.isArray(booksData)) {
      books = booksData;
    } else if (booksData.books && Array.isArray(booksData.books)) {
      books = booksData.books;
    } else {
      books = [];
    }
    users = await usersRes.json();
    console.log('Books:', books); // Debug log
  } catch (e) {
    booksError = 'Failed to fetch books or users.';
  }
  booksLoading = false;
}

onMount(async () => {
  await fetchCheckouts();
  await fetchOverdue();
  await fetchBooksAndUsers();
});

async function checkoutBook(e) {
  e.preventDefault();
  loading = true;
  error = '';
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${backendUrl}/api/checkouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ bookId: selectedBookId, userId: selectedUserId })
    });
    if (!res.ok) {
      const data = await res.json();
      error = data.message || 'Failed to checkout book.';
    } else {
      showDialog = false;
      selectedBookId = selectedUserId = '';
      await fetchCheckouts();
      await fetchBooksAndUsers();
    }
  } catch (e) {
    error = 'Network error.';
  }
  loading = false;
}
</script>

<main class="min-h-screen bg-black md:pl-64 p-4 md:ml-10 text-white pb-20 md:pb-0 pt-10 md:pt-20">
  <h1 class="text-3xl font-bold mb-6 text-white">Checkouts</h1>
  <button class="mb-4 px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700" on:click={() => showDialog = true}>Checkout Book</button>
  {#if showDialog}
    <div class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div class="bg-black border border-gray-700 rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4 text-white">Checkout Book</h2>
        <form class="flex flex-col gap-4" on:submit={checkoutBook}>
          <select bind:value={selectedBookId} class="px-4 py-2 border border-gray-700 rounded bg-black text-white" required>
            <option value="" disabled selected>Select Book</option>
            {#if booksLoading}
              <option disabled>Loading books...</option>
            {:else if booksError}
              <option disabled>{booksError}</option>
            {:else if books.length === 0}
              <option disabled>No books available</option>
            {:else}
              {#each books as book}
                <option value={book._id}>{book.title} ({book.availableCopies} available)</option>
              {/each}
            {/if}
          </select>
          <select bind:value={selectedUserId} class="px-4 py-2 border border-gray-700 rounded bg-black text-white" required>
            <option value="" disabled selected>Select User</option>
            {#each users as user}
              <option value={user._id}>{user.name} ({user.email})</option>
            {/each}
          </select>
          {#if error}
            <p class="text-red-400 text-sm">{error}</p>
          {/if}
          <div class="flex gap-2 justify-end">
            <button type="button" class="px-4 py-2 bg-gray-700 text-white rounded" on:click={() => showDialog = false}>Cancel</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>{loading ? 'Checking out...' : 'Checkout'}</button>
          </div>
        </form>
      </div>
    </div>
  {/if}
  <div class="bg-white/10 rounded-lg shadow p-6 mb-8">
    <h2 class="text-xl font-semibold mb-4 text-white">Current Checkouts</h2>
    <table class="w-full text-left">
      <thead>
        <tr class="border-b border-gray-700">
          <th class="py-2 text-gray-400">Book</th>
          <th class="py-2 text-gray-400">User</th>
          <th class="py-2 text-gray-400">Status</th>
          <th class="py-2 text-gray-400">Due Date</th>
        </tr>
      </thead>
      <tbody>
        {#each checkouts as co}
          <tr class="border-b border-gray-800 hover:bg-gray-800">
            <td class="py-2">{co.bookId?.title || co.bookId}</td>
            <td class="py-2">{co.userId?.name || co.userId}</td>
            <td class="py-2">
              <span class="px-2 py-1 rounded text-xs font-semibold {co.status === 'returned' ? 'bg-green-900 text-green-300' : co.status === 'checked_out' ? 'bg-blue-900 text-blue-300' : 'bg-red-900 text-red-300'}">{co.status}</span>
            </td>
            <td class="py-2">{co.dueDate ? new Date(co.dueDate).toLocaleDateString() : ''}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <div class="bg-white/10 rounded-lg shadow p-6">
    <h2 class="text-xl font-semibold mb-4 text-white">Overdue Checkouts</h2>
    <table class="w-full text-left">
      <thead>
        <tr class="border-b border-gray-700">
          <th class="py-2 text-gray-400">Book</th>
          <th class="py-2 text-gray-400">User</th>
          <th class="py-2 text-gray-400">Due Date</th>
        </tr>
      </thead>
      <tbody>
        {#each overdue as co}
          <tr class="border-b border-gray-800 hover:bg-gray-800">
            <td class="py-2">{co.bookId?.title || co.bookId}</td>
            <td class="py-2">{co.userId?.name || co.userId}</td>
            <td class="py-2">{co.dueDate ? new Date(co.dueDate).toLocaleDateString() : ''}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</main>
