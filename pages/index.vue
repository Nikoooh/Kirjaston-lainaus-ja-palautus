<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { createClient } from '~/src/lib/createSupabaseClient';

  const memberId = ref('');
  const route = ref('');
  const router = useRouter();
  const supabase = createClient();
  
  const login = async () => {
    if (!memberId.value) {
      console.log("Kirjastokortin numeroa ei annettu.");
      return; 
    };

    const { data } = await supabase.from('MembersTable').select('*').eq('member_id', memberId.value);   
    
    if (data && data.length > 0) {
      router.push(`/${route.value}/${memberId.value}`);
    }
  }

</script>

<template>
  <div class="py-8 px-12">
    <div class="mb-4 text-xl">
      <p>Navigointi</p>
    </div>

    <div class="flex gap-4 text-white">   
      <button class="bg-slate-700 hover:bg-slate-800 py-2 px-6 rounded-lg" @click="() => { route = 'lainaus' }" onclick="login_modal.showModal()"> 
        Lainaus 
      </button>   
      <NuxtLink to='/palautus'>
        <button class="bg-slate-700 hover:bg-slate-800 py-2 px-6 rounded-lg"> Palautus </button>
      </NuxtLink>    
      <button class="bg-slate-700 hover:bg-slate-800 py-2 px-6 rounded-lg" @click="() => { route = 'tiedot' }" onclick="login_modal.showModal()"> Omat tiedot </button>        
    </div>  

    <dialog id="login_modal" class="modal">
      <div class="modal-box">
        <h3 class="text-lg font-bold">Kirjaudu</h3>
        <div class="flex flex-col gap-4 mt-4">      
          <input placeholder="Kirjastonkortin numero" v-model="memberId" class="w-full focus:outline-0 py-2 px-4 rounded-lg"/>
          <div class="flex gap-4 w-full">
            <button type="submit" class="bg-slate-700 hover:bg-slate-800 py-2 px-6 rounded-lg flex-1" @click="login">Kirjaudu</button>
            <button class="bg-slate-700 hover:bg-slate-800 py-2 px-6 rounded-lg flex-1" onclick="login_modal.close()">Peruuta</button>
          </div>                   
        </div>
      </div>
    </dialog>
  </div>
</template>