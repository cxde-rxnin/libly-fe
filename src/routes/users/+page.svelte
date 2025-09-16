<script lang="ts">
export const title = 'Users';
import { onMount } from 'svelte';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

type User = {
  _id: string;
  name: string;
  email?: string;
};
type Checkout = {
  _id: string;
  bookId: string | { title: string };
  userId: string | User;
  status: string;
  dueDate?: string;
  checkoutDate?: string;
};
type Reader = {
  name: string;
  books: number;
  status: string;
};

let stats: { label: string; value: number }[] = [
  { label: 'Total Readers', value: 0 },
  { label: 'Avg Books/Reader (Weekly)', value: 0 }
];
let readers: Reader[] = [];
let checkouts: Checkout[] = [];
let showDialog = false;
let name = '';
let email = '';
let phone = '';
let membershipId = '';
let error = '';
let loading = false;

async function fetchUsersAndCheckouts(): Promise<void> {
  loading = true;
  error = '';
  try {
    const token = localStorage.getItem('token');
    const [usersRes, checkoutsRes] = await Promise.all([
      fetch(`${backendUrl}/api/users`, { headers: token ? { 'Authorization': `Bearer ${token}` } : {} }),
      fetch(`${backendUrl}/api/checkouts`, { headers: token ? { 'Authorization': `Bearer ${token}` } : {} })
    ]);
    const users: User[] = await usersRes.json();
    checkouts = await checkoutsRes.json();
    stats[0].value = users.length;
    // Calculate avg books/reader (weekly)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weeklyCheckouts = checkouts.filter((co: Checkout) => new Date(co.checkoutDate ?? '') > weekAgo);
    stats[1].value = users.length ? Number((weeklyCheckouts.length / users.length).toFixed(1)) : 0;
    // Build readers table
    readers = users.map((user: User) => {
      const userCheckouts = checkouts.filter((co: Checkout) => (typeof co.userId === 'object' ? co.userId._id : co.userId) === user._id);
      const overdue = userCheckouts.some((co: Checkout) => co.status === 'checked_out' && new Date(co.dueDate ?? '') < new Date());
      return {
        name: user.name,
        books: userCheckouts.length,
        status: overdue ? 'Overdue' : 'Returned'
      };
    });
  } catch (e: any) {
    error = 'Failed to fetch users or checkouts.';
  }
  loading = false;
}

async function addReader(e: Event): Promise<void> {
  e.preventDefault();
  loading = true;
  error = '';
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${backendUrl}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ name, email, phone, membershipId })
    });
    if (!res.ok) {
      const data = await res.json();
      error = data.message || 'Failed to add reader.';
    } else {
      showDialog = false;
      name = email = phone = membershipId = '';
      await fetchUsersAndCheckouts();
    }
  } catch (e: any) {
    error = 'Network error.';
  }
  loading = false;
}

onMount(fetchUsersAndCheckouts);
</script>

<main class="min-h-screen bg-black md:pl-64 p-4 md:ml-10 text-white pb-20 md:pb-0 pt-10 md:pt-20">
  <h1 class="text-3xl font-bold mb-6 text-white">Users</h1>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
    {#each stats as stat}
      <div class="bg-white/10 rounded-lg shadow p-6 flex flex-col items-start border border-gray-700">
        <span class="text-2xl font-bold text-blue-400">{stat.value}</span>
        <span class="text-gray-300">{stat.label}</span>
      </div>
    {/each}
  </div>
  <button class="mb-4 px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700" on:click={() => showDialog = true}>Add New Reader</button>
  {#if showDialog}
    <div class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div class="bg-black border border-gray-700 rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4 text-white">Add New Reader</h2>
        <form class="flex flex-col gap-4" on:submit={addReader}>
          <input type="text" placeholder="Name" bind:value={name} class="px-4 py-2 border border-gray-700 rounded bg-black text-white placeholder-gray-400" required />
          <input type="email" placeholder="Email" bind:value={email} class="px-4 py-2 border border-gray-700 rounded bg-black text-white placeholder-gray-400" required />
          <input type="text" placeholder="Phone" bind:value={phone} class="px-4 py-2 border border-gray-700 rounded bg-black text-white placeholder-gray-400" required />
          <input type="text" placeholder="Membership ID" bind:value={membershipId} class="px-4 py-2 border border-gray-700 rounded bg-black text-white placeholder-gray-400" required />
          {#if error}
            <p class="text-red-400 text-sm">{error}</p>
          {/if}
          <div class="flex gap-2 justify-end">
            <button type="button" class="px-4 py-2 bg-gray-700 text-white rounded" on:click={() => showDialog = false}>Cancel</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>{loading ? 'Adding...' : 'Add'}</button>
          </div>
        </form>
      </div>
    </div>
  {/if}
  <div class="bg-white/10 rounded-lg shadow p-6">
    <h2 class="text-xl font-semibold mb-4 text-white">Readers</h2>
    <table class="w-full text-left">
      <thead>
        <tr class="border-b border-gray-700">
          <th class="py-2 text-gray-400">Name</th>
          <th class="py-2 text-gray-400">Books</th>
          <th class="py-2 text-gray-400">Status</th>
        </tr>
      </thead>
      <tbody>
        {#each readers as reader}
          <tr class="border-b border-gray-800 hover:bg-gray-800">
            <td class="py-2">{reader.name}</td>
            <td class="py-2">{reader.books}</td>
            <td class="py-2">
              <span class="px-2 py-1 rounded text-xs font-semibold {reader.status === 'Returned' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}">{reader.status}</span>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</main>
