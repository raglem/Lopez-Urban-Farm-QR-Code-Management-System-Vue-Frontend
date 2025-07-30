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
        garden: {
            type: Object,
            required: false,
        },
        visibility: {
            type: Boolean,
            required: true
        },
        image: {
            type: String,
            required: false,
        },
        edit: {
            type: Boolean,
            required: true
        }
    })
    const emit = defineEmits(['delete-plant', 'toggle-visibility'])

    const visibility = ref(props.visibility)
    const loading = ref(false)
    const $toast = useToast()

    const handlePlant = () => {
        router.push({
            name: 'Plant',
            params: {
                name: props.name,
                species: props.species,
                description: props.description,
                image: props.image,
            }
        });
    }
    const handleUpdate = () => {
        router.push({
            name: 'Update',
            params: {
                _id: props._id,
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
    const handleToggleVisibility = async () => {
        const fd = new FormData()
        fd.append('id', props._id)
        fd.append('visibility', !props.visibility)
        try{
            const res = await api.patch(`/plants/update/`, fd, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            $toast.success(`Visibility for ${props.name} set to ${!visibility.value ? 'public': 'private'}`, toastConfig('success'))
        }
        catch(err){
            console.log(err);
            if (err?.response?.data?.message) {
                $toast.error(`Error toggling visibility: ${err.response.data.message}`, toastConfig('error'));
            } else if (err.message) {
                $toast.error(`Error toggling visibility: ${err.message}`, toastConfig('error'));
            } else {
                $toast.error('Error toggling visibility', toastConfig('error'));
            }
        }

        // Update state in parent and child
        emit('toggle-visibility', props._id, !visibility.value)
        visibility.value = !visibility.value
    }
</script>

<template>
    <article :class="visibility ? null : 'invisible'">
        <header>
            <div class="btn-toolbar">
                <i
                    class="pi pi-eye"
                    v-if="edit && visibility"
                    @click="handleToggleVisibility"
                ></i>
                <i
                    class="pi pi-eye-slash"
                    v-if="edit && !visibility"
                    @click="handleToggleVisibility"
                ></i>
                <i
                    class="pi pi-eye-slash"
                    :class="'default'"
                    v-if="!edit && !visibility"
                ></i>
                <div v-if="props.garden" class="column">
                    <h4 @click="handlePlant">{{ props.name }} | Garden: {{ props.garden.name }}</h4>
                    <text><i>Species: {{ props.species }}</i></text>
                </div>
                <div v-else>
                    <h4 @click="handlePlant">{{ props.name }} | Species: {{ props.species }}</h4>
                </div>
            </div>
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
        <p> 
            <img 
                :src="props.image"
                alt="Plant Image" 
                v-if="props.image"
            /> 
            {{ props.description }} 
        </p>
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
    article.invisible{
        background-color: lightgray;
    }
    header{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        column-gap: 5px;
        padding: 10px 10px;
        height: 50px;
        min-height: fit-content;
        border-bottom: 1px solid black;
    }
    header .column{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
    }
    header .column > text{
        font-size: 0.8rem;
        color: black;
    }
    header > .btn-toolbar{
        display: flex;
        flex-direction: row;
        align-items: center;
        column-gap: 8px;
    }
    header h4{
        margin: 0;
    }
    header i.pi-eye, header i.pi-pencil{
        color: var(--primary);
    }
    header i.pi-trash{
        color: red;
    }
    header i:hover{
        cursor: pointer;
        opacity: 80%;
    }
    i.pi-eye-slash{
        color: gray;
    }
    i.default:hover{
        cursor: default;
        opacity: 100%;
    }
    p{
        display: flex;
        flex-direction: row;
        column-gap: 10px;
        row-gap: 10px;
        padding: 0px 10px;
        text-align: left;
    }
    p > img{
        float: left;
        width: 30%;
        border-radius: 5px;
        object-fit: cover;
    }
    @media (max-width: 600px) {
        p{
            flex-direction: column;
        }
        p > img{
            width: 100%;
        }
    }
    h4:hover{
        cursor: pointer;
        color: var(--primary);
        text-decoration: underline;
    }
</style>