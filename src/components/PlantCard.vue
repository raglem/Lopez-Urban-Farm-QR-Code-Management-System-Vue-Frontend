<script setup>
    import { ref } from 'vue'
    import Download from './Download.vue'
    const plant = ref({
        name: 'Rose',
        species: 'Rosa',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum ullam nisi aliquid dicta nostrum. Consequatur nam nisi eos quidem itaque.',
    })
</script>

<template>
    <article>
        <header>
            <h4>{{ plant.name }} | {{ plant.species }}</h4>
            <Download />
        </header>
    </article>
</template>

<style scoped>
    header{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border: 1px solid black;
    }
</style>