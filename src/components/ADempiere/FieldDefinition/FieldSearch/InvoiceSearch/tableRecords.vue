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
  <div>
    <el-table
      v-loading="isLoadingRecords"
      highlight-current-row
      :border="true"
      fit
      :data="recordsList"
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
  </div>
</template>

<script>
import store from '@/store'

import { computed, defineComponent, ref } from '@vue/composition-api'

// Components and Mixins
import IndexColumn from '@/components/ADempiere/DataTable/Components/IndexColumn.vue'

// Utils and Helper Methods
import { formatQuantity } from '@/utils/ADempiere/formatValue/numberFormat'
import { convertBooleanToString } from '@/utils/ADempiere/formatValue/booleanFormat.js'
import { isEmptyValue } from '@/utils/ADempiere'

export default defineComponent({
  name: 'TableRecords',

  components: {
    IndexColumn
  },

  setup() {
    const listSummary = []
    const isLoadingRecords = ref(false)

    const timeOutRecords = ref(null)
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

    const recordsList = computed(() => {
      const invoiceList = store.getters.getInvoicesSearchFieldRecordsList
      setTime()
      if (isEmptyValue(invoiceList)) return []
      return invoiceList.map((list) => {
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
          is_paid: convertBooleanToString(list.is_paid),
          is_sales_transaction: convertBooleanToString(list.is_sales_transaction),
          description: list.description,
          po_reference: list.po_reference
        }
      })
    })

    function setTime() {
      clearTimeout(timeOutRecords.value)
      isLoadingRecords.value = true
      timeOutRecords.value = setTimeout(() => {
        isLoadingRecords.value = false
      }, 1000)
    }

    function searchRecordsList() {
      store.dispatch('searchInvociesInfos', {})
    }

    searchRecordsList()
    return {
      //
      isLoadingRecords,
      //
      recordsList,
      headerList,
      listSummary,
      //
      searchRecordsList
    }
  }
})
</script>
