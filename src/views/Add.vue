<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css';
import plants from '../assets/plants.json'

const name = ref('')
const species = ref('')
const description = ref('')
const $toast = useToast();

const router = useRouter()

const handleSubmit = () => {
    $toast.success(`${name.value} was successfully added`, toastConfig('success'));
    router.push('/view')
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
        border-color: green;
        border-width: 1px;
        border-style: solid;
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
    }
    .btn-group{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        column-gap: 10px;
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