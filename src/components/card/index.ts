import ClaimCard from './card.vue';
import { VueConstructor } from 'vue/types/vue';

ClaimCard.install = (v: VueConstructor) => {
  v.component(ClaimCard.options.name, ClaimCard);
};

export default ClaimCard;
