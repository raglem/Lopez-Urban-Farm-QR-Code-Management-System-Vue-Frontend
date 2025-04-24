<script setup>

const handleDownload = () => {
    console.log("Downloading...")
}
</script>

<template>
    <div>
        <i class="pi pi-qrcode"></i>
        <i class="pi pi-download download-icon" @click="handleDownload"></i>
    </div>
</template>

<style scoped>
    div{
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 40px;
        width: 100px;
        background: var(--primary-gradient);
    }
    download-icon{
        cursor: pointer;
        color: var(--primary);
    }
</style>