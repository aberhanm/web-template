import ClaimCascader from './cascader.vue';
import { VueConstructor } from 'vue/types/vue';

ClaimCascader.install = (v: VueConstructor) => {
  v.component(ClaimCascader.options.name, ClaimCascader);
};

export default ClaimCascader;
