<script setup>
    import { computed, ref, onMounted } from 'vue'
    import api from '../api'

    import { useToast } from 'vue-toast-notification'
    import 'vue-toast-notification/dist/theme-sugar.css'
    import toastConfig from '../assets/toastNotification'
    import Loading from '../components/Loading.vue'
    import PlantCard from '../components/PlantCard.vue'
    import ImageCarousel from '../components/ImageCarousel.vue'

    const props = defineProps({
        _id: {
            type: String,
            required: true
        }
    })

    const name = ref('')
    const images = ref([])
    const imageURLs = computed(() => {
        return images.value.map(image => image.url)
    })
    const plants = ref([])
    const loading = ref(false)
    const $toast = useToast()

    onMounted(() => {
        const fetchGarden = async () => {
            loading.value = true
            try {
                const response = await api.get(`/gardens/${props._id}`);
                const garden = response.data.data
                name.value = garden.name;
                images.value = garden.images || [];
                plants.value = garden.plants || []
                console.log(response.data)

                // Uncomment later
                // images.value = [
                //     'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQO1WgOdKAszoDdC0YNnWNCbSc_agplgwrCLXzYNwSIqiWYyBUSxjoj0JJEVxxRa8z4mFY9UjtUMpepzUQSwJVvlnxjeqcsfDI9O_grj7fnPQ', 
                //     'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlOYId9yAzW4d7oOb1__QztJahf8hZ_d6naMsnqeBXGry2n-dRxc-X_zhiodnnXxccOs0oXWVBDne7touXKfGOXV-HbH2cZ3TgRfb-fWeQ', 
                //     'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQO1WgOdKAszoDdC0YNnWNCbSc_agplgwrCLXzYNwSIqiWYyBUSxjoj0JJEVxxRa8z4mFY9UjtUMpepzUQSwJVvlnxjeqcsfDI9O_grj7fnPQ'
                // ]
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
    <div id="wrapper" v-else>
        <div class="garden-wrapper">
            <header>
                <h1>{{ name }}</h1>
            </header>
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
                    :garden="{ _id: props._id, name: name }"
                    :visibility="true"
                    :image="plant?.image?.url"
                    :edit="false"
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
        row-gap: 40px;
    }
    header{
        border-bottom: 1px solid black;
    }
    header > h1{
        margin-bottom: 0px;
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