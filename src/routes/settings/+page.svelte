<script lang="ts">
export const title = 'Settings';
</script>

<main class="min-h-screen bg-black md:pl-64 p-4 md:ml-10 text-white pb-20 md:pb-0 pt-10 md:pt-20">
  <div class="w-full max-w-xl mx-auto p-6 bg-white/10 rounded-lg shadow border border-gray-700">
    <h1 class="text-3xl font-bold mb-6 text-white">Admin Settings</h1>
    <form class="flex flex-col gap-4">
      <div>
        <label class="block mb-1 font-medium text-white">Change Password</label>
        <input type="password" placeholder="New Password" class="w-full px-4 py-3 border border-gray-700 rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg" />
      </div>
      <div>
        <label class="block mb-1 font-medium text-white">Email</label>
        <input type="email" placeholder="admin@email.com" class="w-full px-4 py-3 border border-gray-700 rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg" />
      </div>
      <button type="submit" class="px-4 py-3 bg-blue-600 text-white rounded font-semibold text-lg hover:bg-blue-700 transition">Save Changes</button>
    </form>
  </div>
</main>
