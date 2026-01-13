<template>
  <div class="container">
    <div class="content">
      <main id="article" v-if="currentQuote">
        <div class="sentence-wrapper">
          <div class="quotemark left">“</div>
          <div class="sentence" :style="{ fontSize: fontSize }">
            <a :href="currentQuote.path" @click.stop>{{ currentQuote.title }}</a>
          </div>
          <div class="quotemark right">”</div>
        </div>
        <cite>
          <div class="author">{{ currentQuote.author }}</div>
          <div class="source">
            <a v-if="currentQuote.note" :href="currentQuote.note" target="_blank" class="external-link" @click.stop>
              {{ currentQuote.source }}
            </a>
            <span v-else>{{ currentQuote.source }}</span>
          </div>
        </cite>
      </main>
      <div v-else class="loading">Loading...</div>
    </div>
    
    <footer>
      <div class="footer-left">
        <span>© 2026 <a href="https://bgzo.cc" target="_blank">bGZo</a> · <a href="https://github.com/bGZo/one-wisdom" target="_blank">One Wisdom</a></span>
      </div>
      <div class="footer-right">
         <a class="more" href="#" @click.prevent.stop="shuffle">Next</a>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

interface Quote {
  id: string;
  title: string;
  author?: string;
  source?: string;
  note?: string;
  path: string;
}

const quotes = ref<Quote[]>([]);
const currentQuote = ref<Quote | null>(null);

const fontSize = computed(() => {
  if (!currentQuote.value) return '2rem';
  const len = currentQuote.value.title.length;
  if (len < 10) return '3rem';
  if (len < 30) return '2.5rem';
  if (len < 50) return '2rem';
  return '1.5rem';
});

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
  padding: 2rem;
  max-width: 800px;
  cursor: default;
  user-select: none;
  width: 100%;
  
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 600px;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.sentence-wrapper {
  position: relative;
  margin-bottom: 3rem;
  padding: 0 2rem;
}

.quotemark {
  position: absolute;
  font-family: serif;
  font-size: 6rem;
  color: var(--text-color);
  opacity: 0.1;
  line-height: 1;
  pointer-events: none;
}

.quotemark.left {
  top: -2rem;
  left: -1rem;
}

.quotemark.right {
  bottom: -3rem;
  right: -1rem;
}

.sentence {
  text-align: left;
  font-weight: bold;
  line-height: 1.5;
}
.sentence a {
  color: var(--text-color);
  transition: opacity 0.3s;
  text-decoration: none;
}
.sentence a:hover {
  opacity: 0.7;
}

cite {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-top: 2rem;
  font-style: normal;
}

.author {
  font-size: 1.2rem;
  color: var(--text-color);
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.source {
  font-size: 1rem;
  color: var(--meta-color);
  margin-bottom: 1.5rem;
}

.source a {
  color: var(--meta-color);
  text-decoration: none;
  position: relative;
  transition: color 0.2s;
}

.source a:hover {
  color: var(--text-color);
}

/* External link indicator using CSS pseudo-element icon */
.external-link::after {
  content: " ↗"; 
  font-size: 0.8em;
  opacity: 0.7;
  vertical-align: top;
  margin-left: 2px;
}

footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-top: 2rem;
}

.footer-left {
  opacity: 0;
  transition: opacity 0.3s;
  font-size: 0.9rem;
  color: var(--meta-color);
}

footer:hover .footer-left {
  opacity: 1;
}

.footer-left a {
    color: var(--meta-color);
    text-decoration: none;
}

.footer-left a:hover {
    text-decoration: underline;
}

.more {
  display: inline-block;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  color: var(--meta-color);
  border: 1px solid var(--meta-color);
  border-radius: 4px;
  transition: all 0.2s;
  text-decoration: none;
}
.more:hover {
  background: var(--text-color);
  color: var(--bg-color);
  border-color: var(--text-color);
}

.loading {
  text-align: center;
  color: var(--meta-color);
  margin-top: auto;
  margin-bottom: auto;
}
</style>
