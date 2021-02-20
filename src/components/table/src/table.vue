<script lang="tsx">
import Vue, {PropType} from 'vue';
import './table.styl';
import {getELRect} from '@/utils/tools/dom';
import {extend} from '@/utils/tools/lib';
import {batchDateFormatter} from '@/utils/tools/type';
import {Table} from 'element-ui';

export default Vue.extend({
  name: 'ClaimTable',
  render(h) {
    return (
      <div class='claim-table'>
        <div class='claim-table-header' ref='headerBox' onKeydown={(e: KeyboardEvent) => { this.handleKeyboard(e); }}>
          {
            this.$slots.header
          }
          {
            this.$scopedSlots.header && this.$scopedSlots.header({
              filter: this.filter,
              search: this.search,
              reset: this.setFilter,
            })
          }
        </div>
        <div class='claim-table-content' ref='talbeBox'>
          <el-table
            ref='table'
            {...{ attrs: this.tableConfig, on: this.tableEvents, props: this.tableProps}}
            height={this.autoHeight ? this.tableHeight : undefined}
            data={this.tableData}>
            {
              this.columns.map((col: any) => {
                return (
                  <el-table-column {...{ attrs: col }}>
                  </el-table-column>
                );
              })
            }
          </el-table>
        </div>
        {
          this.noPage ? '' :
          <div class='claim-table-pagination' ref='paginationBox'>
            <el-pagination
              ref='pagination'
              on-size-change= {this.handleSizeChange}
              on-current-change={this.handleCurrentChange}
              current-page={this.page.current}
              page-sizes={this.sizes}
              page-size={this.page.size}
              layout={this.layout}
              total={this.page.total}>
            </el-pagination>
          </div>
        }
      </div>
    );
  },
  data() {
    return {
      tableHeight: ((): number | string => 0)(),
      tableData: ((): any[] => [])(),
      allData: ((): any[] => [])(),
      page: {
        current: 1,
        total: 0,
        size: 10,
      },
      filter: {
      },
    };
  },
  props: {
    noPage: {
      default: false,
      type: Boolean,
    },
    autoHeight: {
      default: true,
      type: Boolean,
    },
    url: {
      type: String,
      required: true,
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper',
    },
    sizes: {
      type: Array as PropType<number[]>,
      default: () => {
        return [10, 20, 30, 50, 100];
      },
    },
    tableConfig: {
      type: Object as any,
    },
    tableProps: {
      type: Object as any,
    },
    tableEvents: {
      type: Object as any,
    },
    columns: {
      required: true,
      type: Array,
    },
    initFilter: {
      type: Object,
    },
    beforeSearch: {
      type: Function,
    },
    afterSearch: {
      type: Function,
    },
    autoSearch: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    httpOptions: {
      type: Object,
    },
    localFilter: {
      type: Function,
    },
  },
  watch: {
    url: {
      immediate: true,
      handler(val: string) {
        if (val && this.autoSearch) {
          this.$nextTick(() => {
            this.search();
          });
        }
      },
    },
    initFilter: {
      immediate: true,
      handler(val: object | undefined) {
        if (val) {
          this.setFilter();
        }
      },
    },
  },
  mounted() {
    // autoHeight为true的时候，自动计算table的高度
    this.getTableheight();
  },
  methods: {
    handleKeyboard(e: KeyboardEvent) {
      if (e.keyCode === 13) {
        e.stopPropagation();
        this.search();
      }
    },
    setFilter() {
      this.filter = Object.assign({}, this.initFilter || {});
    },
    getTableheight() {
      if (!this.autoHeight) {return false; }
      const el = this.$el as HTMLElement;
      let tableHeight: number | string = 0;
      const talbeBox = this.$refs.talbeBox as HTMLElement;
      const talbeBoxHeight = getELRect(talbeBox).height;

      function seach(seachEl: HTMLElement) {
        const pel = seachEl.parentElement;

        const siblings = [];
        if (pel) {
          if (pel.tagName === 'BODY' || pel.classList.contains('main-route')) {return false; }
          const pHeight = getELRect(pel, 0).height;
          let childrenTotalHeight = 0;
          const pelcs = pel.children;

          for (const sel of pelcs) {
            if (sel instanceof HTMLElement) {
              const cHeight = getELRect(sel, 3).height;
              childrenTotalHeight += cHeight;
            } else {
              childrenTotalHeight += sel.clientHeight || 0;
            }
          }

          if (pHeight - childrenTotalHeight > 30) {
            tableHeight = pHeight - childrenTotalHeight - 20;
          } else if (childrenTotalHeight > pHeight) {
            tableHeight = pHeight - (childrenTotalHeight - talbeBoxHeight);
          } else {
            seach(pel);
          }
        }
      }
      seach(el);

      this.$nextTick(() => {
        if (tableHeight < (this.page.size * 40) + 40 && tableHeight > 200) {
          this.tableHeight = tableHeight || '';
        } else {
          this.tableHeight = '';
        }
      });
    },
    async handleSizeChange(size: number) {
      this.page.size = size;
      const result = await this.search();
      if (!result) {return false; }
      this.$nextTick(() => {
        this.getTableheight();
      });
    },
    handleCurrentChange(current: number) {
      this.page.current = current;
      this.search();
    },
    search() {
      const options = extend(true, {
        page: {
          current: this.page.current,
          size: this.page.size,
        },
      }, this.filter);

      if (this.noPage) {
        delete options.page;
      }

      if (this.beforeSearch) {
        const beforeSearch = this.beforeSearch(this.url, options);
        if (beforeSearch === false) { return Promise.resolve(false); }
      }

      batchDateFormatter(options);

      const httpOptions = Object.assign({loadingTarget: this.$el as HTMLElement}, this.httpOptions);

      if (this.noPage && this.localFilter && this.allData && this.allData.length) {
        return this.tableData = this.localFilter(options, this.allData);
      }

      return this.$http.get(this.url, options, httpOptions).then((res: any) => {
        if (this.afterSearch) {
          const replaceData = this.afterSearch(res.data, options);
          if (replaceData) {
            res.data = replaceData;
          }
        }
        if (this.noPage) {
          this.allData = res.data;
          this.tableData = res.data;
        } else {
          const RESDATA = res.data;
          this.page.total = RESDATA.total;
          this.tableData = RESDATA.records;
        }

        return true;
      });
    },
  },
});
</script>
