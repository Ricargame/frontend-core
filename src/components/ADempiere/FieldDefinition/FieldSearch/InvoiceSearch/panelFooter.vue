<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
  Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com https://github.com/EdwinBetanc0urt
  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program. If not, see <https:www.gnu.org/licenses/>.
-->

<template>
  <el-row :gutter="24">
    <el-col :span="14">
      <custom-pagination
        :container-manager="containerManager"
        :is-showed-selected="false"
        :total-records="recordCount"
        :selection="selectedRecords"
      />
    </el-col>
    <el-col :span="10">
      <samp style="float: right; padding-top: 10px">
        <el-button type="info" class="button-base-icon" plain>
          <svg-icon icon-class="layers-clear" />
        </el-button>
        <el-button
          type="success"
          class="button-base-icon"
          icon="el-icon-refresh-right"
        />
        <el-button
          type="danger"
          class="button-base-icon"
          icon="el-icon-close"
        />
        <el-button
          type="primary"
          class="button-base-icon"
          icon="el-icon-check"
        />
      </samp>
    </el-col>
  </el-row>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

// Components and Mixins
import CustomPagination from '@/components/ADempiere/DataTable/Components/CustomPagination.vue'
import IndexColumn from '@/components/ADempiere/DataTable/Components/IndexColumn.vue'

export default defineComponent({
  name: 'PanelFooter',

  components: {
    CustomPagination,
    IndexColumn
  }

  // setup(props) {
  //   function setPageNumber(pageNumber) {
  //     loadRecordsList({
  //       pageNumber,
  //     });
  //   }
  //   function setPageSize(pageSize) {
  //     loadRecordsList({
  //       pageSize,
  //     });
  //   }
  //   return {
  //     //
  //     setPageNumber,
  //     setPageSize,
  //   };
  // },
})
</script>
