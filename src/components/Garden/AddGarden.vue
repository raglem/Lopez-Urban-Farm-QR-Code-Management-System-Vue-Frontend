<script setup>
    import { onMounted, ref } from 'vue'
    import api from '../../api';
    import Loading from '../Loading.vue'

    import { useToast } from 'vue-toast-notification';
    import 'vue-toast-notification/dist/theme-sugar.css';
    import toastConfig from '../../assets/toastNotification';

    const gardenName = ref('')
    const description = ref('')
    const visibility = ref('Public')
    const loading = ref(false)
    const $toast = useToast();

    const emit = defineEmits(['close', 'gardenAdded']);

    const handleCreateGarden = async () => {
        if (!gardenName.value || !description.value) {
            $toast.error('Please fill in all fields', toastConfig('error'));
            return;
        }

        loading.value = true
        try{
            const response = await api.post('/gardens/add/', {
                name: gardenName.value,
                description: description.value,
                visibility: true,
            })
            $toast.success(`Garden ${gardenName.value} created`, toastConfig('success'));
            emit('gardenAdded', response.data.data);
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
            <h1>New Garden</h1>
            <div class="input-group">
                <div class="input-wrapper">
                    <label for="gardenName">Name</label>
                    <input type="text" id="gardenName" v-model="gardenName" />
                </div>
                <div class="input-wrapper">
                    <label for="description">Description</label>
                    <textarea id="description" v-model="description" required></textarea>
                </div>
                <div class="input-wrapper">
                    <label for="visibility">Visibility</label>
                    <select id="visibility" name="visibility" required v-model="visibility">
                        <option>Public</option>
                        <option>Private</option>
                    </select>
                </div>
            </div>
            <div class="loading-wrapper" v-if="loading">
                <Loading />
            </div>
            <div class="btn-toolbar">
                <button id="create" type="button" @click="handleCreateGarden">
                    Create Garden
                </button>
                <button id="cancel" type="button" @click="emit('close')">Cancel</button>
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