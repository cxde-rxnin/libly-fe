<script lang="ts">
export const title = 'Dashboard';
// Placeholder data
const stats = [
  { label: 'Books', value: 120 },
  { label: 'Checked Out', value: 34 },
  { label: 'Returned', value: 86 }
];
const transactions = [
  { user: 'Jane Doe', book: '1984', type: 'Checked Out', date: '2025-09-15' },
  { user: 'John Smith', book: 'Brave New World', type: 'Returned', date: '2025-09-14' },
  { user: 'Alice', book: 'Dune', type: 'Checked Out', date: '2025-09-13' }
];
</script>

<main class="min-h-screen bg-black md:pl-64 p-4 md:ml-10 text-white pb-20 md:pb-0 pt-10 md:pt-20">
  <h1 class="text-3xl font-bold mb-6 text-white">Dashboard</h1>
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
