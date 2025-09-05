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
</script>

<template>
    <div class="banner-wrapper">
        <a href="https://www.lopezurbanfarm.com">
            <img src="../assets/Lopez Urban Farm Web Banner-1-2-1.png" alt="banner image" class="banner-image" v-if="screenWidth < 1024"/>
            <img src="../assets/Lopez Urban Farm Web Banner-2-2-1.png" alt="banner image" class="banner-image" v-else/>
        </a>
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
        aspect-ratio: 4/1;
        width: 100%;
    }
    .banner-image:hover{
        cursor: pointer;
        opacity: 90%;
    }
    article{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: rgba(77, 73, 73, 0.7);
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        color: white;
    }
    h1{
        font-size: 2rem;
    }
    h3{
        font-size: 1.5rem;
    }
    @media screen and (max-width: 1024px) {
        .banner-image{
            aspect-ratio: 2/1;
        }
        article{
            padding: 10px;
        }
        h1{
            font-size: 1.7rem;
        }
        h3{
            font-size: 1.2rem;
        }
        
    }
    @media screen and (max-width: 768px) {
        .banner-wrapper{
            margin: 0px 0px;
        }
        h1{
            font-size: 1.5rem;
        }
        h3{
            font-size: 1rem;
        }
        
    }
    @media screen and (max-width: 428px) {
        h1{
            font-size: 1.2rem;
        }
        h3{
            font-size: 0.7rem;
        }
        
    }
</style>