<script setup>
    import { computed, ref } from 'vue';

    const props = defineProps({
        'images': {
            type: Array,
            required: true
        }
    })
    const selectedIndex = ref(0)
    const selectedImage = computed(() => {
        return props.images[selectedIndex.value] || '';
    });

    const handleLeftScroll = () => {
        if (selectedIndex.value > 0) {
            selectedIndex.value -= 1
        }
    }
    const handleRightScroll = () => {
        if(selectedIndex.value < props.images.length - 1) {
            selectedIndex.value += 1
        }
    }
</script>

<template>
    <div class="wrapper">
        <button :disabled="!props.images || selectedIndex === 0" @click="handleLeftScroll">
            <i class="pi pi-chevron-left"></i>
        </button>
        <div class="center-wrapper">
            <div class="image-wrapper">
                <img :src="selectedImage" alt="Selected Image" />
            </div>
            <nav>
                {{ selectedIndex + 1 }} of {{ props.images.length }}
            </nav>
        </div>
        <button :disabled="!props.images || selectedIndex === props.images.length - 1" @click="handleRightScroll">
            <i class="pi pi-chevron-right"></i>
        </button>
    </div>
</template>


<style scoped>
    .wrapper {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 50vh;
        width: 100%;
        max-width: 1200px;
        border-radius: 10px;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        box-shadow: 0px 0px 5px black;
    }
    .center-wrapper{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
        box-sizing: border-box;
        padding: 10px 0px;
        row-gap: 10px;
    }
    .center-wrapper nav{
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        height: 50px;
        width: 100%;
        box-sizing: border-box;
        font-size: 1.2rem;
        color: var(--primary);
    }
    button{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 10%;
        min-width: 75px;
        aspect-ratio: 1 / 1;
        background-color: white;
        color: var(--primary);
        border: 1px solid var(--primary);
    }
    button:hover{
        cursor: pointer;
        background-color: var(--primary);
        color: white;
    }
    button i{
        font-size: 2rem;
    }
    button:disabled{
        opacity: 0.5;
        cursor: not-allowed;
        background-color: white;
    }
    button:disabled:hover{
        opacity: 0.5;
        color: var(--primary);
        background-color: white;
    }
    .image-wrapper{
        width: calc(100% - 150px);
        height: calc(100% - 50px);
    }
    img{
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
        object-fit: contain;
        scroll-snap-align: center;
        border-radius: 10px;
    }
</style>