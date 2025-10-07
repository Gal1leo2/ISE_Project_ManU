<script lang="ts">
  import { onMount } from 'svelte';
  import { authStore } from '$lib/stores/auth';
  import { api } from '$lib/api';
  import { goto } from '$app/navigation';
  import type { Promotion } from '$lib/types';

  let promotions: Promotion[] = [];
  let loading = true;
  let error = '';

  $: if (!$authStore.loading && !$authStore.user) {
    goto('/login');
  }

  onMount(async () => {
    try {
      promotions = await api.getAllPromotions();
    } catch (e: any) {
      error = 'ไม่สามารถโหลดข้อมูลได้';
    } finally {
      loading = false;
    }
  });

  async function handleDelete(id: string) {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบโปรโมชั่นนี้?')) return;

    try {
      await api.deletePromotion(id);
      promotions = promotions.filter(p => p.id !== id);
      alert('ลบโปรโมชั่นสำเร็จ');
    } catch (e: any) {
      alert('เกิดข้อผิดพลาด: ' + e.message);
    }
  }

  async function handleSignOut() {
    await authStore.signOut();
    goto('/');
  }
</script>

<svelte:head>
  <title>แดชบอร์ดแอดมิน | ระบบการตรวจสอบโปรโมชั่นมือถือ</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <header class="bg-white border-b">
    <div class="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">แดชบอร์ดแอดมิน</h1>
        <p class="text-gray-600 mt-1">จัดการโปรโมชั่นทั้งหมด</p>
      </div>
      <div class="flex gap-4">
        <a href="/" class="text-gray-600 hover:text-gray-900">หน้าหลัก</a>
        <button on:click={handleSignOut} class="text-red-600 hover:text-red-800">
          ออกจากระบบ
        </button>
      </div>
    </div>
  </header>

  <main class="max-w-7xl mx-auto px-4 py-8">
    {#if $authStore.loading || loading}
      <div class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p class="mt-2 text-gray-600">กำลังโหลดข้อมูล...</p>
      </div>
    {:else if error}
      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-red-800">{error}</p>
      </div>
    {:else}
      <div class="mb-6">
        <a
          href="/admin/promotions/new"
          class="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          + สร้างโปรโมชั่นใหม่
        </a>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-900">ชื่อ</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-900">ค่าย</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-900">ประเภท</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-900">วันที่เริ่ม</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-900">จัดการ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            {#each promotions as promo}
              <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 text-sm text-gray-900">{promo.title}</td>
                <td class="px-6 py-4 text-sm text-gray-700">{promo.provider}</td>
                <td class="px-6 py-4 text-sm text-gray-700">{promo.catagory}</td>
                <td class="px-6 py-4 text-sm text-gray-700">
                  {new Date(promo.startDate).toLocaleDateString('th-TH')}
                </td>
                <td class="px-6 py-4 text-sm">
                  <div class="flex gap-2">
                    <a
                      href={`/admin/promotions/${promo.id}`}
                      class="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      แก้ไข
                    </a>
                    <button
                      on:click={() => handleDelete(promo.id)}
                      class="text-red-600 hover:text-red-800 font-medium"
                    >
                      ลบ
                    </button>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>

        {#if promotions.length === 0}
          <div class="text-center py-12">
            <p class="text-gray-600">ยังไม่มีโปรโมชั่น</p>
          </div>
        {/if}
      </div>
    {/if}
  </main>
</div>