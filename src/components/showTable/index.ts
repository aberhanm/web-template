import ClaimShowTable from './showTable.vue';
import { VueConstructor } from 'vue/types/vue';

ClaimShowTable.install = (v: VueConstructor) => {
  v.component(ClaimShowTable.options.name, ClaimShowTable);
};

export default ClaimShowTable;
