import ClaimHeader from './header.vue';
import { VueConstructor } from 'vue/types/vue';

ClaimHeader.install = (v: VueConstructor) => {
  v.component(ClaimHeader.options.name, ClaimHeader);
};

export default ClaimHeader;
