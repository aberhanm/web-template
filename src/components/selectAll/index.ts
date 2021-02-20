import ClaimSelectAll from './selectAll.vue';
import { VueConstructor } from 'vue/types/vue';

ClaimSelectAll.install = (v: VueConstructor) => {
  v.component(ClaimSelectAll.options.name, ClaimSelectAll);
};

export default ClaimSelectAll;
