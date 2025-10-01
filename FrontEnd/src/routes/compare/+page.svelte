<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import type { Promotion } from '$lib/types';
  import { api } from '$lib/api';

  let promotions: Promotion[] = [];
  let loading = true;
  let error = '';

  $: ids = $page.url.searchParams.get('ids')?.split(',') || [];

  onMount(async () => {
    if (ids.length === 0) {
      error = 'กรุณาเลือกโปรโมชั่นเพื่อเปรียบเทียบ';
      loading = false;
      return;
    }

    try {
      const allPromotions = await api.getAllPromotions();
      promotions = allPromotions.filter(p => ids.includes(p.id));
      
      if (promotions.length === 0) {
        error = 'ไม่พบโปรโมชั่นที่เลือก';
      }
    } catch (e) {
      error = 'ไม่สามารถโหลดข้อมูลโปรโมชั่นได้';
    } finally {
      loading = false;
    }
  });

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  function getDuration(start: string, end: string): number {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  }
</script>

<svelte:head>
  <title>เปรียบเทียบโปรโมชั่น | ระบบการตรวจสอบโปรโมชั่นมือถือ</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <header class="bg-white border-b">
    <div class="max-w-7xl mx-auto px-4 py-6">
      <a href="/" class="text-blue-600 hover:text-blue-800 text-sm mb-2 inline-block">
        ← กลับหน้าหลัก
      </a>
      <h1 class="text-3xl font-bold text-gray-900">เปรียบเทียบโปรโมชั่น</h1>
      <p class="text-gray-600 mt-1">เปรียบเทียบแพ็กเกจและโปรโมชั่นแบบเคียงข้าง</p>
    </div>
  </header>

  <main class="max-w-7xl mx-auto px-4 py-8">
    {#if loading}
      <div class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p class="mt-2 text-gray-600">กำลังโหลดข้อมูล...</p>
      </div>
    {:else if error}
      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-red-800">{error}</p>
      </div>
    {:else if promotions.length > 0}
      <div class="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-48">
                รายการ
              </th>
              {#each promotions as promo}
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-900 min-w-64">
                  <div class="flex flex-col gap-2">
                    <span class="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full w-fit">
                      {promo.provider}
                    </span>
                    <span class="text-base">{promo.title}</span>
                  </div>
                </th>
              {/each}
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr class="hover:bg-gray-50">
              <td class="px-6 py-4 text-sm font-medium text-gray-900">
                ค่ายมือถือ
              </td>
              {#each promotions as promo}
                <td class="px-6 py-4 text-sm text-gray-700">
                  {promo.provider}
                </td>
              {/each}
            </tr>

            <tr class="hover:bg-gray-50">
              <td class="px-6 py-4 text-sm font-medium text-gray-900">
                ประเภท
              </td>
              {#each promotions as promo}
                <td class="px-6 py-4 text-sm text-gray-700">
                  {promo.catagory}
                </td>
              {/each}
            </tr>

            <tr class="hover:bg-gray-50">
              <td class="px-6 py-4 text-sm font-medium text-gray-900">
                รายละเอียด
              </td>
              {#each promotions as promo}
                <td class="px-6 py-4 text-sm text-gray-700">
                  <div class="max-w-xs">
                    {promo.description}
                  </div>
                </td>
              {/each}
            </tr>

            <tr class="hover:bg-gray-50">
              <td class="px-6 py-4 text-sm font-medium text-gray-900">
                วันที่เริ่มต้น
              </td>
              {#each promotions as promo}
                <td class="px-6 py-4 text-sm text-gray-700">
                  {formatDate(promo.startDate)}
                </td>
              {/each}
            </tr>

            <tr class="hover:bg-gray-50">
              <td class="px-6 py-4 text-sm font-medium text-gray-900">
                วันที่สิ้นสุด
              </td>
              {#each promotions as promo}
                <td class="px-6 py-4 text-sm text-gray-700">
                  {formatDate(promo.endDate)}
                </td>
              {/each}
            </tr>

            <tr class="hover:bg-gray-50">
              <td class="px-6 py-4 text-sm font-medium text-gray-900">
                ระยะเวลา
              </td>
              {#each promotions as promo}
                <td class="px-6 py-4 text-sm text-gray-700">
                  {getDuration(promo.startDate, promo.endDate)} วัน
                </td>
              {/each}
            </tr>

            <tr class="hover:bg-gray-50">
              <td class="px-6 py-4 text-sm font-medium text-gray-900">
                ลิงก์
              </td>
              {#each promotions as promo}
                <td class="px-6 py-4 text-sm">
                  {#if promo.link}
                    <a
                      href={promo.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-blue-600 hover:text-blue-800 inline-flex items-center"
                    >
                      เปิดลิงก์
                      <svg class="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  {:else}
                    <span class="text-gray-400">ไม่มีลิงก์</span>
                  {/if}
                </td>
              {/each}
            </tr>

            <tr class="bg-gray-50">
              <td class="px-6 py-4 text-sm font-medium text-gray-900">
                ดูรายละเอียด
              </td>
              {#each promotions as promo}
                <td class="px-6 py-4">
                  <a
                    href={`/promotions/${promo.id}`}
                    class="inline-block px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    ดูเพิ่มเติม
                  </a>
                </td>
              {/each}
            </tr>
          </tbody>
        </table>
      </div>
    {:else}
      <div class="text-center py-12">
        <p class="text-gray-600">ไม่พบโปรโมชั่นที่เลือก</p>
      </div>
    {/if}
  </main>
</div>