<script setup>
    import { ref, onMounted, onUnmounted } from 'vue'
    import { useRouter } from 'vue-router';
    import { useToast } from 'vue-toast-notification'
    import 'vue-toast-notification/dist/theme-sugar.css';

    import api from '../api.js'
    import Loading from '../components/Loading.vue'
    import toastConfig from '../assets/toastNotification.js'
    import GardenDropdown from '../components/Garden/GardenDropdown.vue';
import SeasonDropdown from '../components/SeasonDropdown.vue';
import VisibilityDropdown from '../components/VisibilityDropdown.vue';

    const props = defineProps({'_id': { type: String, required: true }})
    const originalFields = [
        'name',
        'species',
        'description',
        'season',
        'garden',
        'visibility'
    ]

    onMounted(() => {
        async function fetchPlant(){
            loading.value = true
            try{
                const response = await api.get(`/plants/${props._id}`)
                const plant = response.data.data
                
                originalFields.forEach(field => {
                    originalFields[field] = plant[field]
                })

                name.value = plant.name
                species.value = plant.species
                description.value = plant.description
                season.value = plant.season
                garden.value = plant.garden || null
                visibility.value = plant.visibility ? 'Public' : 'Private'
                imageSrc.value = plant?.image?.url || null
                console.log(response.data.data)
            }
            catch(err){
                if(err?.response?.data?.message){
                    $toast.error(`Error fetching plant: ${err.response.data.message}`, toastConfig('error'));
                }
                else if(err.message){
                    $toast.error(`Error fetching plant: ${err.message}`, toastConfig('error'));
                }
                else{
                    $toast.error('Error fetching plant', toastConfig('error'));
                }
            }
            finally{
                loading.value = false
            }
        }
        fetchPlant()
    })

    const name = ref("")
    const species = ref("")
    const description = ref("")
    const season = ref("")
    const garden = ref(null)
    const visibility = ref("")
    
    // For image upload and preview
    const imageSrc = ref(null)
    let imageFile = null
    let previousImageURL = null
    let changedImage = false

    const loading = ref(false)
    const router = useRouter()
    const $toast = useToast()

    onUnmounted(() => {
        // Clean up the previous image URL when component is unmounted
        if(previousImageURL){
            URL.revokeObjectURL(previousImageURL)
        }
    })

    const checkFields = () => {
        if(!name.value || !species.value || !description.value || !season.value || !visibility.value){
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

        // If the image has changed, set changedImage to true
        changedImage = true

        // Revoke the previousImage URL if it exists
        if(previousImageURL){
            URL.revokeObjectURL(previousImageURL)
        }

        // Create a URL for the image
        const src = URL.createObjectURL(file);
        imageSrc.value = src
        previousImageURL = src

        // Store the file for image upload
        imageFile = file
    }
    const handleImageRemove = () => {
        imageSrc.value = null
        imageFile = null
        changedImage = true
    }

    const handleUpdate = async () => {
        if(!checkFields()) return
        loading.value = true
        const fd = new FormData()
        fd.append('id', props._id)
        // For text fields, only append if they have changed
        if(name.value !== originalFields.name){
            fd.append('name', name.value)
        }
        if(species.value !== originalFields.species){
            fd.append('species', species.value)
        }
        if(description.value !== originalFields.description){
            fd.append('description', description.value)
        }
        if(season.value !== originalFields.season){
            fd.append('season', season.value)
        }
        if(garden.value !== originalFields.garden){
            fd.append('garden', garden.value ? garden.value._id : null)
        }
        if(visibility.value !== originalFields.visibility){
            fd.append('visibility', visibility.value === 'Public' ? true : false)
        }
        // For image, append if it has changed or append the key 'deleteImage' if the image is removed
        if(changedImage){
            imageFile ? fd.append('image', imageFile) : 
                fd.append('deleteImage', 'true')
        }
        try{
            const response = await api.patch('/plants/update', fd, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            router.push({
                name: 'View',
                params: {
                    editing: false
                }
            })
            $toast.success(`${name.value} was successfully updated`, toastConfig('success'));
        }
        catch(err){
            if(err.response?.data?.message){
                $toast.error(`Error updating plant: ${err.response.data.message}`, toastConfig('error'));
            }
            else if(err?.message){
                $toast.error(`Error updating plant: ${err.message}`, toastConfig('error'));
            }
            else{
                $toast.error('Error updating plant', toastConfig('error'));
            }
            return;
        }
        finally{
            loading.value = false
        }
    }

    const handleDelete = async () => {
        loading.value = true
        try{
            const response = await api.delete(`/plants/remove/`, {
                data: {
                    id: props._id
                }
            })
            router.push({ name: 'View' })
            $toast.success(`${name.value} was successfully deleted`, toastConfig('success'));
        }
        catch(err){
            if(err?.response?.data?.message){
                $toast.error(`Error deleting plant: ${err.response.data.message}`, toastConfig('error'));
            }
            else if(err?.message){
                $toast.error(`Error deleting plant: ${err.message}`, toastConfig('error'));
            }
            else{
                $toast.error('Error deleting plant', toastConfig('error'));
            }
            return;
        }
        finally{
            loading.value = false
        }
    }
</script>

<template>
    <div id="wrapper">
        <Loading v-if="loading" />
        <form @submit.prevent="handleSubmit" v-else>
            <h1>Update {{  originalFields.name }}</h1>
            <div>
                <label for="plant-name">Name</label>
                <input type="text" id="plant-name" name="name" required v-model="name">
            </div>
            <div>
                <label for="plant-species">Species</label>
                <input type="text" id="plant-species" name="species" required v-model="species">
            </div>
            <div>
                <label for="plant-description">Description</label>
                <textarea type="textarea" id="plant-description" name="description" required v-model="description">
                </textarea>
            </div>
            <div>
                <label for="garden">Season</label>
                <SeasonDropdown v-model="season"/>
            </div>
            <div>
                <label for="garden">Garden: <i> Optional </i></label>
                <GardenDropdown v-model="garden"/>
            </div>
            <div>
                <label for="plant-visibility">Visibility</label>
                <VisibilityDropdown v-model="visibility"/>
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
                <button id="update" type="submit" @click="handleUpdate">Update</button>
                <div class="btn-group">
                    <button id="cancel" type="button" @click="router.push('/view')">Cancel</button>
                    <button id="delete" type="button" @click="handleDelete">Delete</button>
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
        border: 1px solid var(--primary);
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
    @media (max-width: 600px) {
        .btn-toolbar {
            flex-direction: column;
            row-gap: 5px;
            align-items: stretch;
        }
        .btn-toolbar button {
            width: 100%;
        }
        .btn-group{
            display: flex;
            flex-direction: column;
            row-gap: 5px;
            align-items: stretch;
            justify-content: start;
        }
        .btn-group button {
            width: 100%;
        }
    }
    #update{
        background: rgb(10, 174, 10);
        color: white;
    }
    #cancel{
        background: lightgray;
        color: black;
    }
    #delete{
        background: rgb(242, 52, 52);
        color: white;
    }
    input, textarea {
        border: 1px solid var(--primary);
        border-radius: 5px;
        padding: 5px;
    }
</style>