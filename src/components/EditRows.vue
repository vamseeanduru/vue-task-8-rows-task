<template>
  <div>
    <div>
      <rows class="p-10" :blockList="data"></rows>
      <rows ref="lotBlocks" class="p-10" :blockList="data">
        <template slot="tableBody" slot-scope="block">
          <td for="lot div" class="d-f">
            <div class="d-f">
              <div
                :style="getLotDivStyle(block.item, { Lot_Id: null }, 0)"
                @click="selectNewLotFrom(block.item, { Lot_Id: null }, 0)"
                class="icon-hover"
              ></div>
              <input
                type="number"
                v-model.number="
                  blockList[block.item.blockIdx].Location_rows[
                    block.item.rowIdx
                  ].quantityAllocated[0]
                "
                @input="
                  enterQuantityForLot(
                    block.item,
                    { Lot_Id: null },
                    0,
                    parseInt($event.target.value)
                  )
                "
                class="quantity-input"
                v-if="showQuantityInput(block.item, 0)"
              />
            </div>
            <div
              class="d-f"
              v-for="(lot, lotIdx) in lotDivList(block.item)"
              :key="lotIdx"
            >
              <div
                :style="getLotDivStyle(block.item, lot, lotIdx + 1)"
                @click="selectNewLotFrom(block.item, lot, lotIdx + 1)"
                class="icon-hover"
              ></div>
              <input
                type="number"
                v-model.number="
                  blockList[block.item.blockIdx].Location_rows[
                    block.item.rowIdx
                  ].quantityAllocated[lotIdx + 1]
                "
                @input="
                  enterQuantityForLot(
                    block.item,
                    lot,
                    lotIdx + 1,
                    parseInt($event.target.value)
                  )
                "
                class="quantity-input"
                v-if="showQuantityInput(block.item, lotIdx + 1)"
              />
            </div>
          </td>
        </template>
      </rows>
    </div>
  </div>
</template>

