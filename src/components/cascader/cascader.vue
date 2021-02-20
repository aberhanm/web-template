<template>
  <div class="claim-cascader">
    <div class="claim-cascader-item" v-for="num of level" :key="num">
      <el-select v-model="selectData[`key${num}`]" clearable @change="(val) => {handleChange(num, val)}" :disabled="disabled">
        <el-option
          v-for="item in selectList[`key${num}`]"
          :key="item.value"
          :value="item.value"
          :label="item.label">
        </el-option>
      </el-select>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';
import './cascader.styl';

export default Vue.extend({
  name: 'claim-cascader',
  data() {
    return {
      listMap: ((): any => ({}))(),
      level: 0,
      selectData: ((): any => ({}))(),
      selectList: ((): any => ({}))(),
    };
  },
  props: {
    value: String,
    list: {
      type: Array as PropType<any[]>,
      default() {
        return [];
      },
    },
    disabled: Boolean,
  },
  watch: {
    list: {
      immediate: true,
      handler(val: any[]) {
        this.listMap = {
          Root: [],
        };
        val.forEach((item) => {
          if (!this.listMap[item.parent]) {
            this.listMap[item.parent] = [item];
          } else {
            this.listMap[item.parent].push(item);
          }
        });

        // 得到层级
        let level = 1;
        const getLevel = (list: any[], l: number) => {
          if (level < l) {
            level = l;
          }
          list.forEach((item) => {
            if (this.listMap[item.value]) {
              getLevel(this.listMap[item.value], l + 1);
            }
          });
        };
        getLevel(this.listMap.Root, level);

        this.level = level;

        this.selectData = {};
        this.selectList = {};

        for (let i = 1 ; i <= level; i++) {
          this.$set(this.selectData, `key${i}`, '');
          this.$set(this.selectList, `key${i}`, []);
        }
        this.selectList.key1 = this.listMap.Root;
      },
    },
    value: {
      immediate: true,
      handler(val) {
        if (!val) {return false; }
        const ValList: any[] = [];
        const ListList: any[] = [];
        // 放死循环
        let couter = 0;
        const FindParent = (itemValue: string) => {
          couter++;
          if (couter > 10) { return false; }
          ValList.push(itemValue);
          const Flist = this.list.filter((item) => item.value === itemValue);
          if (Flist.length && Flist[0].parent !== 'Root') {
            ListList.push(this.listMap[Flist[0].parent]);
            FindParent(Flist[0].parent);
          }
        };
        FindParent(val);
        ValList.reverse();
        ListList.reverse();
        ValList.forEach((item, index) => {
          this.selectData[`key${index + 1}`] = item;
          this.selectList[`key${index + 2}`] = ListList[index];
        });
      },
    },
  },
  mounted() {

  },
  methods: {
    handleChange(num: number, val: string) {
      if (num === this.level) {
        this.$emit('input', val);
      } else {
        for (let i = num + 1; i <= this.level; i++) {
          this.selectData[`key${i}`] = '';
          this.selectList[`key${i}`] = [];
        }
        this.selectList[`key${num + 1}`] = this.listMap[val] || [];
        if (!this.selectList[`key${num + 1}`].length) {
          this.$emit('input', val);
        } else {
          this.$emit('input', '');
        }
      }
    },
  },
});
</script>
