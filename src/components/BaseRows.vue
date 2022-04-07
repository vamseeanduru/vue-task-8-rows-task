
<template>
<div class="container-fluid">
  <div class="row">
    <div class="col-12">
      <div :style="{ position: divPosition }">
        <table class="table table-borderless table-sm mb-0">
          <thead>
            <tr>
              <th for="for row number"></th>
              <th for="row" class="row-table-header"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="width: 100%;">
                <div class="lot-div" style=" background: #ccc; height: 5px; display: flex; position: relative;">
                  <div class="lot-div" ref="sliderLine" v-for="(rowLot, idx) in rowLots" :key="idx" :style="{
                        background: rowLot.Group_color_code,
                        width: `${rowLot.Width_To - rowLot.Width_From}%`,
                        marginLeft: `${rowLot.Width_From}%`,
                      }" style="height: 5px; position: absolute;">
                    <h6 v-show="rowLot.showHeader" class="row-data" >
                      <span>{{rowLot.Lot_number}}</span>
                    </h6>
                  </div>
                </div>
              </td>
                <base-divs :lotData="rowLots"></base-divs>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import BaseDivs from './BaseDivs.vue';
export default {
  components: { BaseDivs },
  name: "BaseRows",
  props: {
    rowInfo: Array,
    rowLots: {
      type: Array,
      default () {
        return [];
      },
    },
    rowLotHeading: {
      type: Array,
      default () {
        return [{
          name: "Lot_number",
          title: "",
        }, ];
      },
    },
    locationRows: {
      type: Object,
      default () {
        return [{
          name: "Location_rows",
          title: "",
        }, ];
      },
    },
  },
  data() {
    return {
      lots: this.rowLots,
      blockData: this.rowInfo,
      rowDimensions: {
        height: null,
        left: null,
        right: null,
        top: null,
        width: null,
      },
      divPosition: "relative",
    };
  },
  methods: { },
  computed: {
    // existingLots() {
    //   return [...this.lots.filter(x => x.Lot_Id !== null)];
    // }
  }
};
</script>

<style scoped>
.table tr td {
  white-space: normal;
  color: #004085;
  border-color: #9fceff;
}

.table td,
.table th {
	padding: 5px;
	cursor: auto;
	white-space: nowrap;
}

.rowHeading{
  margin-bottom: 100px;
}

.rowDataOnHover {
  position: relative;
  width: 20px;
  z-index: 1;
  height: 5px;
}

.lot-div {
  height: 5px;
}

.row-data {
  position: relative;
  bottom: 16px;
  color: black;
  width: fit-content;
  font-size: 12px;
  /* overflow: visible; */
}

.bold-text {
  font-weight: 700;
  font-size: small;
}
</style>
