<script setup>
    import { onMounted, ref } from 'vue'
    import api from '../../api';
    import Loading from '../Loading.vue'

    import { useToast } from 'vue-toast-notification';
    import 'vue-toast-notification/dist/theme-sugar.css';
    import toastConfig from '../../assets/toastNotification';

    const props = defineProps({
        _id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true
        }
    })
    const emit = defineEmits(['cancel', 'update']);

    const editedName = ref(props.name)
    const editedDescription = ref(props.description)
    const loading = ref(false)
    const $toast = useToast();

    const handleUpdateGarden = async () => {
        if (editedName.value === '' || editedDescription.value === '') {
            $toast.error('Please fill in all fields', toastConfig('error'))
            return;
        }
        if (editedName.value === props.name && editedDescription.value === props.description){
            $toast.error('Please make some changes before updating', toastConfig('error'))
            return
        }

        const body = {}
        // Only include edited fields in the request body
        if(editedName.value !== props.name){
            body.name = editedName.value
        }
        if(editedDescription.value !== props.description){
            body.description = editedDescription.value
        }

        loading.value = true
        try{
            const response = await api.patch(`/gardens/update/${props._id}`, body)
            const garden = response.data.data
            $toast.success(`Garden ${gardenName.value} updated`, toastConfig('success'));
            emit('update', garden);
        } catch(err) {
            if(err?.response?.data?.message){
                $toast.error(`Error creating garden: ${err.response.data.message}`, toastConfig('error'));
            }
            else if(err.message){
                $toast.error(`Error creating garden: ${err.message}`, toastConfig('error'));
            }
            else{
                $toast.error('Error creating garden', toastConfig('error'));
            }
        } finally {
            loading.value = false;
        }
    };
</script>

<template>
    <div class="overlay">
        <form @submit.prevent>
            <h1>Update Garden</h1>
            <div class="input-group">
                <div class="input-wrapper">
                    <label for="gardenName">Name</label>
                    <input type="text" id="gardenName" v-model="editedName" />
                </div>
                <div class="input-wrapper">
                    <label for="description">Description</label>
                    <textarea id="description" v-model="editedDescription" required></textarea>
                </div>
            </div>
            <div class="loading-wrapper" v-if="loading">
                <Loading />
            </div>
            <div class="btn-toolbar">
                <button id="create" type="button" @click="handleUpdateGarden">
                    Update
                </button>
                <button id="cancel" type="button" @click="emit('cancel')">Cancel</button>
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
}
textarea{
    font-size: 1.2rem;
    height: 100px;
    resize: none;
    font-family: 'Verdana', 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif
}
.input-group{
    display: flex;
    flex-direction: column;
    align-items: stretch;
    row-gap: 20px;
}
.input-group > div{
    display: flex;
    flex-direction: column;
    font-size: 1.5rem;
    width: 100%;
}
input, textarea, select{
    font-size: 1.5rem;
    padding: 4px;
}
.loading-wrapper{
    display: flex;
    justify-content: center;
    align-items: center;
}
.btn-toolbar{
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    column-gap: 10px;
}
.btn-toolbar button{
    padding: 10px;
    border-radius: 5px;
    color: black;
    border: none;
}
.btn-toolbar button:hover{
    cursor: pointer;
    opacity: 80%;
}
#create{
    background: rgb(10, 174, 10);
    color: white;
    white-space: nowrap;
}
#cancel{
    background: lightgray;
}
</style>