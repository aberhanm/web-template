<script lang="tsx">
import Vue, {PropType} from 'vue';
import {renderItem} from './render.tsx';
import RULE from './rule';
import {extend} from '@/utils/tools/lib';
import {typeOf} from '@/utils/tools/type';
import './form.styl';
import {Form} from 'element-ui';
import {
  FormItem,
  FormItemCheckbox,
  FormItemNormal,
  FormItemTitle,
} from './form.interface';

export default Vue.extend({
  name: 'ClaimForm',
  render(h) {
    return (
      <div class={`claim-form ${this.showOnly ? 'showonly' : ''}`}>
        <el-form autocomplete='off' ref='form' {...{ attrs: this.extendConfig }} props= {{model: this.model}}>
          <input type='text' class='form-control' style='display:none' />
          {
            this.items.map((item) => {
              if (typeOf(item) === 'array') {
                item = item as FormItem[];
                const titleItems = item.filter((cItem) => cItem.type === 'title') as FormItemTitle[];
                const contentItems = item.filter((cItem) => cItem.type !== 'title');

                const groupKey = this.getGroupKey(item);

                return (
                  <claim-card
                    collapsable={this.collapsable}
                    defaultCollape={this.getCollapseDefault(groupKey)}
                    key={groupKey ? groupKey : undefined}>
                    <div class='claim-form-group_title' slot='header'>
                      {
                        titleItems.map((cItem) => {
                          return renderItem.call(this._renderProxy, h, cItem);
                        })
                      }
                    </div>
                    <div class='claim-form-group_content'>
                      {
                        contentItems.map((cItem) => {
                          return renderItem.call(this._renderProxy, h, cItem);
                        })
                      }
                    </div>
                  </claim-card>
                );
              } else {
                return renderItem.call(this._renderProxy, h, item);
              }
            })
          }
        </el-form>
        {
          this.$slots.append ? <div class='claim-form-append'>{this.$slots.append}</div> : ''
        }
      </div>
    );
  },
  data() {
    return {
      collapseList: ((): any[] => [])(),
    };
  },
  props: {
    formConfig: {
      type: Object,
    },
    model: {
      type: Object,
      required: true,
      default() {
        return {};
      },
    },
    items: {
      type: Array as PropType<Array<FormItem[] | FormItem>>,
      required: true,
      default() {
        return [];
      },
    },
    colNum: {
      default: 2,
      type: Number,
    },
    showOnly: {
      default: false,
      type: Boolean,
    },
    collapsable: {
      default: false,
      type: Boolean,
    },
    collapsableOpenList: {
      default: 'all',
      type: [String, Array] as PropType<string | string[]>,
    },
  },
  watch: {
  },
  computed: {
    extendConfig(): any {
      return extend(true, {
        inline: true,
      }, this.formConfig);
    },
    colWidth(): string {
      return `${Math.round(100 / this.colNum)}%`;
    },
  },
  async created() {
  },
  methods: {
    getCollapseDefault(key: string| number) {
      const val = this.collapsableOpenList;
      if (typeof val === 'string') {
        if (val === 'all') {
          return true;
        } else if (val === 'none') {
          return false;
        }
      } else {
        return (this.collapsableOpenList as any[]).indexOf(key) > -1;
      }
    },
    getGroupKey(item: FormItem[]) {
      const titleItems = item.filter((cItem) => cItem.type === 'title') as FormItemTitle[];
      const contentItems = item.filter((cItem) => cItem.type !== 'title');

      let groupKey: string | number = '';
      if (titleItems.length) {
        groupKey = titleItems[0].key + '-group';
      } else if (contentItems.length) {
        for (const newItem of contentItems) {
          let itemKey: string | number = '';
          if (newItem.key) {
            itemKey = newItem.key;
          }
          if (newItem.type !== 'title' && newItem.type !== 'custom' && newItem.type !== 'listFn') {
            itemKey = newItem.prop;
          }
          if (itemKey) {
            groupKey = itemKey;
            break;
          }
        }
      }

      return groupKey;
    },
    validate() {
      const form = this.$refs.form as Form;
      let result = true;
      form.validate((valid, obj) => {
        result = valid;
      });

      return result;
    },
    clearValidate() {
      const form = this.$refs.form as Form;
      form.clearValidate();
    },
  },
});
</script>;
