<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
  Contributor(s): Elsio Sanchez elsiosanches@gmail.com https://github.com/elsiosanchez
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
  <el-main
    v-shortkey="shortsKey"
    v-loading="isLoadingFields"
    class="accouting-combintantions-list-container"
    style="padding-top: 0px"
    @shortkey.native="keyAction"
  >
    <el-collapse
      v-model="activeAccordion"
      accordion
      class="accouting-combintantions-query-criteria"
    >
      <el-collapse-item name="query-criteria">
        <template slot="title">
          {{ title }}
        </template>
      </el-collapse-item>
    </el-collapse>
    <el-table
      ref=""
      v-loading="isLoadingRecords"
      class=""
      highlight-current-row
      border
      fit
      :height="200"
      :max-height="400"
      size="mini"
    >
      <p slot="empty" style="width: 100%">
        {{ $t("notifications.searchWithOutRecords") }}
      </p>
      <!-- <index-column :page-number="recordData.pageNumber" /> -->
      <el-table-column
        v-for="(head, key) in labelTable"
        :key="key"
        :label="head.label"
        prop="value"
        header-align="center"
      >
        <template slot-scope="scope">
          <!-- formatted displayed value -->
          <cell-display-info
            :parent-uuid="metadata.parentUuid"
            :container-uuid="uuidForm"
            :field-attributes="head"
            :container-manager="containerManagerSearchList"
            :scope="scope"
            :data-row="scope.row"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-row class="accouting-combintantions-footer">
      <!-- <el-col :span="20">
        <custom-pagination
          :total="recordData.recordCount"
          :current-page="recordData.pageNumber"
          :container-manager="containerManagerSearchList"
          :handle-change-page-number="setPageNumber"
          :records-page="recordsList.length"
          :selection="selection"
        />
      </el-col> -->

      <el-col :span="4">
        <samp style="float: right; padding-top: 4px;">
          <el-button
            :loading="isLoadingRecords"
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
  </el-main>
</template>

<script>
import {
  computed,
  // onUpdated,
  ref
} from '@vue/composition-api'

import store from '@/store'

// Utils and Helper Methods
import { isEmptyValue, isSameValues } from '@/utils/ADempiere/valueUtils'

export default {
  name: 'PanelGeneralInfoSearch',

  props: {
    containerManager: {
      type: Object,
      default: () => ({
        actionPerformed: () => {},
        getFieldsLit: () => {},
        setDefaultValues: () => {}
      })
    },
    metadata: {
      type: Object,
      default: () => {
        // return {
        //   // containerUuid: ACCOUTING_COMBINATIONS_LIST_FORM,
        //   columnName: COLUMN_NAME,
        // };
      }
    },
    showPopover: {
      type: Boolean,
      default: () => false
    }
  },

  setup(props) {
    // Ref
    const activeAccordion = ref('query-criteria')
    const isLoadingFields = ref(false)
    const isLoadingRecords = ref(false)

    // Computed
    const title = computed(() => {
      let title = props.metadata.panelName
      if (
        !isEmptyValue(props.metadata.panelName) &&
        !isSameValues(props.metadata.panelName, props.metadata.name)
      ) { title += ` (${props.metadata.name})` }
      return title
    })

    const shortsKey = computed(() => {
      return {
        close: ['esc'],
        refreshList: ['f5']
      }
    })

    const fieldsListElements = computed(() => {
      return store.getters.getFieldsListAccountInvoice
    })
    function getAccoutingElements() {
      const accoutingElements = store.getters.getFieldsListAccountInvoice
      if (isEmptyValue(accoutingElements)) {
        store.dispatch('listFieldsListTableInvoice')
      }
    }
    const labelTable = computed(() => {
      return fieldsListElements.value.map((field) => {
        return {
          label: field
        }
      })
    })
    getAccoutingElements()

    return {
      // Ref
      isLoadingFields,
      activeAccordion,
      isLoadingRecords,
      // Computed
      title,
      labelTable,
      shortsKey
    }
  }
}
</script>
<style lang="scss">
.accouting-combintantions-list-container {
  .accouting-combintantions-query-criteria {
    // space between quey criteria and table
    .el-collapse-item__content {
      padding-bottom: 0px !important;
    }

    .button-save {
      padding: 2px 6px;
      svg {
        font-size: 30px !important;
      }
    }
  }
}
</style>
