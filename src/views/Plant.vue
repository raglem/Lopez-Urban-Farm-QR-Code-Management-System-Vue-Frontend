<script setup>
import { ref } from 'vue'
import plants from '../assets/plants.json'
import { useRoute } from 'vue-router'

const props = defineProps({
    name: {
        type: String,
        required: true,
    },
    species: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false,
    }
})

const name = ref(props.name)
const species = ref(props.species)
const description = ref(props.description)

</script>

<template>
    <div id="wrapper">
        <article>
            <header>
                <h4>{{ name }} | Species: {{ species }}</h4>
            </header>
            <p> 
                <img v-if="props.image" :src="image" />
                {{ description }} 
            </p>
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