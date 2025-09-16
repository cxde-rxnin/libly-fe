<script lang="ts">
export const title = 'Users';
// Placeholder data
const stats = [
  { label: 'Total Readers', value: 42 },
  { label: 'Avg Books/Reader (Weekly)', value: 3.2 }
];
const readers = [
  { name: 'Jane Doe', books: 5, status: 'Returned' },
  { name: 'John Smith', books: 2, status: 'Overdue' }
];
let showDialog = false;
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
        <form class="flex flex-col gap-4">
          <input type="text" placeholder="Name" class="px-4 py-2 border border-gray-700 rounded bg-black text-white placeholder-gray-400" />
          <input type="email" placeholder="Email" class="px-4 py-2 border border-gray-700 rounded bg-black text-white placeholder-gray-400" />
          <div class="flex gap-2 justify-end">
            <button type="button" class="px-4 py-2 bg-gray-700 text-white rounded" on:click={() => showDialog = false}>Cancel</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">Add</button>
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
