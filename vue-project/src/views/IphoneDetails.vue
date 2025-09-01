<template>
  <div>
    <!-- Buttons -->
    <button @click="goBack">Back to iPhones</button>
    <button id="deleteButton" @click="deleteIphone">Delete iPhone</button>
    <button @click="editIphone">Edit iPhone</button>

    <!-- iPhone Details -->
    <h1>iPhone Details</h1>
    <div id="iphoneDetails">
      <p><strong>ID:</strong> {{ iphone.id }}</p>
      <p><strong>Full Name:</strong> {{ iphone.model }}</p>
      <p><strong>Release Year:</strong> {{ iphone.releaseYear }}</p>
    </div>

    <!-- Edit iPhone Modal -->
    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <span class="close-button" @click="showEditModal = false">&times;</span>
        <h2>Edit iPhone</h2>
        <table>
          <tr>
            <td>Model:</td>
            <td><input v-model="editModel" placeholder="iPhone Model" /></td>
          </tr>
          <tr>
            <td>Release Year:</td>
            <td><input type="number" v-model="editYear" placeholder="Release Year" /></td>
          </tr>
        </table>
        <button @click="confirmEdit">Save Changes</button>
      </div>
    </div>

    <!-- Components Section -->
    <h3>Components</h3>
    <button @click="fetchComponents">Show Components</button>
    <button @click="addComponent">Add Component</button>

    <!-- Components List -->
    <ul v-if="showComponents">
      <li v-for="component in components" :key="component.id" @click="viewComponent(component)">
        <strong> {{ component.type }}</strong> 
      </li>
    </ul>

    <!-- Add Component Modal -->
    <div v-if="showAddComponentModal" class="modal">
      <div class="modal-content">
        <span class="close-button" @click="showAddComponentModal = false">&times;</span>
        <h2>Add New Component</h2>
        <table>
          <tr>
            <td>Name:</td>
            <td><input v-model="newComponentName" placeholder="Component Name" /></td>
          </tr>
          <tr>
            <td>Type:</td>
            <td><input v-model="newComponentType" placeholder="Component Type" /></td>
          </tr>
          <tr>
            <td>Specs:</td>
            <td><input v-model="newComponentSpecs" placeholder="Component Specs" /></td>
          </tr>
        </table>
        <button @click="confirmAddComponent">Add Component</button>
      </div>
    </div>

    <!-- Component Details Modal -->
    <div v-if="showComponentDetailModal" class="modal">
      <div class="modal-content">
        <span class="close-button" @click="showComponentDetailModal = false">&times;</span>
        <h2>Component Details</h2>
        <p><strong>ID:</strong> {{ selectedComponent.id }}</p>
        <p><strong>Name:</strong> {{ selectedComponent.name }}</p>
        <p><strong>Type:</strong> {{ selectedComponent.type }}</p>
        <p><strong>Specs:</strong> {{ selectedComponent.specs }}</p>
        <button @click="editComponent(selectedComponent)">Edit Component</button>
        <button @click="deleteComponent(selectedComponent)" style="background-color: red;">Delete Component</button>
      </div>
    </div>

    <!-- Edit Component Modal -->
    <div v-if="showEditComponentModal" class="modal">
      <div class="modal-content">
        <span class="close-button" @click="showEditComponentModal = false">&times;</span>
        <h2>Edit Component</h2>
        <table>
          <tr>
            <td>Name:</td>
            <td><input v-model="editComponentName" /></td>
          </tr>
          <tr>
            <td>Type:</td>
            <td><input v-model="editComponentType" /></td>
          </tr>
          <tr>
            <td>Specs:</td>
            <td><input v-model="editComponentSpecs" /></td>
          </tr>
        </table>
        <button @click="confirmEditComponent">Save Changes</button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

// Routing
const route = useRoute()
const router = useRouter()
const iphoneId = route.params.id

// Reactive state
const iphone = ref({})
const components = ref([])
const showComponents = ref(false)

// Edit iPhone modal
const showEditModal = ref(false)
const editModel = ref('')
const editYear = ref('')

// Add Component modal
const showAddComponentModal = ref(false)
const newComponentName = ref('')
const newComponentType = ref('')
const newComponentSpecs = ref('')

// Component details modal
const showComponentDetailModal = ref(false)
const selectedComponent = ref({})

// Edit Component modal
const showEditComponentModal = ref(false)
const editComponentName = ref('')
const editComponentType = ref('')
const editComponentSpecs = ref('')

// Fetch iPhone details
const fetchIphone = async () => {
  try {
    const res = await axios.get(`http://localhost:8080/iphones/${iphoneId}`)
    iphone.value = res.data
  } catch (err) {
    console.error('Failed to fetch iPhone:', err)
    alert('Failed to load iPhone details.')
  }
}

