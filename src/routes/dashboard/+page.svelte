<script lang="ts">
export const title = 'Dashboard';
import { onMount } from 'svelte';
import { setAuth } from '$lib/auth';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

type Book = {
  _id: string;
  title: string;
  // ...other fields as needed
};
type Checkout = {
  _id: string;
  bookId: Book | string;
  userId: { name: string } | string;
  status: string;
  dueDate?: string;
  checkoutDate?: string;
};
type Transaction = {
  user: string;
  book: string;
  type: string;
  date: string;
};

let stats: { label: string; value: number }[] = [
  { label: 'Books', value: 0 },
  { label: 'Checked Out', value: 0 },
  { label: 'Returned', value: 0 }
];
let transactions: Transaction[] = [];
let books: Book[] = [];
let checkouts: Checkout[] = [];
let error = '';
let loading = false;

async function fetchDashboardData(): Promise<void> {
  loading = true;
  error = '';
  try {
    const token = localStorage.getItem('token');
    const [booksRes, checkoutsRes] = await Promise.all([
      fetch(`${backendUrl}/api/books`, { headers: token ? { 'Authorization': `Bearer ${token}` } : {} }),
      fetch(`${backendUrl}/api/checkouts`, { headers: token ? { 'Authorization': `Bearer ${token}` } : {} })
    ]);
    const booksData = await booksRes.json();
    if (Array.isArray(booksData)) {
      books = booksData;
    } else if (booksData.books && Array.isArray(booksData.books)) {
      books = booksData.books;
    } else {
      books = [];
    }
    checkouts = await checkoutsRes.json();
    stats[0].value = books.length;
    stats[1].value = checkouts.filter((co: Checkout) => co.status === 'checked_out').length;
    stats[2].value = checkouts.filter((co: Checkout) => co.status === 'returned').length;
    transactions = checkouts.slice(-10).reverse().map((co: Checkout) => ({
      user: typeof co.userId === 'object' ? co.userId.name : co.userId,
      book: typeof co.bookId === 'object' ? co.bookId.title : co.bookId,
      type: co.status === 'checked_out' ? 'Checked Out' : 'Returned',
      date: co.dueDate ? new Date(co.dueDate).toLocaleDateString() : ''
    }));
  } catch (e: any) {
    error = 'Failed to fetch dashboard data.';
  }
  loading = false;
}

onMount(fetchDashboardData);
</script>

<main class="min-h-screen bg-black md:pl-64 p-4 md:ml-10 text-white pb-20 md:pb-0 pt-10 md:pt-20">
  <h1 class="text-3xl font-bold mb-6 text-white">Dashboard</h1>
  <button class="md:hidden absolute top-10 right-6 px-5 py-2 bg-red-600 text-white rounded-lg font-semibold shadow-lg z-50" on:click={() => { setAuth(null); window.location.href = '/'; }}>
    Logout
  </button>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
    {#each stats as stat}
      <div class="bg-white/10 rounded-lg shadow p-6 flex flex-col items-start border border-gray-700">
        <span class="text-2xl font-bold text-blue-400">{stat.value}</span>
        <span class="text-gray-300">{stat.label}</span>
      </div>
    {/each}
  </div>
  <div class="bg-white/10 rounded-lg shadow p-6">
    <h2 class="text-xl font-semibold mb-4 text-white">Recent Transactions</h2>
    <table class="w-full text-left">
      <thead>
        <tr class="border-b border-gray-700">
          <th class="py-2 text-gray-400">User</th>
          <th class="py-2 text-gray-400">Book</th>
          <th class="py-2 text-gray-400">Type</th>
          <th class="py-2 text-gray-400">Date</th>
        </tr>
      </thead>
      <tbody>
        {#each transactions as tx}
          <tr class="border-b border-gray-800 hover:bg-gray-800">
            <td class="py-2">{tx.user}</td>
            <td class="py-2">{tx.book}</td>
            <td class="py-2">{tx.type}</td>
            <td class="py-2">{tx.date}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</main>
