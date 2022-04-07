<template>
    <td style="display: flex">
      <div @click="selectLotDiv(0)" class="boxes"></div>
      <input
        type="number"
        @input="enterNewLotQty(0, parseInt($event.target.value))"
        v-if="isLotSelected(0)"
      />
      <!-- eslint-disable-next-line  -->
      <div ref="this.idx" style="display: flex" v-for="(lot, idx) in lots" :key="idx" v-if="lot.Lot_Id">
        <div @click="selectLotDiv(idx + 1)" :style="getBoxStyle(lot)"></div>
        <input
          type="number"
          @input="enterNewLotQty(idx + 1, parseInt($event.target.value))"
          v-if="isLotSelected(idx + 1)"
        />
      </div>
    </td>
</template>

<script>
export default {
  name: "BaseDivs",
  props: {
      lotData : Array
  },
  data() {
    return {
        lots: this.lotData,
        lotsSelected: [],
    };
  },
  created(){},
  methods: {
    enterNewLotQty(lotIdx, quantity) {
      let newLot = this.lots.find(
        (x) => x.Lot_Id === null && x.lotIdx === lotIdx
      );
      if (newLot !== undefined) {
        newLot.No_of_Plants = quantity;
        newLot.Row_length = quantity * 1;
      } else {
        this.lots.splice(lotIdx, 0, {
          Lot_Id: null,
          No_of_Plants: quantity,
          Row_length: quantity * 1,
          Width_From: 0,
          Width_To: 0,
          Group_color_code:
            "#" + (Math.random().toString(16) + "000000").substring(2, 8),
          lotIdx: lotIdx,
        });
      }
      this.updateBlockList(this.lots);
    },
    updateBlockList(rowLots) {
      let totalRowLength = rowLots.reduce((acc, item) => {
        return acc + item.Row_length;
      }, 0);
      let Width_From = 0;
      let Width_To = 0;
      let isNewLot =
        rowLots.findIndex((x) => x.Lot_Id === null) > -1 ? true : false;
      rowLots.forEach((item, i) => {
        Width_From = i > 0 ? rowLots[i - 1].Width_To : 0;
        Width_To = parseFloat(((100 * item.Row_length) / totalRowLength + Width_From).toFixed(2));
        console.log(Width_To);
        item.Width_From = isNewLot ? Width_From : item.Width_From_Pre;
        item.Width_To = isNewLot ? Width_To : item.Width_To_Pre;
      });
    },
    selectLotDiv(idx) {
      let lotIdx = this.lotsSelected.findIndex((x) => x === idx);
      if (lotIdx === -1) {
        this.lotsSelected.push(idx);
        this.highLightSelected(idx);
      } else this.lotsSelected.splice(lotIdx, 1);
    },
    isLotSelected(idx) {
      return this.lotsSelected.includes(idx);
    },
    getBoxStyle(rowLots) {
      let opacity = 0.5;
      return `width:12px;height:12px;margin-left: 5px;background-color:${rowLots.Group_color_code};opacity:${opacity};`;
    },
  },
};
</script>

<style scoped>
.boxes {
  background: #a4a4a4;
  float: left;
  height: 12px;
  width: 12px;
}
input {
  width: 4em;
  height: 22px;
  position: relative;
  bottom: 5px;
  margin-left: 0.5em;
  font-weight: 700;
  -moz-appearance: textfield;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
