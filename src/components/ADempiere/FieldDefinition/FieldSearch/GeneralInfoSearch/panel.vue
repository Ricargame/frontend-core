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
  <el-collapse class="business-partners-query-criteria">
    <el-collapse-item
      :name="ACCORDION_KEY"
      class="business-partners-query-criteria-collapse"
    >
      <template slot="title">
        {{ title }}
      </template>
      <el-form label-position="top" size="small" class="form-base">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="Documento">
              <el-input cleable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Socio del negocio">
              <el-select
                v-model="business"
                clearable
                filterable
                size="mini"
                :filter-method="filterSearchBusinnes"
                style="margin: 0px;width: 100%;"
                @visible-change="showList"
                @change="Refresh"
              >
                <el-option
                  v-for="item in optionsListBussines"
                  :key="item.id"
                  :label="item.displayColumn"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" style="text-align:center">
            <el-form-item label="Transaccion de venta">
              <el-switch />
            </el-form-item>
          </el-col>
          <el-col :span="6" style="text-align:center">
            <el-form-item label="Pagado">
              <el-switch v-model="paid" @change="Refresh" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="Descripcion">
              <el-input cleable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Fecha de factura">
              <el-input cleable type="date" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Fecha de factura">
              <el-input cleable type="date" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="Facura">
              <el-select
                v-model="displayValue"
                clearable
                filterable
                size="mini"
                :filter-method="filterSearchOrder"
                style="margin: 0px;width: 100%;"
                @visible-change="showList"
              >
                <el-option
                  v-for="item in optionsListOrder"
                  :key="item.id"
                  :label="item.displayColumn"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Gran total">
              <el-input cleable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="gran total">
              <el-input cleable />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-collapse-item>

    <el-table
      ref=""
      v-loading="isLoadingRecords"
      class=""
      highlight-current-row
      :data="listSummary"
      :border="true"
      fit
      height="300"
      style="width: 100%"
      size="mini"
    >
      <index-column />
      <el-table-column
        v-for="(header, key) in headerList"
        :key="key"
        :align="header.align"
        :width="header.width"
        :label="header.label"
        :prop="header.columnName"
      />
    </el-table>

    <el-row :gutter="24">
      <el-col :span="14">
        <custom-pagination
          :container-manager="containerManager"
          :is-showed-selected="false"
          :total-records="recordCount"
          :selection="selectedRecords"
          :page-number="pageNumberValue"
          :page-size="pageSizeValue"
          :handle-change-page-number="setPageNumber"
          :handle-change-page-size="setPageSize"
        />
      </el-col>
      <el-col :span="10">
        <samp style="float: right; padding-top: 10px;">
          <el-button
            type="info"
            class="button-base-icon"
            plain
          >
            <svg-icon icon-class="layers-clear" />
          </el-button>
          <el-button
            :loading="isLoadingRecords"
            type="success"
            class="button-base-icon"
            icon="el-icon-refresh-right"
            @click="Refresh({})"
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
  </el-collapse>
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'

// Constants
import { GENERAL_INFO_SEARCH_LIST_FORM } from '@/utils/ADempiere/dictionary/field/search/index.ts'

// Components and Mixins
import CustomPagination from '@/components/ADempiere/DataTable/Components/CustomPagination.vue'
import IndexColumn from '@/components/ADempiere/DataTable/Components/IndexColumn.vue'

// Utils and Helper Methods
import { isEmptyValue, isSameValues } from '@/utils/ADempiere/valueUtils'
import { formatQuantity } from '@/utils/ADempiere/formatValue/numberFormat'
// import { formatDate } from '@/utils/ADempiere/formatValue/dateFormat'

import { requestListOrders, requestListBusinessPartners, requestListInvoicesInfo } from '@/api/ADempiere/field/search/invoice.ts'

