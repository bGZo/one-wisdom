<template>
  <div class="container" @click="shuffle">
    <main id="article" v-if="currentQuote">
      <div class="sentence">
        <a :href="currentQuote.path" @click.stop>{{ currentQuote.title }}</a>
      </div>
      <cite>
        <div class="author">{{ currentQuote.author }}</div>
        <div class="source">{{ currentQuote.source }}</div>
        <a class="more" href="#" @click.prevent.stop="shuffle">View Another</a>
      </cite>
    </main>
    <div v-else class="loading">Loading...</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Quote {
  id: string;
  title: string;
  author?: string;
  source?: string;
  path: string;
}

const quotes = ref<Quote[]>([]);
const currentQuote = ref<Quote | null>(null);

// Load the lightweight index
async function loadQuotes() {
  try {
    const res = await fetch('/api/index-min.json');
    if (!res.ok) throw new Error('Failed to load quotes');
    quotes.value = await res.json();
    shuffle();
  } catch (e) {
    console.error(e);
  }
}

function shuffle() {
  if (quotes.value.length === 0) return;
  const randomIndex = Math.floor(Math.random() * quotes.value.length);
  currentQuote.value = quotes.value[randomIndex];
}

onMounted(() => {
  loadQuotes();
});
</script>

<style scoped>
.container {
  text-align: center;
  padding: 2rem;
  max-width: 800px;
  cursor: pointer;
  user-select: none;
}
.sentence {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
  line-height: 1.4;
}
.sentence a {
  color: #333;
  transition: color 0.3s;
}
.sentence a:hover {
  color: #666;
}
.author, .source {
  font-size: 1rem;
  color: #888;
  margin-bottom: 0.5rem;
}
.more {
  display: inline-block;
  margin-top: 2rem;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  color: #aaa;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.more:hover {
  background: #fff;
  color: #333;
  border-color: #333;
}
</style>
