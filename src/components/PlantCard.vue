<script setup>
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import Download from './Download.vue'
    
    const router = useRouter()
    const props = defineProps({
        _id: {
            type: String,
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
        },
        edit: {
            type: Boolean,
            required: true
        }
    })
</script>

<template>
    <article>
        <header>
            <h4 @click="router.push(`/plant/${props.id}`)">{{ name }} | Species: {{ species }}</h4>
            <i class="pi pi-pencil" v-if="edit" @click="router.push(`/edit/${props.id}`)"></i>
            <Download v-if="edit === false"/>
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
        padding: 0px 10px;
        height: 30%;
        border-bottom: 1px solid black;
    }
    header i{
        color: var(--primary);
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