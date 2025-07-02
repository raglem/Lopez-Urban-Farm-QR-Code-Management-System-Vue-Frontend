<script setup>
    import { ref } from 'vue'
    const props = defineProps({
        score: {
            type: Number,
            required: true
        },
    })
    const emit = defineEmits(['submit'])
    const name = ref(null)

    const generateRandomName = () => {
        const fruits = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape', 'Honeydew', 'Kiwi', 'Lemon'];
        const noun = ['Lover', 'Enjoyer', 'Enthusiast', 'Admirer', 'Supporter', 'Champion', 'Believer', 'Dreamer', 'Explorer', 'Creator'];
        const randomFruitIndex = Math.floor(Math.random() * fruits.length);
        const randomNounIndex = Math.floor(Math.random() * noun.length);
        return `${fruits[randomFruitIndex]} ${noun[randomNounIndex]}`;
    }
</script>

<template>
    <div class="overlay">
        <div class="add-score-wrapper">
            <p>
                Congratulations! You got a time of {{ score.toFixed(1) }} seconds. 
                Would you like to add your name to the leaderboard?
            </p>
            <div class="input-wrapper">
                <input type="text" placeholder="Name" v-model="name" />
                <i>
                    If left blank, a random name will be generated for you.
                </i>
            </div>
            <div class="btn-wrapper">
                <button class="btn-submit" @click="emit('submit', { name: name || generateRandomName(), score: props.score })">
                    Submit
                </button>
                <button class="btn-skip" @click="emit('submit', { name: generateRandomName(), score: props.score })">
                    Skip
                </button>
            </div>
        </div>
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
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
    .add-score-wrapper{
        display: flex;
        flex-direction: column;
        align-items: stretch;
        min-width: 300px;
        width: 50vw;
        max-width: 600px;
        background-color: white;
        row-gap: 10px;
        padding: 20px;
        box-shadow: 0px 0px 40 rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        z-index: 2;
    }
    p{
        margin: 0;
    }
    .input-wrapper{
        display: flex;
        flex-direction: column;
        width: 100%;
        row-gap: 5px;
    }
    .input-wrapper > input{
        flex: 1;
        padding: 10px;
        border: 1px solid var(--primary);
        border-radius: 5px;
        font-size: 16px;
    }
    .input-wrapper > i{
        box-sizing: border-box;
        padding: 0px 2px;
        font-size: 0.8rem;
        color: gray;
    }
    .btn-wrapper{
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        column-gap: 10px;
    }
    .btn-wrapper button{
        display: flex;
        justify-content: center;
        padding: 10px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }
    .btn-wrapper > .btn-submit{
        background-color: var(--primary);
        color: white;
        border: none;
    }
    .btn-wrapper > .btn-skip{
        background-color: lightgray;
        color: black;
        border: none;
    }
</style>

