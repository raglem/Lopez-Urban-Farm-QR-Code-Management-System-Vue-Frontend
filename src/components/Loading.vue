<template>
    <div class="loading-indicator">
    </div>
</template>

<style scoped>
.loading-indicator{
    display: inline-block;
    width: 50px;
    height: 50px;
    border: 5px solid lightgray;
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}
@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>