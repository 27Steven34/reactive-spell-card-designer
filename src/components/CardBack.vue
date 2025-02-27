<script setup lang="ts">
interface IProps {
  level: string
}

defineProps<IProps>()

const diamondInnerLine = `'\ue30b '`.repeat(40)
const diamondOuterLine = `'\ue30f '`.repeat(40)
</script>

<template>
  <div class="back">
    <div class="body">
      <div class="line">
        <i class="b-lt"></i>
        <i class="b-rt"></i>
        <i class="b-lb"></i>
        <i class="b-rb"></i>
        <b class="level level-1">{{ level }}</b>
        <b class="level level-2">{{ level }}</b>
        <i class="icon-top"></i>
        <i class="icon-mid"></i>
        <i class="icon-bot"></i>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.back .body {
  background-color: #ededed !important;
  border-radius: 5px;
  height: 100%;
  overflow: hidden;
  padding: 15px 15px 15px;
}

.back .line {
  border-radius: 7px;
  height: 100%;
  width: 100%;
  border: 4px solid var(--class-color);
  overflow: hidden;
  position: relative;
  opacity: 0.8;
}

.back .line * {
  box-sizing: content-box;
}

.back .level {
  display: block;
  font-size: 40px;
  font-weight: bold;
  color: var(--class-color) !important;
  position: absolute;
}

.back .level-1 {
  top: 0px;
  right: 5px;
  text-align: right;
}

.back .level-2 {
  bottom: 0px;
  left: 5px;
  text-align: left;
}

.back .b-lt {
  transform: rotate(-55deg);
  left: -75%;
  top: 25%;
}

.back .b-rt {
  transform: rotate(55deg);
  left: -25%;
  top: 25%;
}

.back .b-lb {
  transform: rotate(-55deg);
  left: -25%;
  bottom: 25%;
}

.back .b-rb {
  transform: rotate(55deg);
  left: -75%;
  bottom: 25%;
}

.back .b-lt,
.back .b-rt,
.back .b-lb,
.back .b-rb {
  border-bottom: 2px solid var(--class-color);
  border-top: 2px solid var(--class-color);
  height: 10px;
  width: 200%;
  position: absolute;
  zoom: 1;
  font-size: 18px;
  line-height: 0px;
  color: var(--class-color) !important;
  margin-top: -21px;
  margin-bottom: -21px;
  z-index: 2;
}

.back .b-lt:before,
.back .b-rt:before,
.back .b-lb:before,
.back .b-rb:before {
  font-family: 'rpg-icons';
  display: block;
  width: 100%;
  height: 11px;
  font-size: 13px;
  margin-top: 0;
  font-style: normal;
  overflow: hidden;
  position: relative;
  line-height: 12px;
  color: var(--class-color) !important;
  content: v-bind(diamondInnerLine);
}

.back .b-lt:after,
.back .b-rt:after,
.back .b-lb:after,
.back .b-rb:after {
  font-family: 'rpg-icons';
  display: block;
  width: 100%;
  height: 11px;
  font-style: normal;
  font-size: 13px;
  margin-top: 0;
  overflow: hidden;
  position: relative;
  line-height: 12px;
  margin-top: -24px;
  color: var(--class-color) !important;
  content: v-bind(diamondOuterLine);
}

.back .b-lb:before,
.back .b-rb:before,
.back .b-lb:after,
.back .b-rb:after {
  transform: rotate(180deg);
}

.back .b-lb:before,
.back .b-rb:before {
  line-height: 17px;
}

.back .b-lb:after,
.back .b-rb:after {
  margin-top: 1px;
}

.back .icon-mid,
.back .icon-top,
.back .icon-bot {
  font-family: 'rpg-icons' !important;
  font-size: 100px;
  position: absolute;
  top: 50%;
  margin-top: -75px;
  width: 100%;
  text-align: center;
  font-style: normal;
  color: var(--class-color) !important;
  height: 150px;
  line-height: 150px;
}

.back .icon-top {
  font-size: 50px;
  top: 12%;
  height: auto;
  line-height: 100%;
  margin: 0;
}

.back .icon-bot {
  font-size: 50px;
  top: auto;
  bottom: 12%;
  height: auto;
  line-height: 100%;
  margin: 0;
}
.back .icon-top:after {
  content: var(--class-icon-top);
}

.back .icon-mid:after {
  content: var(--class-icon-mid);
}

.back .icon-bot:after {
  content: var(--class-icon-bot);
}
</style>