export default defineComponent({
  name: 'Invoice',

  components: {
    CustomPagination,
    IndexColumn
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

  data() {
    return {
      input: ''
    }
  },

  setup(props) {
    const ACCORDION_KEY = 'query-criteria'
    const listSummary = ref([])
    const displayValue = ref(props.metadata.value)
    const isLoadingRecords = ref(false)
    const timeOutRecords = ref(null)
    const paid = ref(false)
    const business = ref(undefined)
    const pageNumberValue = ref(0)
    const pageSizeValue = ref(0)
    // table
    const optionsListBussines = ref([])
    const optionsListOrder = ref([])

    const headerList = ref([
      {
        label: 'Socio del negocio',
        columnName: 'business_partner',
        width: '150',
        align: 'center'
      },
      {
        label: 'Fecha de factura',
        columnName: 'date_invoiced',
        width: '140',
        align: 'center'
      },
      {
        label: 'Documento No.',
        columnName: 'document_no',
        width: '120',
        align: 'center'
      },
      {
        label: 'Moneda',
        columnName: 'currency',
        width: '70',
        align: 'center'
      },
      {
        label: 'Gran Total',
        columnName: 'grand_total',
        width: '90',
        align: 'right'
      },
      {
        label: 'Convertido',
        columnName: 'converted_amount',
        width: '90',
        align: 'right'
      },
      {
        label: 'Abierto',
        columnName: 'open_amount',
        width: '90',
        align: 'center'
      },
      {
        label: 'Termino de pago',
        columnName: 'payment_term',
        width: '120',
        align: 'center'
      },
      {
        label: 'Pagado',
        columnName: 'is_paid',
        width: '70',
        align: 'right'
      },
      {
        label: 'Transaccion de ventas',
        columnName: 'is_sales_transaction',
        width: '155',
        align: 'right'
      },
      {
        label: 'Descripcion',
        columnName: 'description',
        width: '100',
        align: 'center'
      },
      {
        label: 'Referencia de orden de socio del negocio',
        columnName: 'po_reference',
        width: '260',
        align: 'center'
      }
    ])

    const recordCount = computed(() => {
      return 50
    })

    const titleField = computed(() => {
      return props.metadata.name
    })
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

    function showList(isShow) {
      if (isShow && isEmptyValue(optionsListBussines.value)) filterSearchBusinnes(displayValue.value)
      else if (isShow && isEmptyValue(optionsListOrder.value)) filterSearchOrder(displayValue.value)
    }
    function filterSearchBusinnes(searchQuery) {
      requestListBusinessPartners({
        searchValue: searchQuery
      })
        .then(response => {
          const { records } = response
          if (isEmptyValue(records)) return
          optionsListBussines.value = records.map(list => {
            return {
              ...list,
              displayColumn: list.values.DisplayColumn
            }
          })
        })
    }

    function filterSearchOrder(searchQuery) {
      requestListOrders({
        searchValue: searchQuery
      })
        .then(response => {
          const { records } = response
          if (isEmptyValue(records)) return
          optionsListOrder.value = records.map(list => {
            return {
              ...list,
              displayColumn: list.values.DisplayColumn
            }
          })
        })
    }
    function Refresh(pageSize = pageSizeValue.value) {
      clearTimeout(timeOutRecords.value)
      timeOutRecords.value = setTimeout(() => {
        isLoadingRecords.value = true
        requestListInvoicesInfo({
          pageSize,
          page_token: pageNumberValue.value,
          businessPartner: business.value,
          paid: paid.value
        })
          .then(response => {
            const { records } = response
            listSummary.value = records.map(list => {
              return {
                ...list,
                business_partner: list.business_partner,
                date_invoiced: list.date_invoiced,
                document_no: list.document_no,
                currency: list.currency,
                grand_total: formatQuantity({ value: list.grand_total }),
                converted_amount: formatQuantity({ value: list.converted_amount }),
                open_amount: formatQuantity({ value: list.open_amount }),
                payment_term: list.payment_term,
                is_paid: list.is_paid ? 1 : 0,
                is_sales_transaction: list.is_sales_transaction ? 1 : 0,
                description: list.description,
                po_reference: list.po_reference
              }
            })
          })
          .finally(() => {
            isLoadingRecords.value = false
          })
      }, 500)
    }

    function setPageNumber(pageNumber) {
      Refresh({
        pageNumber
      })
    }
    function setPageSize(pageSize) {
      Refresh({
        pageSize
      })
    }

    const pageNumber = computed(() => {
      return pageNumberValue.value.pageNumber
    })

    const pageSize = computed(() => {
      return pageSizeValue.value.pageSize
    })

    Refresh()
    return {
      //
      paid,
      business,
      pageNumberValue,
      pageSizeValue,
      //
      ACCORDION_KEY,
      optionsListBussines,
      optionsListOrder,
      displayValue,
      listSummary,
      headerList,
      isLoadingRecords,
      // Computed
      title,
      titleField,
      recordCount,
      // Methods
      showList,
      filterSearchBusinnes,
      filterSearchOrder,
      Refresh,
      setPageNumber,
      setPageSize,
      pageNumber,
      pageSize
    }
  }
})
</script>

<style lang='scss'>
.business-partners-query-criteria {
  .business-partners-query-criteria-collapse {
    .el-form-item {
      &.el-form-item--mini {
        margin-bottom: 6px;
      }
    }
    .el-collapse-item__header {
      height: 40px;
      line-height: 40px;
    }

    .el-collapse-item__wrap {
      .el-collapse-item__content {
        padding-bottom: 5px;
      }
    }
  }
}
.el-row {
  margin-bottom: 20px;
}
.el-popover{
  width:1200px !important
}

</style>
