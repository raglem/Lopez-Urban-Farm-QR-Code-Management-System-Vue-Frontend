<script setup>
    import { computed, ref, onMounted } from 'vue';
    import { useToast } from 'vue-toast-notification';
    import { storeToRefs } from 'pinia';
    import 'vue-toast-notification/dist/theme-sugar.css';
    import toastConfig from '../assets/toastNotification';

    import api from '../api.js'
    import Loading from '../components/Loading.vue';
    import PlantCard from '../components/PlantCard.vue';
    import { useUserStore } from '../stores/user.js';

    const plants = ref([])
    const mode = ref('name')
    const order = ref('descending')
    const editing = ref(false)
    const loading = ref(false)
    const $toast = useToast()
    const store = useUserStore()
    const { isAuthenticated } = storeToRefs(store)

    onMounted(() => {
        fetchPlants()
    })

    const sorted_plants = computed(() => {
        const sorted = [...plants.value];
        if (mode.value === 'name') {
            sorted.sort((a, b) => a.name.localeCompare(b.name));
        }
        else{
            sorted.sort((a, b) => a.species.localeCompare(b.species))
        }
        if (order.value === 'ascending') {
            sorted.reverse();
        }
        return sorted;
    });
    const fetchPlants = async () => {
        loading.value = true
        try{
            const response = await api.get('/plants/')
            plants.value = response.data.data
        }
        catch(err){
            if(err.message){
                $toast.error(`Error fetching plants: ${err.message}`, toastConfig('error'));
            }
            else{
                $toast.error('Error fetching plants', toastConfig('error'));
            }
        }
        finally{
            loading.value = false
        }
    }
    const handleDeletedPlant = (id) => {
        plants.value = plants.value.filter(plant => plant._id !== id);
    };
    const toggleEdit = () => {
        editing.value = !editing.value;
    };

</script>

<template>
    <div id="wrapper">
        <nav :class="isAuthenticated ? 'space-between' : 'view-mode'">
            <div id="edit-wrapper" v-if="isAuthenticated">
                <button id="edit-btn" @click="toggleEdit">
                    <div v-if="!editing">
                        <span>Edit</span>
                        <i class="pi pi-cog"></i>
                    </div>
                    <span v-else>Done</span>
                </button>
            </div>
            <div>
                <label class="switch">
                    <button id="name" :class="(mode === 'name') ? 'active' : 'inactive'" @click="mode = 'name'">Name</button>
                    <button id="species" :class="(mode === 'species') ? 'active' : 'inactive'" @click="mode = 'species'">Species</button>
                </label>
                <i :class="(order === 'descending') ? 'pi pi-arrow-up' : 'pi pi-arrow-down'" @click="order = (order === 'descending') ? 'ascending' : 'descending'"></i>
            </div>
        </nav>
        <div class="grid" v-if="!loading">
            <PlantCard 
                v-for="(plant, index) in sorted_plants" 
                @delete-plant="handleDeletedPlant"
                :key="index" 
                :_id="plant._id"
                :name="plant.name" 
                :species="plant.species" 
                :description="plant.description"
                :image="plant?.image?.url"
                :edit="editing"
            />
        </div>
        <div class="loading-wrapper" v-else>
            <Loading />
        </div>
    </div>
</template>

<style scoped>
    #wrapper{
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 20px;
        row-gap: 20px;
    }
    nav{
        display: flex;
        justify-content: flex-end;
        align-items: center;
        column-gap: 20px;
    }
    nav.space-between{
        justify-content: space-between;
    }
    nav div{
        display: flex;
        align-items: center;
        column-gap: 5px;
    }
    nav > .edit-wrapper{
        font-size: 1.5rem;
        color: var(--primary);
    }
    i {
        cursor: pointer;
    }
    .grid{
        display: grid;
        grid-template-columns: repeat(1, 1fr);
        gap: 20px;
    }

    #edit-btn, .switch button{
        text-align: center;
        width: 75px;
        font-size: 1rem;
        border: 1px solid black;
    }
    #edit-btn div{
        display: flex;
        justify-content: space-evenly;
    }
    .switch button.active{
        font-size: 1rem;
        border: 1px solid black;
        background-color: lightgray;
    }
    .switch button.inactive{
        font-size: 1rem;
        border: 1px solid black;
        background-color: white;
    }
    .switch #date{
        border-right: 1px solid black;
    }
    @media (min-width: 768px) {
        .grid{
            grid-template-columns: repeat(2, 1fr);
        }
    }
    @media (min-width: 1024px) {
        .grid{
            grid-template-columns: repeat(3, 1fr);
        }
    }
    .loading-wrapper{
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
    }
</style>