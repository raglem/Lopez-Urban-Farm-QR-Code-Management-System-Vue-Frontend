<script setup>
    import { ref, onUnmounted } from 'vue'
    import api from '../../api.js'
    import Loading from '../Loading.vue'

    import { useToast } from 'vue-toast-notification'
    import 'vue-toast-notification/dist/theme-sugar.css'
    import toastConfig from '../../assets/toastNotification.js'

    const props = defineProps({
        _id: {
            type: String,
            required: true
        }
    })
    const emit = defineEmits(['upload', 'cancel'])

    const imageSrc = ref(null)
    let previousImageURL = null
    let imageFile = null

    const loading = ref(false)
    const $toast = useToast()

    const handleImageChange = (e) => {
        const file = e.target.files[0]

        // Check file upload is valid
        if(!file){
            return
        }
        if(!file.type.startsWith('image/')){
            $toast.error('Please select a valid image file', toastConfig('error'));
            return
        }
        if(file.size > 5 * 1024 * 1024){ // 5MB limit
            $toast.error('Image size exceeds 5MB', toastConfig('error'));
            return
        }

        // Revoke the previousImage URL if it exists
        if(previousImageURL){
            URL.revokeObjectURL(previousImageURL)
        }

        // Create a URL for the image
        const src = URL.createObjectURL(file);
        imageSrc.value = src
        previousImageURL =  src

        // Store the file for image upload
        imageFile = file
    }
    const handleImageRemove = () => {
        imageSrc.value = null
    }
    const handleImageUpload = async () => {
        if(!imageFile){
            $toast.error('No image uploaded', toastConfig('error'));
            return;
        }

        const fd = new FormData()
        fd.append('image', imageFile)
        loading.value = true
        try{
            const res = await api.post(`/gardens/add-image/${props._id}`, fd, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            console.log(res.data)
            const uploadedImage = res.data.data
            $toast.success(`Image uploaded successfully`, toastConfig('success'))
            emit('upload', uploadedImage)
        }
        catch(err){
            console.error(err)
            if(err?.response?.data?.message){
                $toast.error(`Error adding image: ${err.response.data.message}`, toastConfig('error'))
            }
            else if(err.message){
                $toast.error(`Error adding image: ${err.message}`, toastConfig('error'))
            }
            else{
                $toast.error('Error adding image', toastConfig('error'))
            }
            return
        }
        finally{
            loading.value = false
        }
    }
</script>

<template>
    <div class="overlay">
        <form @submit.prevent>
            <div class="image-wrapper">
                <div v-if="imageSrc" class="image-preview">
                    <img :src="imageSrc" alt="Image Preview" />
                </div>
                <div class="image-toolbar">
                    <label class="image-icon" for="image">
                        <i class="pi pi-upload"></i>
                        <input type="file" id="image" accept="image/*" @change="handleImageChange"/>
                    </label>
                    <label class="image-icon" v-if="imageSrc">
                        <i class="pi pi-times-circle" @click="handleImageRemove"></i>
                    </label>
                </div>
            </div>
            <div class="loading-wrapper" v-if="loading">
                <Loading />
            </div>
            <div class="btn-toolbar">
                <button id="upload" type="button" :disabled="loading" @click="handleImageUpload">Upload</button>
                <button id="cancel" type="button" :disabled="loading" @click="$emit('cancel')">Cancel</button>
            </div>
        </form>
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
        z-index: 2;
    }
    form{
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
        overflow-y: auto;
    }
    .image-wrapper{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        padding: 20px 0px;
        width: 100%;
        row-gap: 20px;
        aspect-ratio: 2/1;
        border: 1px solid black;
        font-size: 2rem;
    }
    .image-wrapper i{
        color: var(--primary);
    }
    .image-preview{
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0px 20px;
    }
    .image-preview img{
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
    }
    .image-toolbar{
        display: flex;
        flex-direction: row;
        align-items: center;
        column-gap: 20px;
    }
    .image-icon{
        position: relative;
        cursor: pointer;
    }
    .image-icon input[type="file"]{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
        /* Allow cursor of the parent icon to be pointer */
        z-index: -1;
    }
    .btn-toolbar{
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        column-gap: 10px;
    }
    .btn-toolbar > button{
        padding: 10px;
        border: none;
        border-radius: 5px;
    }
    #upload{
        background-color: var(--primary);
        color: white;
    }
    #cancel{
        background-color: lightgray;
        color: black;
    }
    .loading-wrapper{
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
    }
</style>