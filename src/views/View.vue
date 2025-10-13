<script setup>
    import { computed, ref, onMounted } from 'vue';
    import { useToast } from 'vue-toast-notification';
    import { storeToRefs } from 'pinia';
    import 'vue-toast-notification/dist/theme-sugar.css';
    import toastConfig from '../assets/toastNotification';

    import api from '../api.js'
    import AddGarden from '../components/Garden/AddGarden.vue';
    import Loading from '../components/Loading.vue';
    import PlantCard from '../components/PlantCard.vue';
    import { useUserStore } from '../stores/user.js';
    import { useRouter } from 'vue-router';
    import Banner from '../components/Banner.vue';

    const plants = ref([])
    const gardens = ref([])

    const store = useUserStore()
    const { isAuthenticated } = storeToRefs(store)

    const mode = ref('name')
    const order = ref('descending')
    const editing = ref(false)
    const addingGarden = ref(false)
    let gardensMarkedForDeletion = []


    const loading = ref(false)
    const router = useRouter()
    const $toast = useToast()

    onMounted(() => {
        const fetchAll = async () => {
            loading.value = true
            await Promise.all([fetchPlants(), fetchGardens()])
            loading.value = false
        }
        fetchAll()
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

    const garden_sorted_plants = computed(() => {
        let tmp = gardens.value.map(garden => {
            const visiblePlants = garden.plants.filter(p => p.visibility !== false)
            const invisiblePlants = garden.plants.filter(p => p.visibility === false)
            
            visiblePlants.sort((a, b) => a.name.localeCompare(b.name));
            invisiblePlants.sort((a, b) => a.name.localeCompare(b.name));

            return { ...garden, plants: [...visiblePlants, ...invisiblePlants] }
        })
        tmp.sort((a, b) => a.name.localeCompare(b.name))

        if(order.value === 'ascending') {
            tmp.reverse()
        }

        if(!plants.value)   return tmp

        // Handle plants without a garden
        const unassigned_plants = plants.value.filter(p => !p.garden)
        if(unassigned_plants.length > 0) {
            const visiblePlants = unassigned_plants.filter(p => p.visibility !== false).sort((a, b) => a.name.localeCompare(b.name))
            const invisiblePlants = unassigned_plants.filter(p => p.visibility === false).sort((a, b) => a.name.localeCompare(b.name))
            tmp.push({
                _id: 'no-garden',
                name: 'No Garden',
                plants: [...visiblePlants, ...invisiblePlants],
            })
        }
        return tmp
    })

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

    const fetchGardens = async () => {
        try{
            const response = await api.get('/gardens/full/')
            gardens.value = response.data.data
        }
        catch(err){
            if(err.message){
                $toast.error(`Error fetching gardens: ${err.message}`, toastConfig('error'));
            }
            else{
                $toast.error('Error fetching gardens', toastConfig('error'));
            }
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
    const handleNewGarden = (garden) => {
        gardens.value.push(garden);
        gardens.value.sort((a, b) => {
            if(a.id === 'no-garden') return 1
            if(b.id === 'no-garden') return -1
            return a.name.localeCompare(b.name)
        });
        addingGarden.value = false;
        $toast.success(`Garden ${garden.name} added`, toastConfig('success'));
    }
    const handleDeleteGarden = async (_id) => {
        if(gardensMarkedForDeletion.includes(_id))  return
        gardensMarkedForDeletion.push(_id)
        const plants = garden_sorted_plants.value.find(garden => garden._id === _id)?.plants || [];
        try{
            const res = await api.delete(`/gardens/remove/${_id}/`)
            gardens.value = gardens.value.filter(garden => garden._id !== _id);

            // Add plants of deleted garden to the "No Garden" section
            const noGarden = gardens.value.find(garden => garden._id === 'no-garden')
            noGarden.plants.push(...plants)
            noGarden.plants.sort((a, b) => a.name.localeCompare(b.name));
            $toast.success(`Garden deleted`, toastConfig('success'));
        }
        catch(err){
            if(err?.response?.data?.message){
                $toast.error(`Error deleting garden: ${err.response.data.message}`, toastConfig('error'));
            }
            else if(err.message){
                $toast.error(`Error deleting garden: ${err.message}`, toastConfig('error'));
            }
            else{
                $toast.error('Error deleting garden', toastConfig('error'));
            }
        }
        finally{
            gardensMarkedForDeletion = gardensMarkedForDeletion.filter(id => id !== _id);
        }
    }

</script>

<template>
    <AddGarden 
        v-if="addingGarden"
        @close="addingGarden = false"
        @gardenAdded="handleNewGarden"
    />
    <div id="full-screen-wrapper">
        <Banner />
        <div id="wrapper">
            <nav :class="isAuthenticated ? 'space-between' : 'view-mode'">
                <div id="edit-wrapper" v-if="isAuthenticated">
                    <div class="btn-group" v-if="!editing">
                        <button id="edit-btn" @click="toggleEdit">
                            <span>Edit</span>
                            <i class="pi pi-cog"></i>
                        </button>
                        <button id="add-garden-btn" @click="addingGarden = true" v-if="mode === 'garden'">
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
                    :season="plant.season"
                    :garden="plant.garden"
                    :visibility="plant.visibility"
                    :image="plant?.image?.url"
                    :edit="editing"
                />
            </div>
            <div 
                class="gardens-wrapper"
                v-if="!loading && mode==='garden'" 
                v-for="garden in garden_sorted_plants" :key="garden._id"
            >
                <header>
                    <h2 class="link" @click="router.push(`/garden/${garden._id}`)">{{ garden.name }}</h2>
                    <div class="garden-toolbar" v-if="isAuthenticated">
                        <i class="pi pi-pencil" @click="router.push(`/garden/edit/${garden._id}`)" v-if="editing && garden._id !== 'no-garden'"></i>
                        <i class="pi pi-trash" @click="handleDeleteGarden(garden._id)" v-if="editing && garden._id !== 'no-garden'"></i>
                    </div>
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
    </div>
</template>

<style scoped>
    #full-screen-wrapper{
        display: flex;
        flex-direction: column;
        width: 100vw;
        height: 100%;
    }
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
        color: var(--primary);
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
        column-gap: 10px;
    }
    .switch{
        display: flex;
    }
    nav button{
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2px 10px;
        background-color: white;
        color: black;
        column-gap: 10px;
        border: 1px solid var(--primary);
        border-radius: 5px;
    }
    nav button:hover{
        cursor: pointer;
        background-color: var(--primary);
        color: white;
    }
    .switch button{
        border-radius: 0px;
    }
    .switch #name{
        border-radius: 5px 0px 0px 5px;
        border-right: 1px solid var(--primary);
    }
    .switch #garden{
        border-radius: 0px 5px 5px 0px;
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
    .pi-arrow-up, .pi-arrow-down{
        color: var(--primary);
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
    .garden-toolbar{
        display: flex;
        flex-direction: row;
        align-items: center;
        column-gap: 10px;
    }
    .switch i{
        color: var(--primary);
    }
    .pi-trash{
        color: red
    }
    .pi-pencil:hover, .pi-trash:hover{
        cursor: pointer;
        opacity: 80%;
    }
</style>