<script>
import Rows from "./Rows.vue";
export default {
  components: { Rows },
  props: {
    data: Object,
  },
  data() {
    return {
      overLayLoading: false,
      blockList: [],
      startNewLotFrom: [],
    };
  },
  created() {},
  mounted(){
    this.getFieldBlockList();
  },
  methods: {
    getFieldBlockList() {
      this.overLayLoading = true;
      this.blockList = [];
      this.$store
        .dispatch("getLotBlockList", {
          Lot_Id: 0,
          Production_location_Id: this.locationData.Field_Id,
        })
        .then((data) => {
          if (data !== null) {
            data.forEach((block) => {
              block.Location_rows.forEach((row) => {
                row.quantityAllocated = [];
                row.Row_lots.forEach((lot, k) => {
                  row.quantityAllocated[0] = null;
                  row.quantityAllocated[k + 1] = null;
                });
              });
            });
            this.blockList = data;
          }
          this.overLayLoading = false;
        });
    },
    updateBlockList(rowLots) {
      let totalRowlength = rowLots.reduce((acc, item) => {
        return acc + item.Row_length;
      }, 0);
      let Width_From = 0;
      let Width_To = 0;
      let isNewLot =
        rowLots.findIndex((x) => x.Lot_Id === null) > -1 ? true : false;
      rowLots.forEach((item, i) => {
        Width_From = i > 0 ? rowLots[i - 1].Width_To : 0;
        Width_To =
          Math.round((100 * item.Row_length) / totalRowlength) + Width_From;
        item.Width_From = isNewLot ? Width_From : item.Width_From_Pre;
        item.Width_To = isNewLot ? Width_To : item.Width_To_Pre;
        item.lotChanged = isNewLot ? true : false;
      });
    },
    getLotDivStyle(item, lot, lotIdx) {
      let block = this.blockList[item.blockIdx].Location_info;
      let row =
        this.blockList[item.blockIdx].Location_rows[item.rowIdx].Row_data;
      let Group_color_code =
        lot.Lot_Id !== null ? lot.Group_color_code : "#a4a4a4";
      let additionalStyle = "";
      let opacity = 0.5;
      if (
        this.startNewLotFrom.findIndex(
          (x) =>
            x.Production_location_Id === block.Production_location_Id &&
            x.Row_Id === row.Row_Id &&
            x.lotIdx === lotIdx
        ) > -1
      ) {
        opacity = 1;
        additionalStyle = `-webkit-box-shadow: 0px 0px 5px 1px ${Group_color_code};-moz-box-shadow: 0px 0px 5px 1px ${Group_color_code};box-shadow: 0px 0px 5px 1px ${Group_color_code};`;
      }
      return (
        `position: relative;top:10px;width:12px;height:12px;margin-left: 5px;background-color:${Group_color_code};opacity:${opacity};` +
        additionalStyle
      );
    },
    selectNewLotFrom(item, lot, lotIdx) {
      if (this.batchView.batchAllocated) {
        let block = this.blockList[item.blockIdx].Location_info;
        let row =
          this.blockList[item.blockIdx].Location_rows[item.rowIdx].Row_data;
        let lotFromIdx = this.startNewLotFrom.findIndex(
          (x) =>
            x.Production_location_Id === block.Production_location_Id &&
            x.Row_Id === row.Row_Id &&
            x.lotIdx === lotIdx
        );
        if (lotFromIdx === -1) {
          this.startNewLotFrom.push({
            Production_location_Id: block.Production_location_Id,
            Row_Id: row.Row_Id,
            Lot_Id: lot.Lot_Id,
            lotIdx: lotIdx,
          });
        } else {
          this.enterQuantityForLot(item, lot, lotIdx, 0);
          this.startNewLotFrom.splice(lotFromIdx, 1);
        }
        this.$refs.lotBlocks.refreshBlockRows();
      }
    },
    getNewPlantsInBlock(rows) {
      let quantityInBlock = 0;
      rows.forEach((item) => {
        quantityInBlock += item.quantityAllocated.reduce((acc, item) => {
          return acc + item;
        }, 0);
      });
      return quantityInBlock > 0 ? `(${quantityInBlock})` : "";
    },
    enterQuantityForLot(item, lot, lotIdx, quantity) {
      if (quantity > 0)
        quantity =
          this.newLotAllocatedQty <= this.batchView.totalQuantityAllocated
            ? quantity
            : this.batchView.totalQuantityAllocated -
              (this.newLotAllocatedQty - quantity);
      let block = this.blockList[item.blockIdx].Location_info;
      let row =
        this.blockList[item.blockIdx].Location_rows[item.rowIdx].Row_data;
      let rowLots =
        this.blockList[item.blockIdx].Location_rows[item.rowIdx].Row_lots;
      let lotFromIdx =
        lot.Lot_Id !== null
          ? rowLots.findIndex((x) => x.Lot_Id === lot.Lot_Id) + 1
          : 0;
      let newLotIdx = rowLots.findIndex(
        (x) => x.Lot_Id === null && x.lotIdx === lotIdx
      );
      if (newLotIdx > -1 && quantity > 0)
        (rowLots[newLotIdx].No_of_Plants = quantity),
          (rowLots[newLotIdx].Row_length =
            quantity * this.lotFormView.lotFormObj.Space_Between_Plants);
      if (newLotIdx > -1 && !quantity > 0) rowLots.splice(newLotIdx, 1);
      if (newLotIdx === -1 && quantity > 0) {
        rowLots.splice(lotFromIdx, 0, {
          Lot_Id: null,
          No_of_Plants: quantity,
          Row_length:
            quantity * this.lotFormView.lotFormObj.Space_Between_Plants,
          Width_From: 0,
          Width_To: 0,
          Group_color_code: this.lotFormView.lotFormObj.Group_color_code,
          Production_location_Id: block.Production_location_Id,
          Production_cycle_Id: this.locationData.Production_cycle_Id,
          Row_Id: row.Row_Id,
          lotIdx: lotIdx,
        });
      }
      this.$set(
        this.blockList[item.blockIdx].Location_rows[item.rowIdx]
          .quantityAllocated,
        lotIdx,
        quantity > 0 ? quantity : null
      );
      this.updateBlockList(rowLots);
    },
    lotDivList(item) {
      return [
        ...this.blockList[item.blockIdx].Location_rows[
          item.rowIdx
        ].Row_lots.filter((x) => x.Lot_Id !== null),
      ];
    },
    newLotAllocatedQty() {
      let allocatedQuantity = null;
      this.blockList.forEach((block) => {
        block.Location_rows.forEach((row) => {
          row.quantityAllocated.forEach((item) => {
            allocatedQuantity += item;
          });
        });
      });
      return allocatedQuantity;
    },
  },
};
</script>

<style scoped>
.box{
    background: rgb(8, 0, 0);
    height: 10px;
    width: 10px;
    margin-bottom: 10px;
}

.no-stock-allocated {
  float: right;
  position: relative;
  top: 20px;
  right: 10px;
}

.quantity-input {
  width: 60px;
  height: 22px;
  position: relative;
  top: 5px;
  margin-left: 5px;
  font-weight: 700;
}

</style>



                