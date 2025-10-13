<script setup>
    import { ref } from 'vue'

    const seasons = ref(['Spring', 'Summer', 'Fall', 'Winter'])
    const showDropdown = ref(false)
    const selectedSeason = defineModel()

    const emit = defineEmits(['seasonSelected']);

    const selectSeason = (season) => {
        showDropdown.value = false
        selectedSeason.value = season
    }

</script>

<template>
    <div class="season-dropdown-wrapper">
        <div class="selected-season" @click="showDropdown = !showDropdown">
            <span>{{ selectedSeason || "Spring" }}</span>
            <i 
                class="pi pi-caret-down" 
                v-if="!showDropdown"
            >
            </i>
            <i 
                class="pi pi-caret-up" 
                v-else="showDropdown"
            >
            </i>
        </div>
        <ol class="season-dropdown" v-if="showDropdown">
            <li 
                v-for="season in seasons" 
                :key="season" :value="season"
                @click="selectSeason(season)"
            >
                {{ season }}
            </li>
        </ol>
    </div>
</template>

<style scoped>
    ol{
        display: flex;
        flex-direction: column;
        background-color: white;
        color: black;
        border: 1px solid var(--primary);
        list-style-type: none;
        padding: 0px;
        border-radius: 5px;
    }
    .selected-season{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        font-size: 1.5rem;
        border: 1px solid var(--primary);
        padding: 4px 8px;
        border-radius: 5px;
    }
    .selected-season:hover{
        cursor: pointer;
    }
    li{
        box-sizing: border-box;
        padding: 4px 8px;
        font-size: 1.5rem;
        border-bottom: 1px solid black;
    }
    li:nth-last-of-type(1){
        border-bottom: none;
    }
    li:hover{
        cursor: pointer;
        background-color: var(--primary);
        color: white;
    }
    .other-option{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding-right: 8px;
        background-color: rgb(224, 223, 223);
    }
    i{
        color: var(--primary);
    }
</style>