<script setup>
    import { ref, onMounted, onUnmounted } from 'vue'
    const props = defineProps(['message'])
    const emit = defineEmits(['continue', 'close'])
</script>

<template>
    <div class="overlay">
        <div class="confirm-wrapper">
            <p>
                {{ props.message }}
            </p>
            <div class="confirm-buttons">
                <button class="continue" @click="emit('continue')">Continue</button>
                <button class="cancel" @click="emit('close')">Close</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .overlay {
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.5); /* semi-transparent black */
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
    .confirm-wrapper{
        display: flex;
        flex-direction: column;
        align-items: stretch;
        min-width: 300px;
        width: 50vw;
        max-width: 600px;
        background-color: white;
        row-gap: 20px;
        padding: 20px;
        box-shadow: 0px 0px 40 rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        z-index: 2;
    }
    .confirm-buttons{
        display: flex;
        justify-content: flex-end;
        column-gap: 10px;
    }
    .confirm-buttons button{
        padding: 10px;
    }
    .confirm-buttons .continue{
        background-color: var(--primary);
        color: white;
        border: none;
        border-radius: 5px;
    }
    .confirm-buttons .cancel{
        background-color: lightgray;
        color: black;
        border: none;
        border-radius: 5px;
    }
</style>