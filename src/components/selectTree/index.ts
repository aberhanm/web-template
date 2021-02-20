import ClaimSelectTree from './src/selectTree';
import { VueConstructor } from 'vue/types/vue';

ClaimSelectTree.install = (v: VueConstructor) => {
  v.component(ClaimSelectTree.options.name, ClaimSelectTree);
};

export default ClaimSelectTree;
