<script lang="ts">
  import { onMount } from 'svelte';
  import type { Promotion, Provider, Category } from '$lib/types';
  import { api } from '$lib/api';

  let promotions: Promotion[] = [];
  let filteredPromotions: Promotion[] = [];
  let loading = true;
  let error = '';
  
  let selectedProvider: Provider = 'All';
  let selectedCategory: Category = 'All';
  let searchQuery = '';
  let selectedForCompare: Set<string> = new Set();

  const providers: Provider[] = ['All', 'AIS', 'DTAC', 'True', 'NT', 'TOT'];
  const categories: Category[] = ['All', 'Prepaid', 'Postpaid', 'Internet', 'Roaming'];

  onMount(async () => {
    try {
      promotions = await api.getAllPromotions();
      filteredPromotions = promotions;
    } catch (e) {
      error = 'ไม่สามารถโหลดข้อมูลโปรโมชั่นได้';
    } finally {
      loading = false;
    }
  });

  function filterPromotions() {
    filteredPromotions = promotions.filter(p => {
      const matchProvider = selectedProvider === 'All' || p.provider === selectedProvider;
      const matchCategory = selectedCategory === 'All' || p.catagory === selectedCategory;
      const matchSearch = searchQuery === '' || 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchProvider && matchCategory && matchSearch;
    });
  }

  function toggleCompare(id: string) {
    if (selectedForCompare.has(id)) {
      selectedForCompare.delete(id);
    } else {
      selectedForCompare.add(id);
    }
    selectedForCompare = selectedForCompare;
  }

  function goToCompare() {
    const ids = Array.from(selectedForCompare).join(',');
    window.location.href = `/compare?ids=${ids}`;
  }

  $: {
    selectedProvider;
    selectedCategory;
    searchQuery;
    filterPromotions();
  }
</script>

<svelte:head>
  <title>ระบบการตรวจสอบโปรโมชั่นมือถือ</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <header class="bg-white border-b">
    <div class="max-w-7xl mx-auto px-4 py-6">
      <h1 class="text-3xl font-bold text-gray-900">ระบบการตรวจสอบโปรโมชั่นมือถือ</h1>
      <p class="text-gray-600 mt-1">เปรียบเทียบแพ็กเกจและโปรโมชั่นจากค่ายต่างๆ</p>
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
    {:else}
      <div class="mb-6 space-y-4">
        <input
          type="text"
          placeholder="ค้นหาโปรโมชั่น..."
          bind:value={searchQuery}
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        <div class="flex flex-wrap gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ค่ายมือถือ</label>
            <select 
              bind:value={selectedProvider}
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {#each providers as provider}
                <option value={provider}>{provider}</option>
              {/each}
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ประเภท</label>
            <select 
              bind:value={selectedCategory}
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {#each categories as category}
                <option value={category}>{category}</option>
              {/each}
            </select>
          </div>
        </div>

        {#if selectedForCompare.size > 0}
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 flex justify-between items-center">
            <span class="text-blue-900">เลือกแล้ว {selectedForCompare.size} รายการ</span>
            <button
              on:click={goToCompare}
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              เปรียบเทียบ
            </button>
          </div>
        {/if}
      </div>

      <div class="text-sm text-gray-600 mb-4">
        พบ {filteredPromotions.length} โปรโมชั่น
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each filteredPromotions as promo}
          <div class="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
            <div class="p-6">
              <div class="flex justify-between items-start mb-3">
                <span class="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                  {promo.provider}
                </span>
                <input
                  type="checkbox"
                  checked={selectedForCompare.has(promo.id)}
                  on:change={() => toggleCompare(promo.id)}
                  class="h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                {promo.title}
              </h3>

              <p class="text-gray-600 text-sm mb-4 line-clamp-2">
                {promo.description}
              </p>

              <div class="flex justify-between items-center text-xs text-gray-500 mb-4">
                <span>{promo.catagory}</span>
                <span>{new Date(promo.startDate).toLocaleDateString('th-TH')} - {new Date(promo.endDate).toLocaleDateString('th-TH')}</span>
              </div>

              <a
                href={`/promotions/${promo.id}`}
                class="block w-full text-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                ดูรายละเอียด
              </a>
            </div>
          </div>
        {/each}
      </div>

      {#if filteredPromotions.length === 0}
        <div class="text-center py-12">
          <p class="text-gray-600">ไม่พบโปรโมชั่นที่ตรงกับเงื่อนไข</p>
        </div>
      {/if}
    {/if}
  </main>
</div>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>