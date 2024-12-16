<script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { format } from 'date-fns';
  import { createClient } from '~/src/lib/createSupabaseClient';
  import type { TransactionsWithBookData } from '~/types/transactions';

  const supabase = createClient();

  const kirjaId = ref('')
  const router = useRouter();
  
  const books = ref<TransactionsWithBookData[]>([])

  const getBook = async (): Promise<void> => {
    const { data } = await supabase.from('TransactionsTable')
      .select('*, BooksTable(title, authors, categories, published_year)')
      .eq('book_id', kirjaId.value)
      .neq('status', "returned")
      .single();
    
    if (data) {
      books.value.push(data);
    } 
  }

  const returnBooks = async (): Promise<void> => {
    const date = format(new Date(), 'yyyy-MM-dd');
    await Promise.all(
      books.value.map((book: TransactionsWithBookData) => 
        supabase.from('TransactionsTable').update({'return_date': date, 'status': 'returned'}).eq('book_id', book.book_id)          
      )
    )    
    router.push('/')
  }
</script>

<template>
  <div class="py-8 px-12">
    <div class="mb-4">
      <p class="text-2xl">Palautus</p>
    </div>
    <div class="flex flex-row w-96 mb-8">
      <input class="w-full focus:outline-0 py-2 px-4 rounded-lg" placeholder="Palautettavan kirjan id" type="text" v-model="kirjaId"/>
      <button class="bg-slate-700 hover:bg-slate-800 py-2 px-6 rounded-lg" @click="getBook">Palauta</button>
    </div>
    <div v-if="books && books.length > 0">    
      <ul v-for="(book, idx) in books" :key="idx" class="mb-6">
        <p class="text-xl mb-2">{{ idx + 1 }}. {{ book.BooksTable.title }}</p>
        <p>{{ book.BooksTable.authors }}</p>
        <p>{{ book.BooksTable.published_year }}</p>
        <p>{{ book.BooksTable.categories }}</p>
        <p v-if="book.status === 'late'" class="text-red-600 font-bold text-lg mt-2">Palautus myöhässä!</p>
      </ul>
      <div class="flex flex-row gap-4 w-96">       
        <button class="bg-slate-700 hover:bg-slate-800 py-2 px-6 rounded-lg flex-1" @click="returnBooks">Valmista</button>          
      </div>
    </div>
  </div>
</template>