<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
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
const image = ref(null)
const loading = ref(false)
const $toast = useToast()

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

</script>

<template>
    <div id="wrapper">
        <article v-if="!loading">
            <header>
                <h4>{{ name }} | Species: {{ species }}</h4>
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
        padding: 0px 10px;
        height: 30%;
        border-bottom: 1px solid black;
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
</style>