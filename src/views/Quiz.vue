<script setup>
    import { ref, onMounted, onUnmounted } from 'vue'
    import { useRouter } from 'vue-router'
    import { useToast } from 'vue-toast-notification'
    import 'vue-toast-notification/dist/theme-sugar.css';
    
    import AddScore from '../components/Quiz/AddScore.vue'
    import api from '../api.js'
    import Match from '../components/Quiz/Match.vue'
    import Leaderboard from '../components/Quiz/Leaderboard.vue'
    import toastConfig from '../assets/toastNotification.js'

    // Game state
    const gameInProgress = ref(false)
    const addScoreInProgress = ref(false)

    // Track the current user
    const currentLeaderId = ref(localStorage.getItem('LEADER_ID'))
    const currentLeaderName = ref(null)

    // Stopwatch logic
    let stopwatchId = null
    const stopwatch = ref(0)

    // Leaderboards data
    const leaderboard = ref([])
    const loadingLeaderboard = ref(false)
    const currentLeaderboardPage = ref(1)
    const itemsPerPage = 5;

    const router = useRouter()
    const $toast = useToast()

    onMounted(async () => {
        // Fetch leaderboards data
        loadingLeaderboard.value = true
        try{
            const response = await api.get('/quiz/leaderboard')
            const fetchedLeaderboard = response.data.leaderboard
            fetchedLeaderboard.sort((a, b) => a.score - b.score)
            leaderboard.value = fetchedLeaderboard

            // Initialize the state variables tracking the current user is a leaderId is saved
            if(currentLeaderId.value !== null){
                const currentLeader = fetchedLeaderboard.find(l => l._id === currentLeaderId.value)
                if(currentLeader){
                    currentLeaderName.value = currentLeader.name
                }
                else if(currentLeaderId.value !== null){
                    // The leader_id saved in localStorage is not valid, so we clear it
                    localStorage.removeItem('LEADER_ID')
                    console.log("Clearing LEADER_ID from localStorage")
                }
            }
        }
        catch(err){
            console.log(err)
            if(err?.response?.data?.message){
                $toast.error(`Error fetching leaderboard: ${err.response.data.message}`, toastConfig('error'));
            }
            else if(err.message){
                $toast.error(`Error fetching leaderboard: ${err.message}`, toastConfig('error'));
            }
            else{
                $toast.error('Error fetching leaderboard', toastConfig('error'));
            }
        }
        finally{
            loadingLeaderboard.value = false
        }
    })
    onUnmounted(() => {
        // Stop the stopwatch when the component is unmounted
        clearInterval(stopwatchId)
    })

    const startGame = () => {
        // Reset stopwatch when starting a new game
        stopwatch.value = 0
        stopwatchId = setInterval(() => {
            stopwatch.value += .1
        }, 100)
        gameInProgress.value = true
    }
    const endGame = async () => {
        // Stop the stopwatch when the game ends and store the time
        clearInterval(stopwatchId)
        const timeTaken = stopwatch.value
        gameInProgress.value = false

        const existingLeader = currentLeaderId.value ? leaderboard.value.find(l => l._id === currentLeaderId.value) : null
        // Check if the leader ID exists
        if(existingLeader){
            // If they are, update their score if the new time is better
            if(timeTaken < existingLeader.score){
                existingLeader.score = timeTaken
                $toast.success(`Congratulations ${currentLeaderName.value}! Your new best time is ${timeTaken.toFixed(1)} seconds.`, toastConfig('success'))
                // Update the current leaderboard
                leaderboard.value = leaderboard.value.map(l => l._id !== currentLeaderId.value ? l : {
                    _id: l._id,
                    name: l.name,
                    score: timeTaken.toFixed(1)
                }).sort((a,b) => a.score - b.score)
                // Send POST request to update the new score in the leaderboard collection
                try{
                    await updateLeaderboard({ _id: currentLeaderId.value, name: currentLeaderName.value, score: timeTaken })
                }
                catch(err){
                    if(err.response.data.message){
                        $toast.error(`Error saving score: ${err.response.data.message}`, toastConfig('error'));
                    }
                    else if(err.message){
                        $toast.error(`Error saving score: ${err.message}`, toastConfig('error'));
                    }
                    else{
                        $toast.error('Error saving score', toastConfig('error'));
                    }
                }
            }
            changeLeaderboardPageToCurrentLeader()
        }
        else{
            // If the user doesn't have a leader ID, prompt them to enter their name and send POST request
            // This will be handled by handleNewScore
            addScoreInProgress.value = true
        }
    }
    const cancelGame = () => {
        // Stop the stopwatch when the game ends
        clearInterval(stopwatchId)
        gameInProgress.value = false
    }
    const handleNewScore = async ({ name, score}) => {
        addScoreInProgress.value = false
        try{
            const response = await updateLeaderboard({ name, score })
            const leader = response.data.leader

            leaderboard.value = [...leaderboard.value, leader].sort((a,b) => a.score - b.score)
            
            // Track the current user/leader
            currentLeaderId.value = leader._id
            currentLeaderName.value = name
            localStorage.setItem('LEADER_ID', leader._id)

            changeLeaderboardPageToCurrentLeader()
            $toast.success(`Score of ${score.toFixed(1)} saved`, toastConfig('success'))
        }
        catch(err){
            if(err?.response?.data?.message){
                $toast.error(`Error saving score: ${err.response.data.message}`, toastConfig('error'));
            }
            else if(err.message){
                $toast.error(`Error saving score: ${err.message}`, toastConfig('error'));
            }
            else{
                $toast.error('Error saving score', toastConfig('error'));
            }
        }
    }
    // Change the current page to the one with the current leader
    const changeLeaderboardPageToCurrentLeader = () => {
        const rank = leaderboard.value.findIndex(l => l._id == currentLeaderId.value)
        currentLeaderboardPage.value = Math.ceil(rank / itemsPerPage)
    }
    // API route to update the leaderboard
    const updateLeaderboard = async ({ _id, name, score }) => {
        if(!_id){
            const response = await api.post(`/quiz/add-score`, { name, score: score.toFixed(1) })
            return response
        }
        else{
            const response = await api.post(`/quiz/add-score/${_id}`, { name, score: score.toFixed(1) })
            return response
        }
    }
