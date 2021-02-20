import Vue from 'vue';
const broadcast = function(this: Vue, componentName: string, eventName: string, params: any) {
  this.$children.forEach((child: Vue) => {
    const name = child.$options.name;
    if (name === componentName) {
      child.$emit.apply(child, [eventName, params]);
    } else {
      broadcast.apply(child, [componentName, eventName, params]);
    }
  });
};

export default Vue.extend({
  methods: {
    // 向下广播
    broadcast(componentName: string, eventName: string, params: any) {
      broadcast.call(this, componentName, eventName, params);
    },
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
  },
});
