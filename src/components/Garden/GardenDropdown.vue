<script setup>
    import { onMounted, ref } from 'vue'
    import api from '../../api';
    import AddGarden from './AddGarden.vue';

    import { useToast } from 'vue-toast-notification';
    import 'vue-toast-notification/dist/theme-sugar.css';
    import toastConfig from '../../assets/toastNotification'; 

    const gardens = ref([])
    const showDropdown = ref(false)
    const selectedGarden = defineModel()
    const showAddGarden = ref(false)
    const loading = ref(false)
    const error = ref(false)
    const $toast = useToast()

    const emit = defineEmits(['gardenSelected']);

    onMounted(() => {
        const fetchGardens = async () => {
            loading.value = true
            try{
                const response = await api.get('/gardens/')
                const fetchedGardens = response.data.data.sort((a, b) => a.name.localeCompare(b.name));
                gardens.value = fetchedGardens
            }
            catch(err){
                if(err.message){
                    $toast.error(`Error fetching gardens: ${err.message}`, toastConfig('error'));
                }
                else{
                    $toast.error('Error fetching gardens', toastConfig('error'));
                }
                error.value = true
            }
            finally{
                loading.value = false;
            }
        }

        fetchGardens();
    });

    const selectGarden = (gardenId) => {
        showDropdown.value = false
        selectedGarden.value = gardens.value.find(g => g._id === gardenId);
    }

    const selectNoGarden = () => {
        showDropdown.value = false
        selectedGarden.value = null
    }

    const handleAddedGarden = (garden) => {
        gardens.value.push(garden);
        gardens.value.sort((a, b) => a.name.localeCompare(b.name));
        showAddGarden.value = false;
    }
</script>

<template>
    <AddGarden 
        v-if="showAddGarden" 
        @close="showAddGarden = false"
        @gardenAdded="handleAddedGarden"
    />
    <div class="garden-dropdown-wrapper">
        <div class="selected-garden" @click="showDropdown = !showDropdown">
            <span v-if="selectedGarden">{{ selectedGarden.name }}</span>
            <span v-else>None</span>
            <i 
                class="pi pi-caret-down" 
                v-if="!showDropdown"
            >
            </i>
            <i 
                class="pi pi-caret-up" 
                v-else="showDropdown"
            >
            </i>
        </div>
        <ol class="garden-dropdown" v-if="showDropdown">
            <li 
                v-for="garden in gardens" 
                :key="garden._id" :value="garden._id"
                @click="selectGarden(garden._id)"
            >
                {{ garden.name }}
            </li>
            <li class="other-option" @click="selectNoGarden">
                <span>None</span>
            </li>
            <li class="other-option" @click="showAddGarden = true">
                <span>New</span>
                <i class="pi pi-plus-circle"></i>
            </li>
            <div v-if="loading">Loading...</div>
            <div v-if="error">Error loading gardens</div>
        </ol>
    </div>
</template>

<style scoped>
    ol{
        display: flex;
        flex-direction: column;
        background-color: white;
        color: black;
        border: 1px solid var(--primary);
        list-style-type: none;
        padding: 0px;
        border-radius: 5px;
    }
    .selected-garden{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        font-size: 1.5rem;
        border: 1px solid var(--primary);
        padding: 4px 8px;
        border-radius: 5px;
    }
    .selected-garden:hover{
        cursor: pointer;
    }
    li{
        box-sizing: border-box;
        padding: 4px 8px;
        font-size: 1.5rem;
        border-bottom: 1px solid black;
    }
    li:nth-last-of-type(1){
        border-bottom: none;
    }
    li:hover{
        cursor: pointer;
        background-color: var(--primary);
        color: white;
    }
    .other-option{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding-right: 8px;
        background-color: rgb(224, 223, 223);
    }
    i{
        color: var(--primary);
    }
</style>