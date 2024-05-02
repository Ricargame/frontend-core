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
  <el-collapse v-model="ACCORDION_KEY" class="business-partners-query-criteria">
    <el-collapse-item
      :name="ACCORDION_KEY"
      class="business-partners-query-criteria-collapse"
    >
      <template slot="title">
        {{ title }}
      </template>
      <el-form
        label-position="top"
        size="mini"
        class="form-base"
      >
        <el-row :gutter="10">
          <el-col :span="6">
            <document-field />
          </el-col>
          <el-col :span="6">
            <business-partner-field />
          </el-col>
          <el-col :span="6">
            <sale-transaction-field />
          </el-col>
          <el-col :span="6">
            <paid-field />
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <description-field />
          </el-col>
          <el-col :span="12">
            <billing-date-field />
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <invoice-field />
          </el-col>
          <el-col :span="12">
            <grand-total-field />
          </el-col>
        </el-row>
      </el-form>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

// Constants
import { GENERAL_INFO_SEARCH_LIST_FORM } from '@/utils/ADempiere/dictionary/field/search/index.ts'

// Components and Mixins
import DocumentField from './documentField.vue'
import BusinessPartnerField from './businessPartnerField.vue'
import SaleTransactionField from './saleTransactionField.vue'
import PaidField from './paidField.vue'
import BillingDateField from './billingDateField.vue'
import DescriptionField from './descriptionField.vue'
import InvoiceField from './invoiceField.vue'
import GrandTotalField from './grandTotalField.vue'
// Util and Helper Methods
import { isEmptyValue, isSameValues } from '@/utils/ADempiere/valueUtils'

export default defineComponent({
  name: 'QueryCriteria',

  components: {
    DocumentField,
    BusinessPartnerField,
    SaleTransactionField,
    PaidField,
    BillingDateField,
    DescriptionField,
    InvoiceField,
    GrandTotalField
  },
  props: {
    metadata: {
      type: Object,
      default: () => {
        return {
          containerUuid: GENERAL_INFO_SEARCH_LIST_FORM,
          columnName: undefined,
          elementName: undefined
        }
      }
    },
    containerManager: {
      type: Object,
      default: () => ({
        actionPerformed: () => {},
        getFieldsLit: () => {},
        setDefaultValues: () => {}
      })
    }
  },

  setup(props) {
    const ACCORDION_KEY = 'query-criteria'

    const title = computed(() => {
      let title = props.metadata.panelName
      if (
        !isEmptyValue(props.metadata.panelName) &&
        !isSameValues(props.metadata.panelName, props.metadata.name)
      ) {
        title += ` (${props.metadata.name})`
      }
      return title
    })

    return {
      ACCORDION_KEY,
      //
      title
    }
  }
})
</script>
