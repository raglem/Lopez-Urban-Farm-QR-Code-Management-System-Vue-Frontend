<script setup>
    import { ref } from 'vue';
    import PlantCard from '../components/PlantCard.vue';
    import plants from  '../assets/plants.json';

    import { computed } from 'vue';

    const sorted_plants = computed(() => {
        const sorted = [...plants];
        if (mode.value === 'name') {
            sorted.sort((a, b) => a.name.localeCompare(b.name));
        }
        else{
            sorted.sort((a, b) => a.species.localeCompare(b.species))
        }
        if (order.value === 'ascending') {
            sorted.reverse();
        }
        return sorted;
    });

    const mode = ref('name')
    const order = ref('descending')

</script>

<template>
    <div id="wrapper">
        <nav>
            <label class="switch">
                <button id="name" :class="(mode === 'name') ? 'active' : 'inactive'" @click="mode = 'name'">Name</button>
                <button id="species" :class="(mode === 'species') ? 'active' : 'inactive'" @click="mode = 'species'">Species</button>
            </label>
            <i :class="(order === 'descending') ? 'pi pi-arrow-up' : 'pi pi-arrow-down'" @click="order = (order === 'descending') ? 'ascending' : 'descending'"></i>
        </nav>
        <div class="grid">
            <PlantCard 
                v-for="(plant, index) in sorted_plants" 
                :key="index" 
                :id="plant.id"
                :name="plant.name" 
                :species="plant.species" 
                :description="plant.description"
            />
        </div>
    </div>
</template>

<style scoped>
    #wrapper{
        display: flex;
        flex-direction: column;
        padding: 20px;
        row-gap: 20px;
    }
    nav{
        display: flex;
        justify-content: flex-end;
        align-items: center;
        column-gap: 5px;
    }
    .grid{
        display: grid;
        grid-template-columns: repeat(1, 1fr);
        gap: 20px;
    }

    .switch button{
        text-align: center;
        width: 75px;
        font-size: 1rem;
        border: 1px solid black;
    }
    .switch button.active{
        font-size: 1rem;
        border: 1px solid black;
        background-color: lightgray;
    }
    .switch button.inactive{
        font-size: 1rem;
        border: 1px solid black;
        background-color: white;
    }
    .switch #date{
        border-right: 1px solid black;
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