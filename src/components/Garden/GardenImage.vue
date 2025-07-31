<script setup>
    import { ref } from 'vue';
    import api from '../../api';
    import Loading from '../Loading.vue';
    import { useToast } from 'vue-toast-notification';
    import 'vue-toast-notification/dist/theme-sugar.css';
    import toastConfig from '../../assets/toastNotification.js';

    const props = defineProps({
        garden_id: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        editMode: {
            type: Boolean,
            default: false
        }
    })
    const emit = defineEmits(['delete'])

    const $toast = useToast()
    const loading = ref(false)

    const handleDelete = async () => {
        loading.value = true
        try{
            const res = await api.delete(`/gardens/delete-image/${props.garden_id}`, {
                data: {
                    public_id: props.public_id
                }
            });
            $toast.success(`Image deleted successfully`, toastConfig('success'));
            emit('delete', props.public_id);
        }
        catch(err){
            console.error(err)
            if(err?.response?.data?.message){
                $toast.error(`Error deleting image: ${err.response.data.message}`, toastConfig('error'));
            }
            else if(err.message){
                $toast.error(`Error deleting image: ${err.message}`, toastConfig('error'));
            }
            else{
                $toast.error('Error deleting image', toastConfig('error'));
            }
        }
        finally{
            loading.value = false
        }
    }
</script>

<template>
    <div class="image-wrapper" v-if="loading">
        <Loading/>
    </div>
    <div class="image-wrapper" v-else>
        <img :src="props.image" :class="editMode ? 'dimmed' : null"/>
        <button class="delete" v-if="editMode && !loading">
            <i class="pi pi-times-circle" @click="handleDelete"></i>
        </button>
    </div>
</template>

<style scoped>
    .image-wrapper{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
    }
    .image-wrapper img{
        width: 100%;
        height: 100%;
        object-fit: scale-down;
        border-radius: 10px;
        margin: 10px;
        box-shadow: 0px 0px 5px rgba(0.0, 0.0, 1);
    }
    .image-wrapper img.dimmed{
        filter: grayscale(100%);
    }
    .image-wrapper img.dimmed:hover{
        opacity: 80%;
    }
    button.delete{
        position: absolute;
        top: 0;
        right: 0;
        z-index: 1;
        border: none;
        background-color: transparent;
    }
    button.delete i{
        font-size: 3rem;
        color: red;
    }
    button.delete i:hover{
        cursor: pointer;
        opacity: 80%;
    }
</style>