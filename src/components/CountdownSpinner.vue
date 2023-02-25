<template>
    <div class="base-timer">
        <svg class="base-timer__svg" viewBox="0 0 100 100">
            <g class="base-timer__circle">
              <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
              <path
                  id="base-timer-path-remaining"
                  stroke-dasharray="283"
                  class="base-timer__path-remaining"
                  d="
                  M 50, 50
                  m -45, 0
                  a 45,45 0 1,0 90,0
                  a 45,45 0 1,0 -90,0
                  "
              ></path>
            </g>
        </svg>
        <button class="cta" @click="claim">Claim</button>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { bool } from "vue-types";

const FULL_DASH_ARRAY = 283;

const TIME_LIMIT = 30;
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;

const props = defineProps({
  claimAction: Function
});

function onTimesUp() {
  clearInterval(timerInterval);
}

onMounted(async () => {
  document
    .getElementById("base-timer-path-remaining")
    .classList.add("red");

  timerInterval = setInterval(() => {
    timePassed = timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;
    setCircleDasharray();
    setRemainingPathColor(timeLeft);

    if (timeLeft === 0) {
      onTimesUp();
    }
  }, 1000);
});

const claim = async () => {
  if (props.claimAction) {
    props.claimAction();
  }
}

function setRemainingPathColor(timeLeft: number) {
  if (timeLeft <= 1) {
      document
        .getElementById("base-timer-path-remaining")
        .classList.remove("red");
      document
        .getElementById("base-timer-path-remaining")
        .classList.add("littleRed");
  }
}

function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}
</script>

<style lang="scss" scoped>
body {
  font-family: sans-serif;
  display: grid;
  height: 200vh;
  place-items: center;
}

.base-timer {
  position: relative;
  width: 100px;
  height: 100px;
}

.base-timer__svg {
  transform: scaleX(-1);
}

.base-timer__circle {
  fill: none;
  stroke: none;
}

.base-timer__path-elapsed {
  stroke-width: 10px;
  // stroke: rgba(253,71,85,0.5);
  stroke: white;
}

.base-timer__path-remaining {
  stroke-width: 10px;
  stroke-linecap: round;
  transform: rotate(90deg);
  transform-origin: center;
  transition: 1s linear all;
  fill-rule: nonzero;
  stroke: currentColor;
}

.base-timer__path-remaining.littleRed {
  // color: rgba(253,71,85,0.5);
  color: white;
}

.base-timer__path-remaining.red {
  color: #FD4755;
}

.cta {
  position: absolute;
  top: 0;
  left: 0;
  color: #FD4755;
  border-radius: 100px;
  font-size: 17px;
  width: 100px;
  height: 100px;
  font-weight: bold; }

</style>