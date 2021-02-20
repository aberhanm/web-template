<template>
  <div class="claim-showTable">
    <table>
      <colgroup>
        <col v-for="item in cols" :key="item" :width="width">
      </colgroup>
      <tr v-for="(row, rIndex) in data" :key="rIndex">
        <td v-for="(col, cIndex) in row" :key="cIndex">
          {{col}}
        </td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';
import './showTable.styl';

export default Vue.extend({
  name: 'claim-showTable',
  data() {
    return {

    };
  },
  computed: {
    cols(): number {
      if (this.data && this.data[0]) {
        return this.data[0].length || 1;
      }
      return 1;
    },
    width(): string {
      return `${100 / this.cols}%`;
    },
  },
  props: {
    data: {
      type: Array as PropType<any[][]>,
      default() {
        return [];
      },
    },
  },
  mounted() {

  },
  methods: {

  },
});
</script>
