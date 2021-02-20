import {VNode, CreateElement} from 'vue';
import {Table, Pagination} from 'element-ui';

export interface Table extends Vue {
  $refs: {
    table: Table,
    pagination: Pagination,
  };
  filter: any;
  tableData: any[];
  allData: any[];
  search(): void;
}
