<script setup>
    import { ref } from 'vue'

    const visibilities = ref(['Public', 'Private'])
    const showDropdown = ref(false)
    const selectedVisibility = defineModel()

    const emit = defineEmits(['seasonSelected']);

    const selectVisibility = (visibility) => {
        showDropdown.value = false
        selectedVisibility.value = visibility
    }

</script>

<template>
    <div class="visibility-dropdown-wrapper">
        <div class="selected-visibility" @click="showDropdown = !showDropdown">
            <span>{{ selectedVisibility || "Public" }}</span>
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
        <ol class="visibility-dropdown" v-if="showDropdown">
            <li 
                v-for="visibility in visibilities" 
                :key="visibility" :value="visibility"
                @click="selectVisibility(visibility)"
            >
                {{ visibility }}
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
    .selected-visibility{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        font-size: 1.5rem;
        border: 1px solid var(--primary);
        padding: 4px 8px;
        border-radius: 5px;
    }
    .selected-visibility:hover{
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