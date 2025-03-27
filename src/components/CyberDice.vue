<script setup>
import { ref, computed, nextTick, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { updateStorage } from '@/composables/storageUtils';
import CyberText from './CyberText.vue';
import CyberTextFlow from './CyberTextFlow.vue';
import CloseX from './icons/CloseX.vue';
import DotMenu from './icons/DotMenu.vue';
import Plus from './icons/Plus.vue';
import BackArrow from './icons/BackArrow.vue';
import Drawer from './Drawer.vue';

const defaultGameData = {
  setupStep: 1,
  players: [],
  totalRounds: 20,
  started: false,
  gameOver: false,
  currentRound: 1,
  currentScore: 0,
  currentPlayerId: 1,
  currentRoundRolls: []
}

const gameData = ref(defaultGameData);

const playersStillIn = computed(() => {
  return gameData.value.players.filter((player) => player.out === false);
});

const playerTurnIndex = computed(() => {
  return playersStillIn.value.findIndex(player => player.id === gameData.value.currentPlayerId);
});

watch((gameData), () => {
  updateStorage(localStorage, 'gameData', JSON.stringify(gameData.value))
}, {deep: true});

const router = useRouter();

const inputValue = ref('');   

const inputRef = ref(null);

const playerList = ref(null);

const drawerOpen = ref(false);

const drawerType = ref('');

function openDrawer(type) {
  drawerOpen.value = true;
  drawerType.value = type;
};

function closeDrawer() {
  drawerOpen.value = false;
};

onMounted(() => {
  if (localStorage.getItem('gameData')) {
    gameData.value = JSON.parse(localStorage.getItem('gameData'))
  }
  focusInput();
});

const focusInput = () => {
  if (inputRef.value) {
    inputRef.value?.focus();
  }
};

function addPlayer() {
  if (inputValue.value !== '') {
    gameData.value.players.push({id: gameData.value.players.length + 1, name: inputValue.value.trim(), score: 0, out: false});
    inputValue.value = '';
    focusInput();
    nextTick(() => {
      if (playerList.value) {
        playerList.value.scrollTop = playerList.value.scrollHeight;
      }
    });
  }
};

function removePlayer(id) {
  const playerIndex = gameData.value.players.findIndex((player) => player.id === id);
  gameData.value.players.splice(playerIndex, 1);
};

function advanceStep() {
  gameData.value.setupStep++;
};

function backStep() {
  gameData.value.setupStep--;
};

function chooseRounds(num) {
  gameData.value.totalRounds = num;
}

function startGame() {
  gameData.value.started = true;
};

function quitGame() {
  gameData.value = defaultGameData;
  localStorage.removeItem('gameData');
  router.push('/');
}

function markOut(id) {
  if (id === gameData.value.currentPlayerId) {
    nextTurn();
  }
  const playerIndex = gameData.value.players.findIndex((player) => player.id === id);
  let player = gameData.value.players[playerIndex];
  player.out = true;
  player.score = player.score + gameData.value.currentScore;
  if (playersStillIn.value.length === 0) {
    endRound();
    nextTurn();
  }
};

function undoMarkOut(id) {
  
};

function endRound() {
  gameData.value.currentScore = 0;
  gameData.value.currentRound++;
  gameData.value.currentRoundRolls = [];
  gameData.value.players.forEach(player => {
    player.out = false;
  });
};

function animateBadSeven() {
  const flashScreen = document.getElementById('flash-overlay');
  flashScreen.classList.add('red-flash');
  setTimeout(() => flashScreen.classList.remove('red-flash'), 200);
  const roundNumber = document.getElementById('round-number');
  roundNumber.classList.add('animate-pulse');
  setTimeout(() => roundNumber.classList.remove('animate-pulse'), 4100);

};

function handleButton(event) {
  let newRollValue = null;
  if (event.currentTarget.value === 'doubles') {
    newRollValue = event.currentTarget.value;
  } else {
    newRollValue = parseInt(event.currentTarget.value);
  }
  const playerWhoRolled = playersStillIn.value[playerTurnIndex.value];
  gameData.value.currentRoundRolls.push({playerId: playerWhoRolled.id, rollValue: newRollValue});
  nextTurn();

  if (gameData.value.currentRoundRolls.length <= 3) {
    if (newRollValue !== 7) {
      gameData.value.currentScore = gameData.value.currentScore + newRollValue;
    } else {
        gameData.value.currentScore = gameData.value.currentScore + 70;
        
      }
    } else {
        if (newRollValue === 7) {
          if (gameData.value.currentRound < gameData.value.totalRounds) {
            //end round
            endRound();
            animateBadSeven();
          } else {
            //end Game
            gameData.value.gameOver = true;
          }
        } else if (newRollValue === 'doubles') {
            //double score - rolled doubles
            gameData.value.currentScore = gameData.value.currentScore * 2;            
        } else {
            //normal addition
            gameData.value.currentScore = gameData.value.currentScore + newRollValue;
        }
    }
};

function nextTurn() {
  const nextIndex = (playerTurnIndex.value + 1) % playersStillIn.value.length;
  gameData.value.currentPlayerId = playersStillIn.value[nextIndex].id;
};
</script>

<template>
  <main class="w-full max-w-100 justify-self-center h-dvh p-6 pb-10 flex flex-col">
    <div id="flash-overlay" class="z-60"></div>
    <div v-if="gameData.started" id="cyber-dice-div" class="flex flex-col h-full justify-between items-center">
      <div class="flex flex-col w-full items-center gap-y-4">
        <div class="flex flex-row items-center justify-between w-full">
          <DotMenu @click="quitGame" v-on:touchstart="" class="size-7 stroke-gray-500 active:stroke-white cursor-pointer"/>
          <p class="self-center font-mono text-gray-400">Round <span id="round-number" class="font-bold text-white text-xl">{{ gameData.currentRound }}</span> of {{ gameData.totalRounds }}</p>
          <div class="invisible size-8"></div>
        </div>
        <CyberTextFlow :value="gameData.currentScore" size="text-7xl" text-margin="ml-2" type="font-mono" color1="text-cyan-300" color2="text-fuchsia-400" />
        <div class="flex w-full flex-col gap-y-4">
          <p class="font-mono self-center text-gray-400">Roll {{ gameData.currentRoundRolls.length + 1 }}</p>
          <CyberText class="self-center" text-margin="ml-[3px]" size="text-xl" :value="`${playersStillIn[playerTurnIndex]?.name}'s turn`" />
          <div class="fixed bottom-15 flex flex-col gap-y-8 self-center">
            <button
              name="enter-roll"
              @click="openDrawer('manualRoll')"
              v-on:touchstart=""
              class="text-white font-semibold bg-gray-950 rounded w-80 min-h-12 self-center font-mono cursor-pointer border-2 border-white hover:bg-gray-800 active:border-2 active:border-fuchsia-400 active:ring-2 active:ring-cyan-300">Manually Enter Roll
            </button>
            <button
              name="view-players"
              @click="openDrawer('players')"
              v-on:touchstart=""
              class="text-white font-semibold bg-gray-950 rounded w-80 min-h-12 self-center font-mono cursor-pointer border-2 border-white hover:bg-gray-800 active:border-2 active:border-fuchsia-400 active:ring-2 active:ring-cyan-300">View Players
            </button>
          </div>
        </div>
      </div>
      <Drawer :drawerOpen="drawerOpen" :closeDrawer="closeDrawer">
        <div v-if="drawerType === 'manualRoll'" class="flex justify-center p-4">
          <div class="flex flex-row flex-wrap w-85 gap-5 justify-center">
            <button @click="handleButton" v-on:touchstart="" v-for="n in Array.from({ length: 11}, (_, i) => i + 2)" :key="n" :value="n" :disabled="gameData.currentRoundRolls.length >= 3 && (n === 2 || n === 12)" :class="[gameData.currentRoundRolls.length < 3 && n === 7 ? 'border-lime-300 text-lime-300 active:border-lime-300 active:ring-lime-300' : gameData.currentRoundRolls.length >= 3 && n === 7 ? 'border-red-400 text-red-400 active:border-red-400 active:ring-red-400' : 'text-white border-white']" class="rounded font-semibold bg-gray-950 size-16 border-2 text-lg disabled:bg-none disabled:border-0 disabled:hover:bg-gray-900 disabled:bg-gray-900 disabled:text-gray-700 disabled:cursor-default disabled:active:ring-0 font-mono flex items-center justify-center cursor-pointer hover:bg-gray-800 active:border-3 active:border-fuchsia-400 active:ring-3 active:ring-cyan-300">{{ n }}
            </button>
            <button @click="handleButton" v-on:touchstart="" value="doubles" :disabled="gameData.currentRoundRolls.length < 3" class="rounded font-semibold size-16 border-2 bg-gray-950 disabled:bg-none disabled:border-0 disabled:hover:bg-gray-900 disabled:bg-gray-900 disabled:text-gray-700 disabled:cursor-default disabled:active:ring-0 text-lime-300 font-mono border-lime-300 flex items-center text-xs justify-center cursor-pointer hover:bg-gray-800 active:border-3 active:border-lime-300 active:ring-3 active:ring-lime-300"><span class="rotate-45">Doubles</span>
            </button>
          </div>
        </div>
        <div v-if="drawerType === 'players'" ref="playerList" id="player-list" class="border-y-2 border-gray-900 self-center w-81 h-fit overflow-y-scroll scroll-smooth py-4 flex flex-col gap-y-2">
          <div id="player-row" v-for="(player, index) in gameData.players" :key="player.id" :class="player.out ? 'bg-gray-800' : 'bg-none'" class="flex flex-row min-h-14 max-h-14 mx-0.5 justify-between text-center px-1">
            <CyberText v-if="player.out === false" class="self-center" text-margin="ml-[3px]"  :value="(index + 1) + '.   ' + player.name" />
            <p v-else class="text-gray-600 self-center font-mono">{{ (index + 1) + '.   ' + player.name }}</p>
            <button
              @click="markOut(player.id)"
              v-on:touchstart=""
              :class="player.out ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-950 hover:bg-gray-800'"
              class="rounded font-semibold self-center cursor-pointer text-sm bg-none border-gray-500 text-gray-500 w-20 h-fit font-mono p-1 border-2 hover:bg-gray-800 active:border-2 active:border-fuchsia-400 active:ring-2 active:text-white active:ring-cyan-300">{{player.out ? 'Undo' : 'Go Out'}}
            </button>
          </div>
        </div>
      </Drawer>
    </div>
    <div v-else class="flex flex-col gap-y-8 w-80 self-center overflow-y-hidden">
      <div class="flex flex-row justify-between items-center">
        <CloseX v-if="gameData.setupStep === 1" @click="quitGame" v-on:touchstart="" class="stroke-gray-500 size-7 cursor-pointer active:stroke-white"/>
        <BackArrow v-if="gameData.setupStep === 2" @click="backStep" v-on:touchstart="" class="stroke-gray-500 size-7 cursor-pointer active:stroke-white"/>
        <p v-if="gameData.setupStep === 1" class="text-center font-mono text-white">Who's playing?</p>
        <button v-if="playersStillIn.length > 1 && gameData.setupStep === 1"
          name="next-step"
          @click="advanceStep"
          v-on:touchstart=""
          class="text-white font-semibold bg-gray-950 rounded p-1 ml-[-16px] text-sm self-center font-mono cursor-pointer hover:bg-gray-800 active:bg-gray-900">Next
        </button>
        <div v-if="playersStillIn.length < 2" class="size-7 invisible"></div>
        <p v-if="gameData.setupStep === 2" class="text-center font-mono text-white">How many rounds?</p>
        <div v-if="gameData.setupStep === 2" class="size-7 invisible"></div>
      </div>
      <div v-if="gameData.setupStep === 1" id="step-1" class="flex flex-col gap-y-5 overflow-y-hidden">
        <div class="flex flex-row gap-4 py-1 mx-0.5">
          <input
            ref="inputRef"
            @keydown.enter="addPlayer" 
            placeholder="Enter player name" 
            name="enter-name" 
            v-model="inputValue"
            class="self-center placeholder:text-gray-500 w-full rounded bg-gray-900 text-white font-mono tracking-wide px-3 min-h-12 focus:px-[10px] outline-0 focus:ring-2 focus:ring-cyan-300 focus:border-2 focus:border-fuchsia-400"
          />
          <button
            name="add-player"
            @click="addPlayer"
            v-on:touchstart=""
            class="text-white bg-gray-950 rounded w-fit px-3 min-h-12 self-center font-mono cursor-pointer border-2 border-white hover:bg-gray-800 active:border-2 active:border-fuchsia-400 active:ring-2 active:ring-cyan-300 "><Plus class="size-1 stroke-2" />
          </button>
        </div>
        <p v-if="playersStillIn.length < 2" class="font-mono text-xs mt-[-12px] text-gray-500">Add at least 2 players</p>
        <div v-if="playersStillIn.length !== 0" ref="playerList" id="player-list" class="border-y-2 border-gray-900 self-center w-full h-fit overflow-y-scroll scroll-smooth py-2 flex flex-col gap-y-2">
          <div id="player-row" v-for="(player, index) in playersStillIn" :key="player.id" class="flex flex-row min-h-14 max-h-14 mx-0.5 justify-between text-center">
            <CyberText class="self-center" text-margin="ml-[3px]"  :value="(index + 1) + '.   ' + player.name" />
            <button
              @click="removePlayer(player.id)"
              v-on:touchstart=""
              class="rounded font-semibold self-center cursor-pointer text-sm bg-gray-950 border-gray-500 text-gray-500 w-fit h-fit font-mono p-1 border-2 hover:bg-gray-800 active:border-2 active:border-fuchsia-400 active:ring-2 active:text-white active:ring-cyan-300">Remove
            </button>
          </div>
        </div>
      </div>
      <div v-if="gameData.setupStep === 2" id="step-2" class="flex flex-col gap-y-5 h-full px-1 pb-1">
        <input
          id="20-rounds"
          type="radio"
          @click="chooseRounds(20)"
          @keydown.enter=""
          checked
          name="how-many-rounds"
          class="self-center hidden peer/20-rounds"
        />
        <label
          for="20-rounds"
          class="text-gray-500 font-mono rounded cursor-pointer w-full h-20 text-center content-center border-2 border-gray-500 hover:bg-gray-800 hover:text-white peer-checked/20-rounds:text-white peer-checked/20-rounds:border-3 peer-checked/20-rounds:border-fuchsia-400 peer-checked/20-rounds:ring-3 peer-checked/20-rounds:ring-cyan-300">20 Rounds
        </label>
        <input
          id="15-rounds"
          type="radio"
          @click="chooseRounds(15)"
          @keydown.enter=""
          name="how-many-rounds" 
          class="self-center hidden peer/15-rounds"
        />
        <label
          for="15-rounds"
          class="text-gray-500 font-mono rounded cursor-pointer w-full h-20 text-center content-center border-2 border-gray-500 hover:bg-gray-800 hover:text-white peer-checked/15-rounds:text-white peer-checked/15-rounds:border-3 peer-checked/15-rounds:border-fuchsia-400 peer-checked/15-rounds:ring-3 peer-checked/15-rounds:ring-cyan-300">15 Rounds
        </label> 
        <input
          id="10-rounds"
          type="radio"
          @click="chooseRounds(10)"
          @keydown.enter=""
          name="how-many-rounds" 
          class="self-center hidden peer/10-rounds"
        />
        <label
          for="10-rounds"
          class="text-gray-500 font-mono rounded cursor-pointer w-full h-20 text-center content-center border-2 border-gray-500 hover:bg-gray-800 hover:text-white peer-checked/10-rounds:text-white peer-checked/10-rounds:border-3 peer-checked/10-rounds:border-fuchsia-400 peer-checked/10-rounds:ring-3 peer-checked/10-rounds:ring-cyan-300">10 Rounds
        </label>
        <button
          name="start-game"
          @click="startGame"
          v-on:touchstart=""
          class="text-white font-semibold bg-gray-950 mt-10 rounded w-full min-h-12 self-center font-mono cursor-pointer border-2 border-white hover:bg-gray-800 active:border-2 active:border-fuchsia-400 active:ring-2 active:ring-cyan-300">Start Game
        </button>
      </div>
    </div>
  </main>
</template>


<style>
  button, p, h1, h2, h3 {
    -webkit-user-select: none;
    user-select: none;
  }

  .red-flash {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #ff6367;
  opacity: 0.5;
  pointer-events: none;
  transition: opacity 0.2s ease-in-out;
  visibility: visible;
}
</style>