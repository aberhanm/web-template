import ClaimForm from './src/form.vue';
import { VueConstructor } from 'vue/types/vue';

ClaimForm.install = (v: VueConstructor) => {
  v.component(ClaimForm.options.name, ClaimForm);
};

export default ClaimForm;
