<script lang="ts">
  import { authStore } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  
  let email = '';
  let password = '';
  let isSignUp = false;
  let error = '';
  let loading = false;

  async function handleSubmit() {
    error = '';
    loading = true;

    try {
      if (isSignUp) {
        await authStore.signUp(email, password);
        goto('/register-user');
      } else {
        await authStore.signIn(email, password);
        goto('/admin');
      }
    } catch (e: any) {
      error = e.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>{isSignUp ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'} | ระบบการตรวจสอบโปรโมชั่นมือถือ</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
  <div class="max-w-md w-full">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900">
        ระบบการตรวจสอบโปรโมชั่นมือถือ
      </h1>
      <p class="mt-2 text-gray-600">
        {isSignUp ? 'สร้างบัญชีใหม่' : 'เข้าสู่ระบบเพื่อจัดการโปรโมชั่น'}
      </p>
    </div>

    <div class="bg-white rounded-lg border border-gray-200 p-8">
      <form on:submit|preventDefault={handleSubmit} class="space-y-6">
        {#if error}
          <div class="bg-red-50 border border-red-200 rounded-lg p-4">
            <p class="text-red-800 text-sm">{error}</p>
          </div>
        {/if}

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            อีเมล
          </label>
          <input
            id="email"
            type="email"
            bind:value={email}
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            รหัสผ่าน
          </label>
          <input
            id="password"
            type="password"
            bind:value={password}
            required
            minlength="6"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          class="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {#if loading}
            <span class="inline-block animate-spin mr-2">⏳</span>
          {/if}
          {isSignUp ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}
        </button>
      </form>

      <div class="mt-6 text-center">
        <button
          type="button"
          on:click={() => { isSignUp = !isSignUp; error = ''; }}
          class="text-blue-600 hover:text-blue-800 text-sm"
        >
          {isSignUp ? 'มีบัญชีอยู่แล้ว? เข้าสู่ระบบ' : 'ยังไม่มีบัญชี? สมัครสมาชิก'}
        </button>
      </div>

      <div class="mt-4 text-center">
        <a href="/" class="text-gray-600 hover:text-gray-800 text-sm">
          ← กลับหน้าหลัก
        </a>
      </div>
    </div>
  </div>
</div>