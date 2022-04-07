<template>
  <b-tabs v-model="currentTabIndex" pill class="tab-content-block-custom">
    <b-tab
      lazy
      title-link-class="pill-tab-block-custom"
      v-for="(block, blockIndex) in blockList"
      :key="blockIndex"
    >
      <template v-slot:title>
        <div v-show="showBlockTitle">
          <span>{{ block.Location_info.Name }}</span> ({{
            blockQuantity(block.Location_rows)
          }})
        </div>
        <slot name="blockTitle" :item="block"></slot>
      </template>
      <table class="table table-borderless table-sm animated fadeIn mb-0">
        <thead>
          <tr>
            <th for="for row number"></th>
            <th for="row" class="row-table-header"></th>
            <slot name="tableHead"></slot>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIdx) in block.Location_rows" :key="rowIdx">
            <td for="for row number" class="p-r t-2">{{ rowIdx + 1 }}</td>
            <td for="row">
              <base-rows :locationRows="row" :rowInfo="blockList" :rowLots="row.Row_lots" ></base-rows>
            </td>
            <slot name="tableBody" :item="{blockIndex,rowIdx}"></slot>
          </tr>
        </tbody>
      </table>
    </b-tab>
  </b-tabs>
</template>

<script>
import BaseRows from './BaseRows.vue';
export default {
  components: { BaseRows },
  name: "Rows",
  props: {
    blockList: {
      type: Array,
    },
    showBlockTitle: {
      type: Boolean,
      default: true,
    },
    selectedLot: {
      type: Object,
      default: null
    },
    rowLotHeading: {
      type: Array,
      default () {
        return [{
          name: 'Lot_number',
          title: ''
        }];
      }
    }
  },
  data() {
    return {
      currentTabIndex: 0,
    };
  },
  created(){},
  methods: {
    changeTabIndex(value) {
      this.currentTabIndex = value;
    },
    blockQuantity(rowLots) {
      let blockQuantity = 0;
      rowLots.forEach((item) => {
        item.Row_lots.forEach((e) => {
          blockQuantity +=
            this.selectedLot !== null &&
            (e.Lot_Id === this.selectedLot.Lot_Id ||
              e.Multiple_Lot_Id === this.selectedLot.Multiple_Lot_Id)
              ? e.No_of_Plants
              : 0;
        });
      });
      return blockQuantity;
    },
  },
};
</script>

<style lang="css" scoped>
.table td,
.table th {
	padding: 5px;
	cursor: auto;
	white-space: nowrap;
}

.row-table-header {
  width: 100%;
}
</style>

<style media="screen">
.tab-content-custom>.tab-content {
  border: none;
  border-radius: 5px;
  box-shadow: 0 1px 4px #8a8a8a;
}

.tab-content-block-custom>.tab-content {
  border: none;
}

.pill-tab-custom {
  background-color: #ffffff !important;
  font-size: 16px;
  font-weight: 500;
  color: #263544 !important;
  margin-left: 2px;
  padding: 4px 8px;
}

.pill-tab-custom.active {
  box-shadow: 0px 1px 5px #6d6d6d;
}

.pill-tab-block-custom {
  background-color: #ffffff !important;
  font-size: 16px;
  font-weight: 500;
  color: #263544 !important;
  margin-left: 2px;
  padding: 4px 8px;
}

.pill-tab-block-custom.active {
  box-shadow: 0px 1px 5px #6d6d6d;
}
</style>
