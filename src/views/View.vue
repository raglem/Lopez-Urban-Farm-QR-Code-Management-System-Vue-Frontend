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
    import { useRouter } from 'vue-router';

    const plants = ref([])
    const mode = ref('name')
    const order = ref('descending')
    const editing = ref(false)
    const loading = ref(false)
    const router = useRouter()
    const $toast = useToast()
    const store = useUserStore()
    const { isAuthenticated } = storeToRefs(store)

    onMounted(() => {
        fetchPlants()
    })

    const name_sorted_plants = computed(() => {
        const visiblePlants = plants.value.filter(p => p.visibility !== false);
        const invisiblePlants = plants.value.filter(p => p.visibility === false);

        visiblePlants.sort((a, b) => a.name.localeCompare(b.name));
        invisiblePlants.sort((a, b) => a.name.localeCompare(b.name));

        if(order.value === 'ascending') {
            visiblePlants.reverse();
            invisiblePlants.reverse();
        }
        return [...visiblePlants, ...invisiblePlants];
    });

    const garden_categorized_plants = computed(() => {
        let gardens = []
        plants.value.forEach(p => {
            // If the plant does not have a garden, continue
            if(!p.garden){
                return
            }
            // If the garden is already in the gardens array, continue
            const gardenIndex = gardens.findIndex(g => g.id === p.garden._id);
            if(gardenIndex >= 0){
                return
            }
            // If the garden is not in the gardens array, add it
            gardens.push({
                _id: p.garden._id,
                name: p.garden.name,
                plants: []
            })
        })

        // Sort gardens by name
        gardens.sort((a, b) => a.name.localeCompare(b.name));
        if(order.value === 'ascending') {
            gardens.reverse();
        }

        // Add a "No Garden" entry if there are plants without a garden
        if(plants.value.some(p => !p.garden)){
            gardens.push({
                _id: 'no-garden',
                name: 'No Garden',
                plants: []
            })
        }
        plants.value.forEach((p) => {
            if (!p.garden) {
                const noGarden = gardens[gardens.length - 1]
                noGarden.plants.push(p)
            }
            else{
                const gardenIndex = gardens.findIndex(g => g._id === p.garden._id);
                gardens[gardenIndex].plants.push(p);
            }
        })

        // Sort plants in each garden by name and visibility
        gardens = gardens.map(garden => {
            const visiblePlants = garden.plants.filter(p => p.visibility !== false);
            const invisiblePlants = garden.plants.filter(p => p.visibility === false);

            visiblePlants.sort((a, b) => a.name.localeCompare(b.name));
            invisiblePlants.sort((a, b) => a.name.localeCompare(b.name));

            return {...garden, plants: [...visiblePlants, ...invisiblePlants]};
        })
        
        if(order === 'ascending'){
            gardens.reverse()
        }
        return gardens
    })

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
    const handleToggledVisibility = (id, visibility) => {
        const toggledPlantIndex = plants.value.findIndex(plant => plant._id === id)
        if (toggledPlantIndex !== -1) {
            // Create a shallow copy of the array to trigger reactivity
            const updatedPlants = [...plants.value]

            updatedPlants[toggledPlantIndex] = {
                ...updatedPlants[toggledPlantIndex],
                visibility: visibility,
            }
            plants.value = updatedPlants
        }
        
    }
    const toggleEdit = () => {
        editing.value = !editing.value;
    };

</script>

<template>
    <div id="wrapper">
        <nav :class="isAuthenticated ? 'space-between' : 'view-mode'">
            <div id="edit-wrapper" v-if="isAuthenticated">
                <div class="btn-group" v-if="!editing">
                    <button id="edit-btn" @click="toggleEdit">
                        <span>Edit</span>
                        <i class="pi pi-cog"></i>
                    </button>
                    <button id="add-garden-btn" @click="toggleEdit" v-if="mode === 'garden'">
                        <span>Add Garden</span>
                        <i class="pi pi-plus"></i>
                    </button>
                </div>
                <button id="done-btn" v-else>
                    <span @click="editing = false">Done</span>
                </button>
            </div>
            <div>
                <label class="switch">
                    <button id="name" :class="(mode === 'name') ? 'active' : 'inactive'" @click="mode = 'name'">Name</button>
                    <button id="garden" :class="(mode === 'garden') ? 'active' : 'inactive'" @click="mode = 'garden'">Garden</button>
                </label>
                <i :class="(order === 'descending') ? 'pi pi-arrow-up' : 'pi pi-arrow-down'" @click="order = (order === 'descending') ? 'ascending' : 'descending'"></i>
            </div>
        </nav>
        <div class="grid" v-if="!loading && mode==='name'">
            <PlantCard 
                v-for="plant in name_sorted_plants" 
                @delete-plant="handleDeletedPlant"
                @toggle-visibility="handleToggledVisibility"
                :key="plant._id" 
                :_id="plant._id"
                :name="plant.name" 
                :species="plant.species" 
                :description="plant.description"
                :garden="plant.garden"
                :visibility="plant.visibility"
                :image="plant?.image?.url"
                :edit="editing"
            />
        </div>
        <div 
            class="gardens-wrapper"
            v-if="!loading && mode==='garden'" 
            v-for="garden in garden_categorized_plants" :key="garden._id"
        >
            <header>
                <h2 class="link" @click="router.push(`/garden/${garden._id}`)">{{ garden.name }}</h2>
                <i class="pi pi-pencil" @click="router.push(`/garden/edit/${garden._id}`)" v-if="editing"></i>
            </header>
            <div class="grid">
                <PlantCard 
                    v-for="plant in garden.plants" 
                    @delete-plant="handleDeletedPlant"
                    @toggle-visibility="handleToggledVisibility"
                    :key="plant._id" 
                    :_id="plant._id"
                    :name="plant.name" 
                    :species="plant.species" 
                    :description="plant.description"
                    :garden="plant.garden"
                    :visibility="plant.visibility"
                    :image="plant?.image?.url"
                    :edit="editing"
                />
            </div>
        </div>
        <div class="loading-wrapper" v-if="loading">
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
    .gardens-wrapper{
        display: flex;
        flex-direction: column;
        row-gap: 20px;
    }
    .gardens-wrapper > header{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid black;
        width: 100%;
    }
    .gardens-wrapper > header > h2{
        font-size: 1.5rem;
        color: black;
        margin: none;
    }
    .gardens-wrapper > header > i{
        font-size: 1.2rem;
        opacity: 80%;
        color: var(--primary);
        cursor: pointer;
    }
    .btn-group{
        display: flex;
        flex-direction: row;
        column-gap: 0px;
    }
    .switch{
        display: flex;
    }
    .btn-group button, .switch button{
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2px 10px;
        border: 1px solid black;
        column-gap: 10px;
    }
    #add-garden-btn{
        border-left: none;
    }
    #done-btn{
        border: 1px solid black;
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
    #garden{
        border-left: none;
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
    .link:hover{
        cursor: pointer;
        text-decoration: underline;
        color: var(--primary);
    }
</style>