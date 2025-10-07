<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/auth';
  import { api } from '$lib/api';
  import type { Provider, Category } from '$lib/types';

  let isNew = false;
  let loading = true;
  let saving = false;
  let error = '';

  let formData = {
    title: '',
    description: '',
    provider: '' as Provider,
    catagory: '' as Category,
    startDate: '',
    endDate: '',
    link: ''
  };

  const providers: Provider[] = ['AIS', 'DTAC', 'True', 'NT', 'TOT'];
  const categories: Category[] = ['Prepaid', 'Postpaid', 'Internet', 'Roaming'];

  $: promotionId = $page.params.id;
  $: isNew = promotionId === 'new';

  $: if (!$authStore.loading && !$authStore.user) {
    goto('/login');
  }

  onMount(async () => {
    if (!isNew) {
      try {
        const promo = await api.getPromotionById(promotionId);
        formData = {
          title: promo.title,
          description: promo.description,
          provider: promo.provider as Provider,
          catagory: promo.catagory as Category,
          startDate: promo.startDate.split('T')[0],
          endDate: promo.endDate.split('T')[0],
          link: promo.link
        };
      } catch (e) {
        error = 'ไม่สามารถโหลดข้อมูลโปรโมชั่นได้';
      }
    }
    loading = false;
  });

  async function handleSubmit() {
    saving = true;
    error = '';

    try {
      if (isNew) {
        await api.createPromotion(formData);
        alert('สร้างโปรโมชั่นสำเร็จ');
      } else {
        await api.updatePromotion(promotionId, formData);
        alert('อัพเดทโปรโมชั่นสำเร็จ');
      }
      goto('/admin');
    } catch (e: any) {
      error = e.message || 'เกิดข้อผิดพลาด';
    } finally {
      saving = false;
    }
  }
</script>

<svelte:head>
  <title>{isNew ? 'สร้าง' : 'แก้ไข'}โปรโมชั่น | แอดมิน</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <header class="bg-white border-b">
    <div class="max-w-4xl mx-auto px-4 py-6">
      <a href="/admin" class="text-blue-600 hover:text-blue-800 text-sm mb-2 inline-block">
        ← กลับแดชบอร์ด
      </a>
      <h1 class="text-3xl font-bold text-gray-900">
        {isNew ? 'สร้างโปรโมชั่นใหม่' : 'แก้ไขโปรโมชั่น'}
      </h1>
    </div>
  </header>

  <main class="max-w-4xl mx-auto px-4 py-8">
    {#if loading}
      <div class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    {:else}
      <form on:submit|preventDefault={handleSubmit} class="bg-white rounded-lg border border-gray-200 p-8">
        {#if error}
          <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p class="text-red-800">{error}</p>
          </div>
        {/if}

        <div class="space-y-6">
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
              ชื่อโปรโมชั่น *
            </label>
            <input
              id="title"
              type="text"
              bind:value={formData.title}
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
              รายละเอียด *
            </label>
            <textarea
              id="description"
              bind:value={formData.description}
              required
              rows="4"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <div>
              <label for="provider" class="block text-sm font-medium text-gray-700 mb-2">
                ค่ายมือถือ *
              </label>
              <select
                id="provider"
                bind:value={formData.provider}
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">เลือกค่าย</option>
                {#each providers as provider}
                  <option value={provider}>{provider}</option>
                {/each}
              </select>
            </div>

            <div>
              <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
                ประเภท *
              </label>
              <select
                id="category"
                bind:value={formData.catagory}
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">เลือกประเภท</option>
                {#each categories as category}
                  <option value={category}>{category}</option>
                {/each}
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <div>
              <label for="startDate" class="block text-sm font-medium text-gray-700 mb-2">
                วันที่เริ่มต้น *
              </label>
              <input
                id="startDate"
                type="date"
                bind:value={formData.startDate}
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label for="endDate" class="block text-sm font-medium text-gray-700 mb-2">
                วันที่สิ้นสุด *
              </label>
              <input
                id="endDate"
                type="date"
                bind:value={formData.endDate}
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label for="link" class="block text-sm font-medium text-gray-700 mb-2">
              ลิงก์โปรโมชั่น
            </label>
            <input
              id="link"
              type="url"
              bind:value={formData.link}
              placeholder="https://..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div class="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              class="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {#if saving}
                <span class="inline-block animate-spin mr-2">⏳</span>
              {/if}
              {isNew ? 'สร้างโปรโมชั่น' : 'บันทึกการเปลี่ยนแปลง'}
            </button>

            <a
              href="/admin"
              class="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors text-center"
            >
              ยกเลิก
            </a>
          </div>
        </div>
      </form>
    {/if}
  </main>
</div>