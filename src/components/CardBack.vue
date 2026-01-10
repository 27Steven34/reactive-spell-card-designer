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
.back .b-lt:before,
.back .b-rt:before,
.back .b-lb:before,
.back .b-rb:before {
  content: v-bind(diamondInnerLine);
}

.back .b-lt:after,
.back .b-rt:after,
.back .b-lb:after,
.back .b-rb:after {
  content: v-bind(diamondOuterLine);
}
</style>
