<script lang="ts">
export const title = 'Books';
import { onMount } from 'svelte';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

let stats = [
  { label: 'Books', value: 0 },
  { label: 'Checked Out', value: 0 },
  { label: 'Returned', value: 0 }
];
let transactions = [];
let books = [];
let showDialog = false;
let bookTitle = '';
let author = '';
let isbn = '';
let category = '';
let totalCopies = 1;
let availableCopies = 1;
let error = '';
let loading = false;

async function fetchBooks() {
  loading = true;
  error = '';
  
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${backendUrl}/api/books`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    
    const data = await res.json();
    
    if (res.ok) {
      // Handle both direct array and wrapped object responses
      if (Array.isArray(data)) {
        books = data;
      } else if (data.books && Array.isArray(data.books)) {
        books = data.books;
      } else {
        books = [];
      }
      
      stats[0].value = books.length;
      
      // Update transactions
      transactions = books.map(book => ({
        user: book.lastUser || 'N/A',
        book: book.title || 'Unknown Title',
        type: book.lastTransactionType || 'N/A',
        date: book.updatedAt ? new Date(book.updatedAt).toLocaleDateString() : 'No Date'
      }));
    } else {
      error = `Server error: ${res.status} - ${data.message || 'Unknown error'}`;
    }
  } catch (e) {
    error = `Network error: ${e.message}`;
    console.error('Fetch error:', e);
  }
  
  loading = false;
}

onMount(fetchBooks);

async function addBook(e) {
  e.preventDefault();
  loading = true;
  error = '';
  
  try {
    const token = localStorage.getItem('token');
    const bookData = { 
      title: bookTitle, 
      author, 
      isbn, 
      category, 
      totalCopies: Number(totalCopies), 
      availableCopies: Number(availableCopies) 
    };
    
    const res = await fetch(`${backendUrl}/api/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(bookData)
    });
    
    if (!res.ok) {
      const data = await res.json();
      error = data.message || `Failed to add book. Status: ${res.status}`;
    } else {
      showDialog = false;
      bookTitle = author = isbn = category = '';
      totalCopies = availableCopies = 1;
      await fetchBooks();
    }
  } catch (e) {
    error = `Network error: ${e.message}`;
    console.error('Add book error:', e);
  }
  
  loading = false;
}
</script>

<main class="min-h-screen bg-black md:pl-64 p-4 md:ml-10 text-white pb-20 md:pb-0 pt-10 md:pt-20">
  <h1 class="text-3xl font-bold mb-6 text-white">Books</h1>
  
  <!-- Error Display -->
  {#if error}
    <div class="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-6">
      <p class="text-red-400">Error: {error}</p>
      <button 
        class="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700" 
        on:click={fetchBooks}
      >
        Retry
      </button>
    </div>
  {/if}
  
  <!-- Stats Cards -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
    {#each stats as stat}
      <div class="bg-white/10 rounded-lg shadow p-6 flex flex-col items-start border border-gray-700">
        <span class="text-2xl font-bold text-blue-400">{stat.value}</span>
        <span class="text-gray-300">{stat.label}</span>
      </div>
    {/each}
  </div>
  
  <!-- Add Book Button -->
  <button 
    class="mb-4 px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700" 
    on:click={() => showDialog = true}
  >
    Add New Book
  </button>
  
  <!-- Add Book Dialog -->
  {#if showDialog}
    <div class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div class="bg-black border border-gray-700 rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4 text-white">Add New Book</h2>
        <form class="flex flex-col gap-4" on:submit={addBook}>
          <input 
            type="text" 
            placeholder="Title" 
            bind:value={bookTitle} 
            class="px-4 py-2 border border-gray-700 rounded bg-black text-white placeholder-gray-400" 
            required 
          />
          <input 
            type="text" 
            placeholder="Author" 
            bind:value={author} 
            class="px-4 py-2 border border-gray-700 rounded bg-black text-white placeholder-gray-400" 
            required 
          />
          <input 
            type="text" 
            placeholder="ISBN" 
            bind:value={isbn} 
            class="px-4 py-2 border border-gray-700 rounded bg-black text-white placeholder-gray-400" 
            required 
          />
          <input 
            type="text" 
            placeholder="Category" 
            bind:value={category} 
            class="px-4 py-2 border border-gray-700 rounded bg-black text-white placeholder-gray-400" 
            required 
          />
          <input 
            type="number" 
            placeholder="Total Copies" 
            bind:value={totalCopies} 
            min="1" 
            class="px-4 py-2 border border-gray-700 rounded bg-black text-white placeholder-gray-400" 
            required 
          />
          <input 
            type="number" 
            placeholder="Available Copies" 
            bind:value={availableCopies} 
            min="0" 
            class="px-4 py-2 border border-gray-700 rounded bg-black text-white placeholder-gray-400" 
            required 
          />
          {#if error}
            <p class="text-red-400 text-sm">{error}</p>
          {/if}
          <div class="flex gap-2 justify-end">
            <button 
              type="button" 
              class="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600" 
              on:click={() => showDialog = false}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" 
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  {/if}
  
  <!-- Books Table -->
  <div class="bg-white/10 rounded-lg shadow p-6 mb-8 mt-10">
    <h2 class="text-xl font-semibold mb-4 text-white">
      Available Books  
    </h2>
    
    {#if books.length === 0 && !loading}
      <div class="text-center py-8 text-gray-400">
        <p>No books found.</p>
        <p class="text-sm mt-2">Click "Add New Book" to add your first book.</p>
      </div>
    {:else}
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="border-b border-gray-700">
              <th class="py-2 text-gray-400">Title</th>
              <th class="py-2 text-gray-400">Author</th>
              <th class="py-2 text-gray-400">ISBN</th>
              <th class="py-2 text-gray-400">Category</th>
              <th class="py-2 text-gray-400">Total Copies</th>
              <th class="py-2 text-gray-400">Available Copies</th>
            </tr>
          </thead>
          <tbody>
            {#each books as book, index}
              <tr class="border-b border-gray-800 hover:bg-gray-800">
                <td class="py-2">{book.title || `Book ${index + 1}`}</td>
                <td class="py-2">{book.author || 'Unknown'}</td>
                <td class="py-2">{book.isbn || 'N/A'}</td>
                <td class="py-2">{book.category || 'N/A'}</td>
                <td class="py-2">{book.totalCopies || 0}</td>
                <td class="py-2">{book.availableCopies || 0}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
  
</main>