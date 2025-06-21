<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css';
import toastConfig from '../assets/toastNotification.js'

import api from '../api.js'

const name = ref('')
const species = ref('')
const description = ref('')
const $toast = useToast();

const router = useRouter()

const handleSubmit = async () => {
    try{
        const response = await api.post('/plants/add', {
            name: name.value,
            species: species.value,
            description: description.value
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
        return;
    }
}

const handlePreview = () => {
    router.push('/plant', {
        preview: true,
        name: name.value,
        species: species.value,
        description: description.value
    })
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