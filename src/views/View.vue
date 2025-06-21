<script setup>
    import { computed, ref, onMounted } from 'vue';
    import { useToast } from 'vue-toast-notification';
    import 'vue-toast-notification/dist/theme-sugar.css';
    import toastConfig from '../assets/toastNotification';

    import api from '../api.js'
    import isAuthenticated from '../router/isAuthenticated';
    import PlantCard from '../components/PlantCard.vue';

    const plants = ref([])
    const mode = ref('name')
    const order = ref('descending')
    const editing = ref(false)
    const isLoggedIn = ref(isAuthenticated())
    const $toast = useToast()

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
    }
    const toggleEdit = () => {
        editing.value = !editing.value;
    };

</script>

<template>
    <div id="wrapper">
        <nav :class="isLoggedIn ? 'space-between' : 'view-mode'">
            <div id="edit-wrapper" v-if="isLoggedIn">
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
        <div class="grid">
            <PlantCard 
                v-for="(plant, index) in sorted_plants" 
                :key="index" 
                :_id="plant._id"
                :name="plant.name" 
                :species="plant.species" 
                :description="plant.description"
                :edit="editing"
            />
        </div>
    </div>
</template>

<style scoped>
    #wrapper{
        display: flex;
        flex-direction: column;
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
</style>