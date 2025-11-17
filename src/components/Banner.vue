<script setup>
    import { ref, onMounted, onUnmounted } from 'vue'

    const screenWidth = ref(window.innerWidth)
    const updateWidth = () => {
        screenWidth.value = window.innerWidth;
    };

    onMounted(() => {
        window.addEventListener('resize', updateWidth);
    });

    onUnmounted(() => {
        window.removeEventListener('resize', updateWidth);
    });

    const redirectToMainWebsite = () => {
        window.location.href = 'https://lopezurbanfarm.com/'
    }
</script>

<template>
    <div class="banner-wrapper">
        <img 
            src="../assets/Lopez Urban Farm Web Banner-1-2-1.png" 
            alt="banner image" class="banner-image" v-if="screenWidth < 428"
            @click="redirectToMainWebsite"
        />
        <img 
            src="../assets/Lopez Urban Farm Web Banner-2-2-1.png" 
            alt="banner image" class="banner-image" v-else
            @click="redirectToMainWebsite"    
        />
    </div>
</template>

<style scoped>
    .banner-wrapper{
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: fit-content;
        width: 100vw;
        margin: 20px 0px;
    }
    .banner-wrapper > div{
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .banner-image{
        display: flex;
        object-fit: cover;
        aspect-ratio: 1/1;
        width: 100%;
    }
    .banner-image:hover{
        cursor: pointer;
        opacity: 90%;
    }
    @media screen and (min-width: 428px) {
        .banner-image{
            aspect-ratio: 2/1;
        }
    }
    @media screen and (min-width: 768px) {
        .banner-image{
            aspect-ratio: 4/1;
        }
    }
    @media screen and (min-width: 1200px) {
        .banner-image {
            width: 75%;
        }
    }
    @media screen and (min-width: 1600px) {
        .banner-image {
            width: 50%;
        }
    }
</style>