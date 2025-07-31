<script setup>
    import { ref, onMounted, onUnmounted } from 'vue'
    import Loading from '../Loading.vue'
    import { useToast } from 'vue-toast-notification'
    import 'vue-toast-notification/dist/theme-sugar.css';

    import api from '../../api.js'
    import toastConfig from '../../assets/toastNotification.js'

    const emit = defineEmits(['game-over'])

    const fetchingQuestions = ref(false)
    const questionCards = ref([])
    const selectedCard = ref(null)
    // Pairs that are currently being matched
    const matchedPair = ref([])
    // Pairs that are currently being matched as wrong
    const wrongPair = ref([])
    // Matched pairs that are now resolved and not visible
    const resolvedPairs = ref([])

    const $toast = useToast()

    onMounted(async () => {
        fetchingQuestions.value = true
        // Fetch the match pairs
        try {
            const response = await api.get('/quiz')
            const fetchedQuestions = response.data.questions
            fetchedQuestions.forEach((question, i) => {
                // the pairId allows you check whether it's a matching pair
                // the cardId allows you check whether it's the same card or not
                questionCards.value.push({
                    content: question.name,
                    contentType: 'name',
                    pairId: i,
                    cardId: i*2,
                })
                questionCards.value.push({
                    content: question.questionType === 'image' ? question.image : question.species,
                    contentType: question.questionType,
                    pairId: i,
                    cardId: i*2 + 1,
                })
            })
            questionCards.value.sort(() => Math.random() - 0.5) // Shuffle the questions
            }
        catch(err){
            if(err.response.data.message){
                $toast.error(`Error creating quiz: ${err.response.data.message}`, toastConfig('error'));
            }
            else if(err.message){
                $toast.error(`Error creating quiz: ${err.message}`, toastConfig('error'));
            }
            else{
                $toast.error('Error creating quiz', toastConfig('error'));
            }
        }
        finally{
            fetchingQuestions.value = false
        }
    })

    const handleSelect = async (card) => {
        // Check if we're currently matching
        if(matchedPair.value.length > 0 || wrongPair.value.length > 0){
            return
        }
        // Check if the card is already resolved
        if(resolvedPairs.value.includes(card.pairId)){
            return
        }
        // Deselect card
        if(selectedCard.value && selectedCard.value.cardId === card.id){
            selectedCard.value = null
            return
        }
        // Select new card
        if(!selectedCard.value){
            selectedCard.value = card
            return
        }
        // Try matching the selected card with the current card
        if(selectedCard.value){
            // Check if the selected card is the same as the current card
            if(selectedCard.value.pairId === card.pairId){
                // Set the pair as matched for .5 seconds
                matchedPair.value = [card.cardId, selectedCard.value.cardId]
                await new Promise(resolve => setTimeout(resolve, 500))
                
                // Push the matched pair to resolvedPairs
                resolvedPairs.value.push(card.pairId)

                // Reset the selectedCard and matched pair
                selectedCard.value = null
                matchedPair.value = []

                // Check if all pairs are resolved
                if(resolvedPairs.value.length === questionCards.value.length / 2){
                    emit('game-over')
                }
            }
            else{
                // Set the pair as wrong for .5 seconds
                wrongPair.value = [selectedCard.value.cardId, card.cardId]
                await new Promise(resolve => setTimeout(resolve, 500))
                wrongPair.value = []

                // Reset the selectedCard and wrong pair
                selectedCard.value = null
                wrongPair.value = []
            }
        }
    }
</script>

<template>
    <div class="loading-wrapper" v-if="fetchingQuestions">
        <text>Preparing quiz...</text>
        <Loading />
    </div>
    <div class="quiz-wrapper" v-else>
        <div class="grid-wrapper">
            <div 
                v-for="(card, index) in questionCards" :key="index" 
                :class="{
                    'card-resolved': resolvedPairs.includes(card.pairId),
                    'card-matched': matchedPair.includes(card.cardId),
                    'card-wrong': wrongPair.includes(card.cardId),
                    'card-selected': selectedCard && selectedCard.cardId === card.cardId,
                    'card': true
                }"
                @click="() => handleSelect(card)"
            >
                <img v-if="card.contentType === 'image'" :src="card.content" alt="Plant Image" />
                <span v-else>{{ card.content }}</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .grid-wrapper{
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
        box-sizing: border-box;
        padding: 10px 20px;
        max-width: 1400px;
    }
    @media (min-width: 768px) {
        .grid-wrapper{
            grid-template-columns: repeat(3, 1fr);
        }
    }
    @media (min-width: 1024px) {
        .grid-wrapper{
            grid-template-columns: repeat(4, 1fr);
        }
    }
    .card, .card-selected, .card-matched, .card-wrong, .card-resolved{
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        padding: 10px;
        border: 1px solid black;
        background-color: white;
        border-radius: 10px;
        min-width: 140px;
        min-height: 140px;
        max-width: 300px;
        max-height: 300px;
        height: 150px;
        width: 40vw;
        color: black;
    }
    @media (min-width: 768px){
        .card, .card-selected, .card-matched{
            width: 30vw;
        }
    }
    @media (min-width: 1024px){
        .card, .card-selected, .card-matched{
            width: 20vw;
        }
    }
    .card-selected{
        border: none;
        background-color: var(--primary-light);
        color: white;
        transition: background-color 0.3s ease-in-out;
    }
    .card-matched{
        background-color: var(--primary);
        transition: background-color 0.3s ease-in-out;
    }
    .card-wrong{
        background-color: red;
        color: white;
        transition: background-color 0.3s ease-in-out;
    }
    .card-resolved{
        opacity: 0;
    }
    .card:hover, .card-selected:hover{
        cursor: pointer;
        opacity: 0.8;
    }
    .card-resolved:hover{
        cursor: auto;
        opacity: 0;
    }
    img{
        max-width: 100%;
        max-height: 100%;
        object-fit: cover;
        border-radius: 20px;
    }
    .loading-wrapper{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        row-gap: 20px;
        height: 100%;
        width: 100%;
    }
    .loading-wrapper text{
        font-size: 1.5rem;
        color: var(--primary);
        animation: loading-text 1.5s infinite;
    }
    @keyframes loading-text {
        0% {
            opacity: 0.2;
        }
        50% {
            opacity: 1;
        }
        100% {
            opacity: 0.2;
        }
    }

</style>
