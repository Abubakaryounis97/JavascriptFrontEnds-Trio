<template>
  <div>
    <h1>iPhones</h1>
    <input v-model="search" placeholder="Search by name or ID" />

    <button id="addIphoneButton" @click="showAdd = true">Add iPhone</button>

    <ul>
      <li v-for="iphone in filteredIphones" :key="iphone.id">
        <router-link :to="`/iphone/${iphone.id}`">
         ID: {{ iphone.id }} - {{ iphone.model }}
        </router-link>
      </li>
    </ul>

    <!-- Add iPhone Modal -->
    <div v-if="showAdd" class="modal">
      <div class="modal-content">
        <span @click="showAdd = false" class="close-button">&times;</span>
        <h2>Add iPhone</h2>
        <input v-model="newIphone.model" placeholder="Model" />
        <input type="number" v-model="newIphone.year" placeholder="Year" />
        <button @click="addIphone">Add</button>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from '../api'

export default {
  data() {
    return {
      iphones: [],
      search: '',
      showAdd: false,
      newIphone: { model: '', year: null }
    }
  },
  computed: {
    filteredIphones() {
      if (!this.search) return this.iphones
      return this.iphones.filter(i =>
        i.model.toLowerCase().includes(this.search.toLowerCase()) ||
        i.id.toString() === this.search
      )
    }
  },
  async mounted() {
    await this.loadIphones()
  },
  methods: {
    async loadIphones() {
      const res = await api.get('/iphones')
      this.iphones = res.data
    },
    async addIphone() {
      const res = await api.post('/iphones', this.newIphone)
      this.iphones.push(res.data)
      this.showAdd = false
      this.newIphone = { model: '', year: null }
    },
 
  }
}
</script>
