<script setup>
import { ref, onMounted } from 'vue'
import plants from '../assets/plants.json'
import { useRoute } from 'vue-router'

import api from '../api.js'

const props = defineProps({
    _id: {
        type: String,
        required: true,
    },
})

const name = ref('')
const species = ref('')
const description = ref('')
const loading = ref(false)

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
        <article>
            <header>
                <h4>{{ name }} | Species: {{ species }}</h4>
            </header>
            <p> {{ description }} </p>
        </article>
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
        padding-left: 5px;
        height: 30%;
        border-bottom: 1px solid black;
    }
    p{
        padding: 0px 5px;
        text-align: left;
    }
</style>