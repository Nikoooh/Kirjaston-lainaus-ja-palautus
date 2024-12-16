<script setup lang="ts">
  import { ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { createClient } from '~/src/lib/createSupabaseClient';
  import { add, format } from 'date-fns';
  import type Book from '~/types/book';

  const supabase = createClient();

  const route = useRoute();
  const router = useRouter();
  const memberId = route.params.memberId;
  const { data } = await supabase.from('MembersTable').select('*').eq('member_id', memberId).single(); 

  const nimi = ref('')
  const kirjaId = ref('')
  const books = ref<Book[]>([])

  if (data) {
    nimi.value = `${data.first_name} ${data.last_name}`;  
  }

  const getBook = async () => {
    const { data } = await supabase.from('BooksTable').select('*').eq('book_id', kirjaId.value).single();
    if (data) {
      books.value.push(data);
    } 
  }

  const loan = async () => {
    const { data: transactions } = await supabase.from('TransactionsTable').select('*');
    if (!transactions) return;

    const date = String(format(new Date(), 'yyyy-MM-dd'))
    const dueDate = String(format(add(new Date(), { days: 28 }), 'yyyy-MM-dd'))
    const { error } = await supabase.from('TransactionsTable')
      .insert({transaction_id: transactions.length + 1, 
        book_id: kirjaId.value, 
        member_id: memberId, 
        issue_date: date, 
        due_date: dueDate, 
        return_date: null, 
        status: 'active', 
        late_fee: '0', 
        days_late: 0
      })
    
    if (!error) {
      router.push('/')
    }
  }

</script>

<template>
  <div class="py-8 px-12">
    <div class="mb-4">
      <p class="text-2xl">Lainaus</p>
    </div>
    <div class="mb-8 text-xl">
      <p class="text-lg">Tervetuloa lainamaan, {{ nimi }}</p> 
    </div>   
    <div class="flex flex-row w-96 mb-8">
      <input class="w-full focus:outline-0 py-2 px-4 rounded-lg" placeholder="Lainattavan kirjan id" type="text" v-model="kirjaId"/>
      <button class="bg-slate-700 hover:bg-slate-800 py-2 px-6 rounded-lg" @click="getBook">Lisää</button>
    </div>
    <div v-if="books && books.length > 0" class="mb-8">    
      <ul v-for="(book, idx) in books" :key="idx" class="mb-6">
        <p class="text-xl mb-2">{{ idx + 1 }}. {{ book.title }}</p>
        <p>{{ book.authors }}</p>
        <p>{{ book.published_year }}</p>
        <p>{{ book.categories }}</p>
        <p>Eräpäivä: {{ format(add(new Date(), { days: 28 }), 'yyyy-MM-dd') }}</p>
      </ul>
      <div class="flex flex-row gap-4">      
        <button class="bg-slate-700 hover:bg-slate-800 py-2 px-6 rounded-lg" @click="loan">Valmis, tulosta kuitti</button>              
        <button class="bg-slate-700 hover:bg-slate-800 py-2 px-6 rounded-lg" @click="loan">Valmis, ei kuittia</button>    
      </div>
    </div>
    <div>
      <div class="mb-4">
        <p class="text-xl">Hae kirjoja</p>
      </div>
      <Kirjat />
    </div>
  </div>
</template>