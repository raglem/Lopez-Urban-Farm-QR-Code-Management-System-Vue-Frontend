<script setup>
    import { computed, ref, onMounted } from 'vue'
    import api from '../api'

    import { useToast } from 'vue-toast-notification'
    import 'vue-toast-notification/dist/theme-sugar.css'
    import toastConfig from '../assets/toastNotification'
    import ImageCarousel from '../components/ImageCarousel.vue'
    import Loading from '../components/Loading.vue'
    import GardenImage from '../components/Garden/GardenImage.vue'
    import AddGardenImage from '../components/Garden/AddGardenImage.vue'
    import EmptyImageCarousel from '../components/EmptyImageCarousel.vue'
    import EditGardenFields from '../components/Garden/EditGardenFields.vue'

    const props = defineProps({
        _id: {
            type: String,
            required: true
        }
    })

    const name = ref('')
    const description = ref('')
    const images = ref([])
    const imageURLs = computed(() => {
        return images.value.map(image => image.url)
    })
    const plants = ref([])

    // For handling field updates and image editing
    const addMode = ref(false)
    const editMode = ref(false)
    const manageImagesMode = ref(false)

    const loading = ref(false)
    const $toast = useToast()

    onMounted(() => {
        const fetchGarden = async () => {
            loading.value = true
            try {
                const response = await api.get(`/gardens/${props._id}`);
                const garden = response.data.data
                name.value = garden.name
                description.value = garden.description
                images.value = garden.images || []
                plants.value = garden.plants || []
                console.log(garden)
            } catch (err) {
                console.error(err)
                if(err?.response?.data?.message){
                    $toast.error(`Error fetching plant: ${err.response.data.message}`, toastConfig('error'));
                }
                else if(err.message){
                    $toast.error(`Error fetching plant: ${err.message}`, toastConfig('error'));
                }
                else{
                    $toast.error('Error fetching plant', toastConfig('error'));
                }
            } finally{
                loading.value = false
            }
        }
        fetchGarden()
    })

    const handleAddedImage = (image) => {
        images.value.push(image)
        addMode.value = false
    }
    const handleGardenFieldsUpdate = (garden) => {
        console.log(garden)
        name.value = garden.name
        description.value = garden.description
        editMode.value = false
        $toast.success(`Garden ${garden.name} updated`, toastConfig('success'))
    }
</script>

<template>
    <AddGardenImage 
        :_id="props._id"
        v-if="addMode" 
        @upload="handleAddedImage"
        @cancel="addMode=false"
    />
    <EditGardenFields
        :_id="props._id"
        :name="name"
        :description="description"
        @update="handleGardenFieldsUpdate"
        @cancel="editMode = false"
        v-if="editMode"
    />
    <div class="loading-wrapper" v-if="loading">
        <Loading />
    </div>
    <div id="wrapper" v-else>
        <div class="garden-wrapper">
            <header>
                <h1>{{ name }}</h1>
                <div class="btn-toolbar" v-if="!editMode">
                    <button id="edit-image" @click="editMode = true">
                        Edit <i class="pi pi-cog"></i>
                    </button>
                </div>
                <div class="btn-toolbar" v-else>
                    <button @click="editMode = false">
                        Done
                    </button>
                </div>
            </header>
            <p>{{ description }}</p>
            <div class="image-carousel-wrapper">
                <ImageCarousel v-if="images.length > 0" :images="imageURLs" />
                <EmptyImageCarousel :message="'No Images Uploaded'"v-else />
            </div>
            <br/>
            <div class="btn-toolbar" v-if="!manageImagesMode">
                <button id="add-image" @click="addMode = true">
                    Add <i class="pi pi-plus"></i>
                </button>
                <button id="edit-image" @click="manageImagesMode = true">
                    Manage <i class="pi pi-cog"></i>
                </button>
            </div>
            <div class="btn-toolbar" v-else>
                <button @click="manageImagesMode = false">
                    Done
                </button>
            </div>
            <div class="images-wrapper">
                <GardenImage 
                    v-for="image in images" 
                    :key="image.public_id" 
                    :garden_id="props._id"
                    :public_id="image.public_id"
                    :image="image.url"
                    :editMode="manageImagesMode"
                    @delete="images = images.filter(img => img.public_id !== image.public_id)"
                />
            </div>
        </div>
    </div>

</template>

<style scoped>
    #wrapper{
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100%;
        padding: 20px;
    }
    .garden-wrapper{
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: stretch;
        max-width: 1200px;
        width: 100%;
        row-gap: 20px;
    }
    header{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid black;
    }
    .image-carousel-wrapper{
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .images-wrapper{
        display: grid;
        grid-template-columns: repeat(1, 1fr);
        gap: 20px;
        width: 100%;
    }
    @media (min-width: 768px) {
        .images-wrapper{
            grid-template-columns: repeat(2, 1fr);
        }
    }
    @media (min-width: 1024px) {
        .images-wrapper{
            grid-template-columns: repeat(3, 1fr);
        }
    }
    .btn-toolbar{
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
    }
    .btn-toolbar button{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        column-gap: 5px;
        padding: 5px 10px;
        border: 1px solid black;
        width: fit-content;
    }
    .btn-toolbar button#add-image{
        border-right: none;
    }
    .btn-toolbar button:hover{
        cursor: pointer;
        background-color: darkgray;
        color: white;
    }
    .loading-wrapper{
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
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