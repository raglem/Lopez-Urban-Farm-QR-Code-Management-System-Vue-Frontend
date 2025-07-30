<script setup>
import { onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css';
import toastConfig from '../assets/toastNotification.js'

import api from '../api.js'
import Loading from '../components/Loading.vue'
import GardenDropdown from '../components/Garden/GardenDropdown.vue';

const name = ref('')
const species = ref('')
const description = ref('')
const garden = ref(null)
const visibility = ref('Public')
// For image preview and cleanup
const imageSrc = ref(null)
let previousImageURL = null

// For image upload
let imageFile = null

const $toast = useToast();
const loading = ref(false)

const router = useRouter()

onUnmounted(() => {
    // Clean up the previous image URL when component is unmounted
    if(previousImageURL){
        URL.revokeObjectURL(previousImageURL)
    }
})

const checkFields = () => {
    if(!name.value || !species.value || !description.value || !garden.value || !visibility.value){
        $toast.error('Please fill in all required fields', toastConfig('error'));
        return false;
    }
    return true;
}

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

const handleSubmit = async () => {
    if(!checkFields()) return
    loading.value = true
    try{
        const fd = new FormData()
        fd.append('name', name.value)
        fd.append('species', species.value)
        fd.append('description', description.value)
        fd.append('gardenId', garden.value._id)
        fd.append('visibility', visibility.value === 'Public' ? true : false)
        if(imageFile){
            fd.append('image', imageFile)
        }
        const response = await api.post('/plants/add', fd, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        $toast.success(`${name.value} was successfully added`, toastConfig('success'));
        router.push('/view')
    }
    catch(err){
        if(err.response.data.message){
            $toast.error(`Error adding plant: ${err.response.data.message}`, toastConfig('error'));
        }
        else if(err.message){
            $toast.error(`Error adding plant: ${err.message}`, toastConfig('error'));
        }
        else{
            $toast.error('Error adding plant', toastConfig('error'));
        }
    }
    finally{
        loading.value = false
    }
}

const handlePreview = () => {
    if(!checkFields()) return
    router.push({
        name: 'Plant',
        params: {
            name: name.value,
            species: species.value,
            description: description.value
        }
    });
}
</script>

<template>
    <div id="wrapper">
        <form @submit.prevent="handleSubmit">
            <h1>Add New Plant</h1>
            <div>
                <label for="name">Name</label>
                <input type="text" id="name" name="name" required v-model="name">
            </div>
            <div>
                <label for="species">Species</label>
                <input type="text" id="species" name="species" required v-model="species">
            </div>
            <div>
                <label for="description">Description</label>
                <textarea type="textarea" id="description" name="description" required v-model="description">
                </textarea>
            </div>
            <div>
                <label for="garden">Garden: <i> Optional </i></label>
                <GardenDropdown v-model="garden"/>
            </div>
            <div>
                <label for="visibility">Visibility</label>
                <select id="visibility" name="visibility" required v-model="visibility">
                    <option>Public</option>
                    <option>Private</option>
                </select>
            </div>
            <div>
                <label for="image">Image: <i> Optional </i></label>
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
            </div>
            <div class="loading-wrapper" v-if="loading">
                <Loading />
            </div>
            <div class="btn-toolbar">
                <button id="preview" type="button" @click="handlePreview">Preview</button>
                <div class="btn-group">
                    <button id="add" type="submit">Add</button>
                    <button id="cancel" type="button" @click="router.push('/view')">Cancel</button>
                </div>
            </div>
        </form>
    </div>
</template>

<style scoped>
    #wrapper{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
    }
    form{
        display: flex;
        flex-direction: column;
        align-items: stretch;
        box-sizing: border-box;
        padding: 20px;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        row-gap: 20px;
        width: 80vw;
        max-width: 600px;
        margin: 40px 0px;
        overflow-y: auto;
    }
    form div{
        display: flex;
        flex-direction: column;
        align-items: stretch;
    }
    form div label{
        font-size: 1.5rem;
    }
    form div input, form div select{
        font-size: 1.5rem;
    }
    form div textarea{
        font-size: 1.2rem;
        height: 100px;
        resize: none;
        font-family: 'Verdana', 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif
    }
    .image-wrapper{
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        padding: 20px 0px;
        width: 100%;
        row-gap: 20px;
        aspect-ratio: 4/1;
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
    .loading-wrapper{
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
    .btn-toolbar{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .btn-toolbar button{
        padding-top: 5px;
        padding-bottom: 5px;
        width: 100px;
        border-radius: 5px;
        color: black;
        border-color: darkgray;
    }
    .btn-group{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        column-gap: 10px;
    }
    .btn-group button{
        color: white;
    }
    #preview{
        background: lightgray;
    }
    #add{
        background: rgb(10, 174, 10);
    }
    #cancel{
        background: rgb(242, 52, 52);
        color: white;
    }
</style>