// Fetch components for this iPhone
const fetchComponents = async () => {
  try {
    const res = await axios.get(`http://localhost:8080/components/iphone/${iphoneId}`)
    components.value = res.data || []
    showComponents.value = true
  } catch (err) {
    console.error('Failed to fetch components:', err)
    alert('Failed to fetch components.')
  }
}

// Navigation
const goBack = () => router.push('/')

// Delete iPhone
const deleteIphone = async () => {
  if (confirm('Are you sure you want to delete this iPhone?')) {
    try {
      await axios.delete(`http://localhost:8080/iphones/${iphoneId}`)
      alert('iPhone deleted successfully!')
      router.push('/')
    } catch (err) {
      console.error(err)
      alert('Failed to delete iPhone.')
    }
  }
}

// Edit iPhone
const editIphone = () => {
  editModel.value = iphone.value.model
  editYear.value = iphone.value.releaseYear
  showEditModal.value = true
}

const confirmEdit = async () => {
  try {
    const updatedData = {
      model: editModel.value,
      releaseYear: parseInt(editYear.value)
    }
    await axios.put(`http://localhost:8080/iphones/${iphoneId}`, updatedData)
    iphone.value.model = editModel.value
    iphone.value.releaseYear = parseInt(editYear.value)
    showEditModal.value = false
    alert('iPhone updated successfully!')
  } catch (err) {
    console.error(err)
    alert('Failed to update iPhone.')
  }
}

// Add Component
const addComponent = () => {
  newComponentName.value = ''
  newComponentType.value = ''
  newComponentSpecs.value = ''
  showAddComponentModal.value = true
}

const confirmAddComponent = async () => {
  if (!newComponentName.value.trim() || !newComponentType.value.trim() || !newComponentSpecs.value.trim()) {
    alert('Please fill in all fields.')
    return
  }

  try {
    const componentData = {
      name: newComponentName.value.trim(),
      type: newComponentType.value.trim(),
      specs: newComponentSpecs.value.trim(),
      iphone_id: parseInt(iphoneId)
    }
    const res = await axios.post(`http://localhost:8080/components`, componentData)
    components.value.push(res.data)
    showAddComponentModal.value = false
    alert('Component added successfully!')
  } catch (err) {
    console.error(err)
    alert('Failed to add component.')
  }
}

// View Component Details
const viewComponent = (component) => {
  selectedComponent.value = { ...component }
  showComponentDetailModal.value = true
}

// Edit Component
const editComponent = (component) => {
  editComponentName.value = component.name
  editComponentType.value = component.type
  editComponentSpecs.value = component.specs
  selectedComponent.value = { ...component }
  showComponentDetailModal.value = false
  showEditComponentModal.value = true
}

// Confirm Edit Component
const confirmEditComponent = async () => {
  try {
    const updatedData = {
      name: editComponentName.value.trim(),
      type: editComponentType.value.trim(),
      specs: editComponentSpecs.value.trim(),
      iphone_id: parseInt(iphoneId)
    }
    const res = await axios.put(`http://localhost:8080/components/${selectedComponent.value.id}`, updatedData)
    const idx = components.value.findIndex(c => c.id === selectedComponent.value.id)
    if (idx !== -1) components.value[idx] = { ...res.data }
    selectedComponent.value = { ...res.data }
    showEditComponentModal.value = false
    alert('Component updated successfully!')
  } catch (err) {
    console.error(err)
    alert('Failed to update component.')
  }
}

// Delete Component
const deleteComponent = async (component) => {
  if (confirm('Are you sure you want to delete this component?')) {
    try {
      await axios.delete(`http://localhost:8080/components/${component.id}`)
      components.value = components.value.filter(c => c.id !== component.id)
      showComponentDetailModal.value = false
      alert('Component deleted successfully!')
    } catch (err) {
      console.error(err)
      alert('Failed to delete component.')
    }
  }
}

onMounted(fetchIphone)
</script>

<style scoped>
/* Modal styles */
.modal {
  display: block;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.5);
}
.modal-content {
  background-color: #fefefe;
  margin: 100px auto;
  padding: 20px;
  border: 1px solid #888;
  width: 300px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
.close-button {
  float: right;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  color: #aaa;
}
.close-button:hover { color: #000; }
button { margin: 4px; padding: 8px 12px; border-radius: 4px; cursor: pointer; }
#deleteButton { background-color: red; color: white; }
ul { list-style: none; padding: 0; }
li { padding: 8px; border: 1px solid #ddd; margin: 4px 0; cursor: pointer; }
#iphoneDetails { background: #f8f9fa; padding: 15px; border-radius: 8px; border: 1px solid #dee2e6; margin: 15px 0; }
input { width: 100%; padding: 6px; margin: 2px 0; }
</style>
