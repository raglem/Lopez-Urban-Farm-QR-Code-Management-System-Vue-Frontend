<script setup>
    import PlantCard from '../components/PlantCard.vue';
</script>

<template>
    <div class="grid">
        <PlantCard />
        <PlantCard />
        <PlantCard />
        <PlantCard />
    </div>
</template>

<style scoped>
    .grid{
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
    }
    @media (min-width: 768px) {
        .grid{
            grid-template-columns: repeat(2, 1fr);
        }
    }
    @media (min-width: 1024) {
        .grid{
            grid-template-columns: repeat(3, 1fr);
        }
    }
</style>