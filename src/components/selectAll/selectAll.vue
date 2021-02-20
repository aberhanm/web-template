<template>
  <div class="claim-selectAll">
    <el-checkbox
      class="claim-form-checkall"
      v-model="checkAll"
      :disabled="disabled"
      :indeterminate="indeterminate"
      @change="hanlleAllChange">
        全选
    </el-checkbox>
    <el-checkbox-group
      v-model="checkValue"
      :disabled="disabled"
      @change="handleCheckChange">
      <el-checkbox v-for="item in checkList" :label="item.value" :key="item.value">{{item.label}}</el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'claimSelectAll',
  data() {
    return {
      checkAll: false,
      indeterminate: false,
      checkValue: ((): any[] => [])(),
    };
  },
  props: {
    value: {
      type: Array,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    checkList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(val: any[]) {
        this.checkValue = val || [];
        this.valueChange();

        this.dispatch('ElFormItem', 'el.form.blur', [val]);
      },
    },
  },
  mounted() {

  },
  methods: {
    // 向上广播
    dispatch(componentName: string, eventName: string, params: any) {
      let parent = this.$parent || this.$root;
      let name = parent.$options.name;

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;
        if (parent) {
          name = parent.$options.name;
        }
      }

      if (parent) {
        parent.$emit(eventName, params);
      }
    },
    hanlleAllChange(val: boolean) {
      this.checkValue = val ? this.checkList.map((opt: any) => opt.value) : [];
      this.indeterminate = false;
      this.$emit('input', this.checkValue);
    },
    handleCheckChange() {
      this.$emit('input', this.checkValue);
    },
    valueChange() {
      const checkedCount = this.checkValue.length;
      this.checkAll = checkedCount === this.checkList.length;
      this.indeterminate = checkedCount > 0 && checkedCount < this.checkList.length;
    },
  },
});
</script>
