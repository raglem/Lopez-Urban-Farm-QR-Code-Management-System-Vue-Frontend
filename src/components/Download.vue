<script setup>
import { ref } from 'vue'
import generateQRCode from '../utils/QRCodeGenerator'

const props = defineProps({
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
})

const hovering = ref(false)
const handleDownload = async () => {
    const QRCode = await generateQRCode(props._id)
    const link = document.createElement('a')
    link.href = QRCode
    link.download = `${props.name}-QRCode.png`
    link.click()
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
        flex-direction: row;
        justify-content: space-evenly;
        align-items: center;
        position: relative;
        column-gap: 5px;
        padding: 0px;
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