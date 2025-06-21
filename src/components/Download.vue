<script setup>
import { ref } from 'vue'
const hovering = ref(false)
const handleMouseEnter = () => {
    hovering.value = true
}
const handleMouseLeave = () => {
    hovering.value = false
}
const handleDownload = () => {
    console.log("Downloading...")
}
</script>

<template>
    <div 
        id="wrapper"
        @click="() => hovering = !hovering"
        @mouseenter="() => hovering = true"
        @mouseleave="() => hovering = false"
    >
        <i class="pi pi-qrcode" @click="handleDownload"></i>
        <i id="download-icon" class="pi pi-download" @click="handleDownload"></i>
        <div id="info" v-if="hovering">
            <i class="pi pi-question-circle"></i> &nbsp;
            <text>Download QR Code</text>
        </div>
    </div>
</template>

<style scoped>
    #wrapper{
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        position: relative;
        column-gap: 5px;
    }
    #download-icon:hover{
        cursor: pointer;
        color: var(--primary);
    }
    #info{
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        position: absolute;
        top: auto;
        bottom: 100%;
        right: 0;
        white-space: nowrap;
        border: 1px solid black;
        background: lightgray;
    }
</style>