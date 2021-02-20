import Vue, {PropType} from 'vue';
import {Tree} from 'element-ui';
import './selectTree.styl';
import {TreeData} from './selectTree.interface';

export default Vue.extend({
  name: 'claimSelectTree',
  render(h) {
    return (
      <div class='claim-selectTree'>
        <el-popover
          on-show={this.handlePopoverShow}
          width={this.popperWidth}
          disabled={this.disabled}
          popper-class='claim-selectTree-popper'
          trigger='click'>
          <div slot='reference'>
            {
              !this.multiple ?
              <el-input
                value={this.inputValue}
                placeholder={this.placeholder}
                clearable
                disabled={this.disabled}
                readonly={!this.filterable}
                on-focus={this.handleFocus}
                on-input={this.handleInput}
                on-blur={this.handleBlur}
                on-clear={this.handelClear}>
              </el-input> :
              <div class='multi-box'>
                {
                  this.multiList.map((item) => {
                    return (
                      <div class='multi-item'>
                        <span>{item.label}</span>
                        <i class='el-icon-error' on-click={(e: MouseEvent) => {e.stopPropagation(); this.deleteClick(item.value); }}></i>
                      </div>
                    );
                  })
                }
              </div>
            }
          </div>
          <div class='claim-selectTree-box'>
            <el-tree
              ref='tree'
              data={this.treeData}
              show-checkbox
              node-key='value'
              check-strictly
              on-check={this.handleCheck}
              filterNodeMethod={this.filterMethod}
              props={this.treeProps}>
            </el-tree>
          </div>
        </el-popover>
      </div>
    );
  },
  data() {
    return {
      inputValue: '',
      multiList: ((): any[] => [])(),
      treeProps: {
        children: 'children',
        label: 'label',
      },
    };
  },
  props: {
    value: {
      type: [Array, String, Number],
    },
    filterable: {
      default: false,
    },
    popperWidth: {
      type: String,
    },
    treeData: {
      type: Array as PropType<TreeData[]>,
    },
    multiple: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    placeholder: {
      type: String,
    },
    disabled: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.setShowValue();
      },
    },
    treeData: {
      handler() {
        this.setShowValue();
      },
    },
  },
  mounted() {
    this.setShowValue();
  },
  methods: {
    filterMethod(value: string, data: TreeData, node: any) {
      if (data.label.indexOf(value) > -1) {
        return true;
      }
      return false;
    },
    handleInput(val: string) {
      this.inputValue = val;
      if (!this.filterable) { return false; }
      const tree = this.$refs.tree as Tree;
      tree.filter(val);
    },
    handleFocus() {
      if (!this.filterable) { return false; }
      const tree = this.$refs.tree as Tree;
      tree.filter('');
    },
    handleBlur() {
      this.$nextTick(() => {
        this.setShowValue();
      });
    },
    handelClear() {
      const tree = this.$refs.tree as Tree;
      tree.setCheckedKeys([]);
      this.$emit('input', '');
    },
    setShowValue() {
      this.$nextTick(() => {
        const val =  this.value as any;
        const tree = this.$refs.tree as Tree;
        if (tree) {
          if (this.multiple) {
            tree.setCheckedKeys(val);
            this.$nextTick(() => {
              const nodes = tree.getCheckedNodes() as any[];
              this.multiList = nodes;
            });
          } else {
            tree.setCheckedKeys([val]);
            const node = tree.getNode(val);
            // data还没拿到
            this.inputValue = (node && node.label) || '';
          }
        }
      });
    },
    handleCheck(data: TreeData, checkData: any) {
      const tree = this.$refs.tree as Tree;
      const checks = tree.getCheckedKeys();
      if (!this.multiple) {
        if (checkData.checkedKeys.length) {
          tree.setCheckedKeys([data.value]);
          this.$emit('input', data.value);
        } else {
          this.$emit('input', '');
        }
      } else {
        this.$emit('input', checks);
      }
    },
    handlePopoverShow() {
      const tree = this.$refs.tree as Tree;
      if (this.multiple) {
        tree.setCheckedKeys(this.value as []);
      } else {
        tree.setCheckedKeys([this.value]);
      }
    },
    deleteClick(val: string) {
      const list = this.value as any[];
      this.$emit('input', list.filter((item) => item !== val));
    },
  },
});
