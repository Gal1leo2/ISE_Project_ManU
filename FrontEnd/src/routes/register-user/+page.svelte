<script lang="ts">
  import { onMount } from 'svelte';
  import { authStore } from '$lib/stores/auth';
  import { api } from '$lib/api';
  import { goto } from '$app/navigation';

  let loading = true;
  let error = '';
  let success = false;

  onMount(async () => {
    const { user } = $authStore;
    
    if (!user) {
      goto('/login');
      return;
    }

    try {
      await api.registerUser();
      success = true;
      setTimeout(() => {
        goto('/');
      }, 2000);
    } catch (e: any) {
      error = e.message || 'ไม่สามารถลงทะเบียนได้';
    } finally {
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>ลงทะเบียนผู้ใช้ | ระบบการตรวจสอบโปรโมชั่นมือถือ</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
  <div class="max-w-md w-full">
    <div class="bg-white rounded-lg border border-gray-200 p-8 text-center">
      {#if loading}
        <div class="py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p class="text-gray-600">กำลังลงทะเบียนผู้ใช้...</p>
        </div>
      {:else if success}
        <div class="py-12">
          <div class="text-green-600 text-6xl mb-4">✓</div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">ลงทะเบียนสำเร็จ!</h2>
          <p class="text-gray-600">กำลังนำคุณไปยังหน้าหลัก...</p>
        </div>
      {:else if error}
        <div class="py-12">
          <div class="text-red-600 text-6xl mb-4">✗</div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">เกิดข้อผิดพลาด</h2>
          <p class="text-red-600 mb-6">{error}</p>
          <a
            href="/"
            class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            กลับหน้าหลัก
          </a>
        </div>
      {/if}
    </div>
  </div>
</div>