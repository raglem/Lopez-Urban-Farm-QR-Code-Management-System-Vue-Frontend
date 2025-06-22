<script setup>
    import { ref } from 'vue'
    import { useRouter } from 'vue-router';
    import { useToast } from 'vue-toast-notification'
    import 'vue-toast-notification/dist/theme-sugar.css';

    import api from '../api.js'
    import Loading from '../components/Loading.vue'
    import toastConfig from '../assets/toastNotification.js'

    const props = defineProps({
        _id: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        species: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        }
    })

    const name = ref(props.name)
    const species = ref(props.species)
    const description = ref(props.description)
    const loading = ref(false)
    const router = useRouter()
    const $toast = useToast()

    const checkFields = () => {
        if(!name.value || !species.value || !description.value){
            $toast.error('Please fill in all fields', toastConfig('error'));
            return false;
        }
        return true;
    }

    const handleUpdate = async () => {
        if(!checkFields()) return
        loading.value = true
        try{
            const response = await api.patch('/plants/update', {
                id: props._id,
                name: name.value,
                species: species.value,
                description: description.value
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
            if(err.response.data.message){
                $toast.error(`Error updating plant: ${err.response.data.message}`, toastConfig('error'));
            }
            else if(err.message){
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
            if(err.response.data.message){
                $toast.error(`Error deleting plant: ${err.response.data.message}`, toastConfig('error'));
            }
            else if(err.message){
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
        <form @submit.prevent="handleSubmit">
            <h1>Update {{  props.name }}</h1>
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
    }
    form div{
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }
    form div label{
        font-size: 1.5rem;
    }
    form div input{
        width: 99%;
        font-size: 1.5rem;
    }
    form div textarea{
        width: 99%;
        font-size: 1.5rem;
        height: 100px;
        resize: none;
        font-family: 'Verdana', 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif
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
</style>