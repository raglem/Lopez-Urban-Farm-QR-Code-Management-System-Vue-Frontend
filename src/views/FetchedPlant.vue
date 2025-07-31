<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css';

import api from '../api.js'
import Loading from '../components/Loading.vue'
import toastConfig from '../assets/toastNotification.js';

const props = defineProps({
    _id: {
        type: String,
        required: true,
    },
})

const name = ref('')
const species = ref('')
const description = ref('')
const garden = ref(null)
const image = ref(null)
const loading = ref(false)
const $toast = useToast()
const router = useRouter()

onMounted(() => {
    fetchPlant()
})

const fetchPlant = async () => {
    loading.value = true
    try{
        const response = await api.get(`/plants/${props._id}`)
        const data = response.data.data

        name.value = data.name
        species.value = data.species
        description.value = data.description
        garden.value = data.garden
        image.value = data?.image?.url || null
    }
    catch(err){
        console.log(err)
        if(err?.response?.data?.message){
            $toast.error(`Error logging in: ${err.response.data.message}`, toastConfig('error'));
        }
        else if(err.message){
            $toast.error(`Error logging in: ${err.message}`, toastConfig('error'));
        }
        else{
            $toast.error('Error logging in', toastConfig('error'));
        }
    }
    finally {
        loading.value = false
    }
}

const handleGarden = () => {
    router.push({
        name: 'Garden',
        params: {
            _id: props._id
        }
    });
}

</script>

<template>
    <div id="wrapper">
        <article v-if="!loading">
            <header>
                <div v-if="garden" class="column">
                    <h4>
                        <text>{{ name }}</text>
                        | 
                        <text @click="handleGarden" class="link">{{ garden.name }}</text>
                    </h4>
                    <text><i>Species: {{ species }}</i></text>
                </div>
                <div v-else>
                    <h4>{{ name }} | Species: {{ species }}</h4>
                </div>
            </header>
            <p> 
                <img v-if="image" :src="image">
                {{ description }} 
            </p>
        </article>
        <Loading v-else />
    </div>
</template>

<style scoped>
    #wrapper{
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
    }
    article{
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        border: 1px solid black;
        box-shadow: 0px 0px 5px black;
        width: 80vw;
        max-width: 600px;
    }
    header{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        column-gap: 5px;
        padding: 10px;
        height: 50px;
        min-height: fit-content;
        border-bottom: 1px solid black;
    }
    header h4{
        margin: 0;
    }
    header .column{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
    }
    header .column > text{
        font-size: 0.8rem;
        color: black;
    }
    p{
        display: flex;
        flex-direction: row;
        column-gap: 10px;
        row-gap: 10px;
        padding: 0px 10px;
        text-align: left;
    }
    p > img{
        float: left;
        width: 30%;
        border-radius: 5px;
        object-fit: cover;
    }
    @media (max-width: 600px) {
        p{
            flex-direction: column;
        }
        p > img{
            width: 100%;
        }
    }
    .link:hover{
        cursor: pointer;
        color: var(--primary);
        text-decoration: underline;
    }
</style>