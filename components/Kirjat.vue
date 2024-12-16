<script setup lang="ts">
  import { ref } from 'vue';
  import { createClient } from '~/src/lib/createSupabaseClient';
  import type Book from '~/types/book';

  const supabase = createClient();

  const searchWord = ref<string>('');
  const allBooks = ref();
  const books = ref();
  const pagination = ref<number>(0);

  const { data } = await supabase.from('BooksTable').select('*');

  if (data && data.length > 0) {
    allBooks.value = data;
    books.value = data;
  }

  const search = () => {
    const filtered = allBooks.value.filter((book: Book) => book.title.toLowerCase().includes(searchWord.value.toLowerCase()));
    books.value = filtered;
    pagination.value = 0;
  }
 
</script>

<template>
  <div>
    <div>
      <p>Kirjan nimi</p>
      <div class="flex flex-row w-96 mb-8">
        <input class="w-full focus:outline-0 py-2 px-4 rounded-lg" placeholder="Lord of the rings..." v-model="searchWord"/>
        <button class="bg-slate-700 hover:bg-slate-800 py-2 px-6 rounded-lg" @click="search">Hae</button>
      </div>     
    </div>

    <div class="mb-4 flex flex-row flex-wrap">
      <div v-for="(book, idx) in books.slice(pagination * 40, (pagination * 40) + 40)" :key="idx" class="basis-1/5 p-4 border-2 border-slate-600 text-center">       
        <div class="flex justify-center mb-4">
          <img :src="book.thumbnail" width="180px"/>
        </div>
        <div>
          <p class="text-xl">{{ book.title }}</p>
          <p v-if="book.subtitle" class="text-md text-stone-300 italic">{{ book.subtitle }}</p>
          <p class="mt-2">{{ book.authors.replace(';', ', ') }}</p>
          <p class="mb-2">{{ book.published_year }}</p>
          <p>ID: {{ book.book_id }}</p>
        </div>         
      </div>            
    </div>
    
    <div class="flex justify-center w-full">
      <div className="join">
        <button 
          v-for="page in Math.ceil(books.length / 40)" 
          :key="page" 
          :class="['join-item', 'btn', { 'btn-active': pagination + 1 === page }]"
          @click="pagination = page - 1"
        >
          {{ page }}
        </button>
      </div>
    </div>
  </div>
</template>