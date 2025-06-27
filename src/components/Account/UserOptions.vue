<script setup>
    import { ref, onMounted, onUnmounted} from 'vue'
    const emit = defineEmits(['changeRole', 'removeUser', 'closeOptions'])

    onMounted(() => {
        setTimeout(() => {
            document.addEventListener('click', handleClickOutside)
        })
    });

    onUnmounted(() => {
        document.removeEventListener('click', handleClickOutside);
    });

    const handleClickOutside = (event) => {
        const btnWrapper = document.querySelector('.btn-wrapper')
        if(event.target !== btnWrapper && !btnWrapper.contains(event.target)){
            emit('closeOptions');
        }
    }
</script>

<template>
    <div class="btn-wrapper">
        <button class="change-role" @click="() => $emit('changeRole')">
            Change Role
        </button>
        <button class="remove" @click="() => $emit('removeUser')">
            Remove
        </button>
    </div>
</template>

<style scoped>
    .btn-wrapper{
        position: absolute;
        top: 100%;
        right: 0;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        background-color: lightgray;
        z-index: 1;
        column-gap: 10px;
        box-sizing: border-box;
        padding: 10px;
        box-shadow: 0px 0px 5px black;
        border-radius: 5px;
    }
    .change-role, .remove{
        padding: 10px;
        border: none;
        border-radius: 5px;
        font-size: 1rem;
        white-space: nowrap;
    }
    .change-role{
        background-color: var(--primary);
        color: white;
    }
    .remove{
        background-color: #f44336;
        color: white;
    }
</style>