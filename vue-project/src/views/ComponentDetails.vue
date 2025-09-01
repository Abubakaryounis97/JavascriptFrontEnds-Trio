<template>
  <div v-if="component">
    <h1>{{ component.type }}</h1>
    <p>{{ component.description }}</p>
    <button @click="$router.back()">Back</button>
    <button @click="showEdit = true">Edit Component</button>
    <button @click="deleteComponent">Delete Component</button>

    <div v-if="showEdit" class="modal">
      <div class="modal-content">
        <span @click="showEdit = false" class="close-button">&times;</span>
        <h2>Edit Component</h2>
        <input v-model="editComponent.type" placeholder="Type" />
        <textarea v-model="editComponent.description" placeholder="Description"></textarea>
        <button @click="editComponentSubmit">Save</button>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from '../api'

export default {
  data() {
    return {
      component: null,
      showEdit: false,
      editComponent: { type: '', description: '' }
    }
  },
  async mounted() {
    const id = this.$route.params.id
    const res = await api.get(`/components/${id}`)
    this.component = res.data
    this.editComponent = { type: res.data.type, description: res.data.description }
  },
  methods: {
    async deleteComponent() {
      await api.delete(`/components/${this.component.id}`)
      this.$router.back()
    },
    async editComponentSubmit() {
      const res = await api.put(`/components/${this.component.id}`, this.editComponent)
      this.component = res.data
      this.showEdit = false
    }
  }
}
</script>
