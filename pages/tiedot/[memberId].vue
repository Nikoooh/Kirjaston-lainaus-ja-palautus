<script setup lang="ts">
  import { createClient } from '~/src/lib/createSupabaseClient';
  import { useRoute } from 'vue-router';
  import { ref } from 'vue';
  import type Member from '~/types/member';

  const router = useRoute();
  const supabase = createClient();
  const memberId = router.params.memberId;
  
  const { data } = await supabase.from('MembersTable').select('*').eq('member_id', memberId).single();
  const { data: booksData } = await supabase.from('TransactionsTable')
    .select('due_date, status, days_late, BooksTable(title, authors, categories, published_year)')
    .eq('member_id', memberId)
    .neq('status', 'returned');
  

  const formRef = ref();
  const member = ref<Member>();
  const books = ref();

  if (data) {
    member.value = data;
  }

  if (booksData) {
    books.value = booksData
  }

  const handleEdit = async () => {
    const { data } = await supabase.from('MembersTable')
      .update({'first_name': formRef.value.etunimi.value, 'last_name': formRef.value.sukunimi.value, 'email': formRef.value.email.value, 'phone': formRef.value.puh.value})
      .eq('member_id', memberId)
      .select('*')
      .single();
    if (data) {
      member.value = data;
    }
  }

</script>

<template>
  <div class="py-8 px-12">
    <div class="mb-4 text-xl">
      <p>Omat tiedot</p> 
    </div> 
    <div v-if="member" class="mb-4">
      <p class="text-lg">{{ member.first_name }} {{ member.last_name }}</p>   
      <p>{{ member?.email }}</p>
      <p>{{ member?.phone }}</p>
      <p>Käyttäjä ID: {{ member?.member_id }}</p>
    </div>

    <div class="mb-4">
      <button class="bg-slate-700 hover:bg-slate-800 py-2 px-6 rounded-lg" onclick="edit_modal.showModal()">Muokkaa tietoja</button>
    </div>

    <div>    
      <div v-if="books && books.length > 0">
        <div class="mb-4">
          <p class="text-xl" v-if="books && books.length > 0">Lainatut kirjat</p>
        </div>
        <ul v-for="(book, idx) in books" :key="idx" class="mb-6">
          <p class="text-xl mb-2">{{ idx + 1 }}. {{ book.BooksTable.title }}</p>
          <p>{{ book.BooksTable.authors }}</p>
          <p>{{ book.BooksTable.published_year }}</p>
          <p>{{ book.BooksTable.categories }}</p>
          <p>Eräpäivä: {{ book.due_date}}</p>
          <div v-if="book.status === 'late'" class="text-red-600 font-bold text-lg mt-2">
            <p>Palautus myöhässä!</p>
            <p>Summa: {{ Math.min(book.days_late * 0.30, 6).toFixed(2) }}€</p>
          </div>
        </ul>
      </div>
      <div v-else class="mb-4">
        <p class="text-xl">Ei lainoja</p>
      </div>
    </div>

    <dialog v-if="member" id="edit_modal" class="modal">
      <div class="modal-box">
        <p class="text-lg font-bold">Muokkaa tietoja</p>
        <div class="flex flex-col gap-4 mt-4">   
          <form ref="formRef" class="flex flex-col gap-2">
            <div class="flex flex-row gap-2">
              <input class="flex-1 focus:outline-0 py-2 px-4 rounded-lg" type="text" name="etunimi" placeholder="Etunimi" :value="member.first_name">
              <input class="flex-1 focus:outline-0 py-2 px-4 rounded-lg"type="text" name="sukunimi" placeholder="Sukunimi" :value="member.last_name"/>
            </div>

            <input class="flex-1 focus:outline-0 py-2 px-4 rounded-lg" type="text" name="email" placeholder="Sähköpostiosoite" :value="member.email"/>
            <input class="flex-1 focus:outline-0 py-2 px-4 rounded-lg" type="text" name="puh" placeholder="Puhelinnumero" :value="member.phone"/>
                    
          </form>
          <div class="flex gap-4 w-full">
            <button type="submit" class="bg-slate-700 hover:bg-slate-800 py-2 px-6 rounded-lg flex-1" @click="handleEdit" onclick="edit_modal.close()">Tallenna</button>
            <button class="bg-slate-700 hover:bg-slate-800 py-2 px-6 rounded-lg flex-1" onclick="edit_modal.close()">Peruuta</button>
          </div>                   
        </div>
      </div>
    </dialog>
  </div>
</template>