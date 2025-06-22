<script setup>
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { useToast } from 'vue-toast-notification'
    import 'vue-toast-notification/dist/theme-sugar.css';

    import api from '../api'
    import Download from './Download.vue'
    import toastConfig from '../assets/toastNotification';
    
    const router = useRouter()
    const props = defineProps({
        _id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        species: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        edit: {
            type: Boolean,
            required: true
        }
    })
    const emit = defineEmits(['delete-plant'])

    const loading = ref(false)
    const $toast = useToast()

    const handlePlant = () => {
        router.push({
            name: 'Plant',
            params: {
                name: props.name,
                species: props.species,
                description: props.description
            }
        });
    }
    const handleUpdate = () => {
        router.push({
            name: 'Update',
            params: {
                _id: props._id,
                name: props.name,
                species: props.species,
                description: props.description
            }
        });
    }
    const handleDelete = async () => {
        loading.value = true
        try{
            const response = await api.delete(`/plants/remove/`, {
                data: {
                    id: props._id
                }
            })
            emit('delete-plant', props._id);
            $toast.success(`${props.name} was successfully deleted`, toastConfig('success'));
        }
        catch(err){
            console.log(err)
            if(err?.response?.data?.message){
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
    <article>
        <header>
            <h4 @click="handlePlant">{{ props.name }} | Species: {{ props.species }}</h4>
            <span class="btn-toolbar" v-if="edit">
                <i 
                    class="pi pi-pencil" 
                    v-if="edit" 
                    @click="handleUpdate"
                >
                </i>
                <i 
                    class="pi pi-trash" 
                    v-if="edit" 
                    @click="handleDelete"
                ></i>
            </span>
            <Download 
                :_id="props._id" 
                :name="props.name"
                v-if="edit === false"
            />
        </header>
        <p> {{ props.description }} </p>
    </article>
</template>

<style scoped>
    article{
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        border: 1px solid black;
        box-shadow: 0px 0px 5px black;
    }
    header{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0px 10px;
        height: 30%;
        border-bottom: 1px solid black;
    }
    header > .btn-toolbar{
        display: flex;
        column-gap: 5px;
    }
    header i{
        color: var(--primary);
    }
    header i.pi-trash{
        color: red;
    }
    header i:hover{
        cursor: pointer;
    }
    p{
        padding: 0px 5px;
        text-align: left;
    }
    h4:hover{
        cursor: pointer;
        color: var(--primary);
        text-decoration: underline;
    }
</style>