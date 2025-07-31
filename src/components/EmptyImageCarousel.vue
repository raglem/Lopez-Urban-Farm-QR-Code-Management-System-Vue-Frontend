
<script setup>
    const props = defineProps({
        message:{
            type: String,
            required: true
        },
        subMessage: {
            type: String,
            required: false,
            default: ''
        }
    })
</script>

<template>
    <div class="wrapper">
        <button disabled>
            <i class="pi pi-chevron-left"></i>
        </button>
        <div class="center-wrapper">
            <h1>{{ message }}</h1>
            <h3>{{ subMessage }}</h3>
        </div>
        <button disabled>
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
    .center-wrapper > h1, .center-wrapper > h2{
        margin: none;
        color: var(--primary);
        font-size: 2.5rem;
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
</style>