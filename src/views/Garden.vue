<script setup>
    import { computed, ref, onMounted } from 'vue'
    import api from '../api'

    import { useToast } from 'vue-toast-notification'
    import 'vue-toast-notification/dist/theme-sugar.css'
    import toastConfig from '../assets/toastNotification'

    import Loading from '../components/Loading.vue'
    import PlantCard from '../components/PlantCard.vue'
    import ImageCarousel from '../components/ImageCarousel.vue'
    import Banner from '../components/Banner.vue'

    import DownloadGarden from '../components/Garden/DownloadGarden.vue'
    import { useUserStore } from '../stores/user'
    import { storeToRefs } from 'pinia'
import Download from '../components/Download.vue'

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
    const loading = ref(false)
    const $toast = useToast()

    const userStore = useUserStore()
    const { isAuthenticated } = storeToRefs(userStore)

    onMounted(() => {
        const fetchGarden = async () => {
            loading.value = true
            try {
                const response = await api.get(`/gardens/${props._id}`);
                const garden = response.data.data
                name.value = garden.name;
                description.value = garden.description
                images.value = garden.images || [];
                plants.value = garden.plants || []
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
</script>

<template>
    <div class="loading-wrapper" v-if="loading">
        <Loading />
    </div>
    <div id="full-screen-wrapper" v-else>
        <Banner />
        <div id="wrapper">
            <div class="garden-wrapper">
                <header>
                    <h1>{{ name }}</h1>
                    <span>
                        <DownloadGarden 
                            v-if="isAuthenticated"
                            :_id="props._id"
                            :name="name"
                        />
                    </span>
                </header>
                <p>{{ description }}</p>
                <div class="image-carousel-wrapper">
                    <ImageCarousel v-if="images.length > 0" :images="imageURLs" />
                </div>
                <div class="grid">
                    <PlantCard 
                        v-for="plant in plants" 
                        :key="plant._id" 
                        :_id="plant._id"
                        :name="plant.name" 
                        :species="plant.species" 
                        :description="plant.description"
                        :season="plant.season"
                        :garden="{ _id: props._id, name: name }"
                        :visibility="true"
                        :image="plant?.image?.url"
                        :edit="false"
                    />
            </div>
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
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid black;
    }
    .image-carousel-wrapper{
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .grid{
        display: grid;
        grid-template-columns: repeat(1, 1fr);
        gap: 20px;
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