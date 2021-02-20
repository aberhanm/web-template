import ClaimTable from './src/table.vue';
import { VueConstructor } from 'vue/types/vue';

ClaimTable.install = (v: VueConstructor) => {
  v.component(ClaimTable.options.name, ClaimTable);
};

export default ClaimTable;
