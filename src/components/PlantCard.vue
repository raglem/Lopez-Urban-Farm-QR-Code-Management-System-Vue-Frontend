<script setup>
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import Download from './Download.vue'
    
    const router = useRouter()
    const props = defineProps({
        id: {
            type: Number,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        species: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        }
    })
</script>

<template>
    <article>
        <header>
            <h4 @click="router.push(`/plant/${props.id}`)">{{ name }} | Species: {{ species }}</h4>
            <Download />
        </header>
        <p> {{ description }} </p>
    </article>
</template>

<style scoped>
    article{
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        border: 1px solid black;
        box-shadow: 0px 0px 5px black;
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
    h4:hover{
        cursor: pointer;
        color: var(--primary);
        text-decoration: underline;
    }
</style>