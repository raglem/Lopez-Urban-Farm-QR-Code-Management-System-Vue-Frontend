<script setup>
    import { ref } from 'vue'
    import { useRouter, useRoute } from 'vue-router'

    const router = useRouter()
    const route = useRoute()
</script>

<template>
    <nav class="navbar">
        <h2>Lopez Urban Farm</h2>

        <div class="btn-group">
            <button class="inactive" @click="() => router.push('/view')">
                View
            </button>
            <button class="inactive" @click="() => router.push('/add')">
                Add
            </button>
        </div>
    </nav>
</template>

<style scoped>
    h2{
        font-style: normal;
        color: white;
    }
    .navbar{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        height: 50px;
        padding: 5px 20px;
        box-sizing: border-box;
        background: var(--primary-gradient);
        border: 1px solid green;
    }
    .btn-group{
        display: flex;
        justify-content: space-evenly;
        column-gap: 10px;
    }
    .btn-group button{
        padding: 5px 15px;
        border-width: 1px;
        border-radius: 5px;
        text-align: center;
        color: black;
    }
    .btn-group button.active{
        background-color: lightgray;
    }
    .btn-group button.inactive{
        background-color: white;
    }
</style>