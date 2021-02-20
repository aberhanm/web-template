<template>
  <div class="claim-card" :class="{'claim-card-collapsable': collapsable, 'claim-card-collapsable_close': !collapse}">
    <div class="claim-card-header">
      <slot
        v-if="$slots.header"
        name="header"></slot>
      <div
        v-else
        class="claim-card-header-title">
        {{title}}
      </div>
      <i v-if="collapsable" class='claim-card-collapse_icon el-icon-caret-bottom' @click="handleCollapse"></i>
    </div>
    <div class="claim-card-content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import './card.styl';

export default Vue.extend({
  name: 'claim-card',
  data() {
    return {
      collapse: true,
    };
  },
  props: {
    title: {
      type: String,
    },
    collapsable: {
      type: Boolean,
      default: false,
    },
    defaultCollape: {
      type: Boolean,
      default: true,
    },
  },
  created() {
    this.collapse = this.defaultCollape;
  },
  mounted() {

  },
  methods: {
    handleCollapse() {
      this.collapse = !this.collapse;
    },
  },
});
</script>
