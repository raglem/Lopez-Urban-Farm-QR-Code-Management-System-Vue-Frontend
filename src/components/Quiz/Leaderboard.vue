<script setup>
    import { ref, computed } from 'vue';
    import Loading from '../Loading.vue'
    const props = defineProps({
        leaderboard: {
            type: Object,
            required: true
        },
        leaderId: {
            type: String,
        },
        loading: {
            type: Boolean,
            required: true
        }
    });
    // Change the currentPage from the parent and the child
    const currentPage = defineModel('currentPage')
    const itemsPerPage = 5
    const displayedLeaders = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage;
        return props.leaderboard.slice(start, Math.min(props.leaderboard.length, start + itemsPerPage));
    });

    const handlePageChange = (direction) => {
        const totalPages = Math.ceil(props.leaderboard.length / itemsPerPage);
        if (direction === 'next') {
            currentPage.value = Math.min(totalPages, currentPage.value + 1);
        } else if (direction === 'prev') {
            currentPage.value = Math.max(1, currentPage.value - 1);
        }
    };
</script>

<template>
    <div class="leaderboard-wrapper" v-if="!props.loading">
        <h2>Leaderboard</h2>
        <ol class="rankings">
            <li :class="props.leaderId === leader._id ? 'highlighted': null" v-for="(leader, i) in displayedLeaders" :key="i">
                <div>
                    <span class="rank">{{ i + 1 + (currentPage - 1) * itemsPerPage }}</span>
                    <span class="name">{{ leader.name }}</span>
                </div>
                <div>
                    <span class="score">{{ leader.score }} seconds</span>
                </div>
            </li>
        </ol>
        <nav class="pagination">
            <i class="pi pi-caret-left" @click="() => handlePageChange('prev')"></i>
            <span>{{ currentPage }}</span>
            <i class="pi pi-caret-right" @click="() => handlePageChange('next')"></i>
        </nav>
    </div>
    <div class="loading-wrapper" v-else>
        <text>Fetching leaderboard...</text>
        <Loading />
    </div>
</template>

<style scoped>
    .leaderboard-wrapper{
        display: flex;
        flex-direction: column;
        align-items: stretch;
        padding: 20px;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        row-gap: 10px;
        width: 80vw;
        max-width: 600px;
    }
    .leaderboard-wrapper h2{
        text-align: center;
        margin: 0;
        padding: 0;
        font-weight: normal;
    }
    .rankings{
        display: flex;
        flex-direction: column;
        height: 240px;
        width: 100%;
        box-sizing: border-box;
        padding: 10px;
    }
    li{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        border-bottom: 1px solid var(--primary);
    }
    li.highlighted{
        background-color: var(--primary);
        color: white;
    }
    li div{
        display: flex;
        flex-direction: row;
        column-gap: 10px;
    }
    nav{
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        column-gap: 10px;
    }
    nav i{
        cursor: pointer;
        font-size: 1.5rem;
        color: var(--primary);
    }
    nav i:hover{
        opacity: 0.8;
    }
    nav span{
        font-size: 1.2rem;
    }
    .loading-wrapper{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 20px;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        row-gap: 10px;
        width: 80vw;
        max-width: 600px;
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