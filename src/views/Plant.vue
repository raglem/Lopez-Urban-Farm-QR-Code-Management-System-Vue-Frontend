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