<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import type { Promotion } from '$lib/types';
  import { api } from '$lib/api';

  let promotion: Promotion | null = null;
  let loading = true;
  let error = '';

  $: promotionId = $page.params.id;

  onMount(async () => {
    try {
      promotion = await api.getPromotionById(promotionId);
    } catch (e) {
      error = 'ไม่สามารถโหลดข้อมูลโปรโมชั่นได้';
    } finally {
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>{promotion?.title || 'รายละเอียดโปรโมชั่น'} | ระบบการตรวจสอบโปรโมชั่นมือถือ</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <header class="bg-white border-b">
    <div class="max-w-4xl mx-auto px-4 py-6">
      <a href="/" class="text-blue-600 hover:text-blue-800 text-sm mb-2 inline-block">
        ← กลับหน้าหลัก
      </a>
      <h1 class="text-3xl font-bold text-gray-900">รายละเอียดโปรโมชั่น</h1>
    </div>
  </header>

  <main class="max-w-4xl mx-auto px-4 py-8">
    {#if loading}
      <div class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p class="mt-2 text-gray-600">กำลังโหลดข้อมูล...</p>
      </div>
    {:else if error}
      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-red-800">{error}</p>
      </div>
    {:else if promotion}
      <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div class="p-8">
          <div class="flex items-start justify-between mb-6">
            <div>
              <span class="inline-block px-4 py-2 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full mb-4">
                {promotion.provider}
              </span>
              <h2 class="text-3xl font-bold text-gray-900 mb-2">
                {promotion.title}
              </h2>
              <p class="text-gray-600">
                ประเภท: {promotion.catagory}
              </p>
            </div>
          </div>

          <div class="border-t border-gray-200 pt-6 mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">รายละเอียด</h3>
            <p class="text-gray-700 leading-relaxed whitespace-pre-line">
              {promotion.description}
            </p>
          </div>

          <div class="border-t border-gray-200 pt-6 mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">ระยะเวลา</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-600">วันที่เริ่มต้น</p>
                <p class="text-gray-900 font-medium">
                  {new Date(promotion.startDate).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-600">วันที่สิ้นสุด</p>
                <p class="text-gray-900 font-medium">
                  {new Date(promotion.endDate).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          {#if promotion.link}
            <div class="border-t border-gray-200 pt-6">
              <a
                href={promotion.link}
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                เปิดลิงก์โปรโมชั่น
                <svg class="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          {/if}
        </div>
      </div>
    {:else}
      <div class="text-center py-12">
        <p class="text-gray-600">ไม่พบข้อมูลโปรโมชั่น</p>
      </div>
    {/if}
  </main>
</div>