</script>

<template>
    <AddScore :score="stopwatch" v-if="addScoreInProgress" @submit="handleNewScore"/>
    <div class="wrapper">
        <header>
            <div class="stopwatch-wrapper">
                <span>
                    <text>
                        {{ stopwatch.toFixed(1) }}
                    </text>
                </span>
            </div>
            <div class="title-wrapper">
                <h1>Matching Quiz</h1>
                <p>Match the plant names with their images or species.</p>
            </div>
            <nav>
                <button class="btn-start" @click="startGame" v-if="!gameInProgress">Start Game</button>
                <button class="btn-end" @click="cancelGame" v-else>Stop Game</button>
                <button class="btn-view" @click="() => router.push('/view')">View Plants</button>
            </nav>
        </header>
        <div class="quiz-wrapper">
            <Match v-if="gameInProgress" @game-over="endGame"/>
            <Leaderboard
                :leaderboard="leaderboard"
                :leaderId="currentLeaderId"
                v-model:currentPage="currentLeaderboardPage"
                :loading="loadingLeaderboard"
                v-else
            />
        </div>
    </div>
</template>

<style scoped>
    .wrapper{
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100vw;
        box-sizing: border-box;
        padding: 20px;
        row-gap: 20px;
        overflow-y: scroll;
    }
    header{
        display: flex;
        flex-direction: column;
        align-items: stretch;
        row-gap: 10px;
        box-sizing: border-box;
        padding: 10px;
        width: 100%;
    }
    header > .stopwatch-wrapper{
        display: flex;
        justify-content: flex-end;
        width: 100%;
    }
    @media (min-width: 600px) {
        header > .stopwatch-wrapper{
            position: absolute;
            right: 20px;
            top: 20px;
        }
    }
    header > .stopwatch-wrapper > span{
        display: flex;
        justify-content: center;
        align-items: center;
        min-width: 100px;
        position: relative;
        box-sizing: border-box;
        padding: 4px 10px;
        background: var(--primary-gradient);
        color: white;
        border-radius: 10px;
    }
    header > .title-wrapper{
        display: flex;
        flex-direction: column;
        align-items: center;
        row-gap: 5px;
        width: 100%;
    }
    header > .title-wrapper > h1{
        font-size: 2rem;
        margin: 0;
        font-weight: normal;
    }
    header > .title-wrapper > p{
        font-size: 1rem;
        margin: 0;
    }
    .quiz-wrapper{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
    }
    nav{
        display: flex;
        flex-direction: row;
        justify-content: center;
        width: 100%;
        box-sizing: border-box;
        padding: 10px;
        column-gap: 10px;
    }
    nav > button{
        padding: 10px 20px;
        border-radius: 5px;
        color: white;
        border: none;
        cursor: pointer;
        font-size: 1rem;
    }
    nav > button.btn-start{
        background-color: var(--primary);
    }
    nav > button.btn-end{
        background-color: red;
    }
    nav > button.btn-view{
        background-color: lightgray;
        color: black;
    }
</style>
