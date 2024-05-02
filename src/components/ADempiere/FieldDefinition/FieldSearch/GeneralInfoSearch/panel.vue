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
  <el-collapse class="business-partners-query-criteria">
    <el-main
      class="business-partners-container"
      @shortkey.native="keyAction"
    >
      <query-criteria
        :uuid-form="uuidForm"
        :container-manager="containerManager"
        :metadata="metadata"
      />

      <table-records
        :uuid-form="uuidForm"
        :container-manager="containerManager"
        :metadata="metadata"
      />

      <panel-footer
        :uuid-form="uuidForm"
        :container-manager="containerManager"
        :metadata="metadata"
      />
    </el-main>
  </el-collapse>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import store from '@/store'

//
import QueryCriteria from '@/components/ADempiere/FieldDefinition/FieldSearch/InvoiceSearch/PanelForm/QueryCriteria'
import TableRecords from '@/components/ADempiere/FieldDefinition/FieldSearch/InvoiceSearch/tableRecords.vue'
import PanelFooter from '@/components/ADempiere/FieldDefinition/FieldSearch/InvoiceSearch/panelFooter.vue'

// Constants
import { INVOICE_LIST_FORM, COLUMN_NAME } from '@/utils/ADempiere/dictionary/field/search/invoice.ts'

//
import useInvoice from '../InvoiceSearch/PanelForm/useInvoice.js'

export default defineComponent({
  name: 'panel',
  components: {
    QueryCriteria,
    TableRecords,
    PanelFooter
  },
  computed: {
    showPopoverInvoicesList: {
      get() {
        return store.getters.getBPShowInvoice({
          containerUuid: this.uuidForm
        })
      },
      set(value) {
        store.commit('getBPShowInvoice', {
          containerUuid: this.uuidForm,
          show: value
        })
      }
    }
  },
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
        return {
          containerUuid: INVOICE_LIST_FORM,
          columnName: COLUMN_NAME
        }
      }
    },
    showPopover: {
      type: Boolean,
      default: () => false
    }
  },

  setup(props) {
    const activate = computed(() => {
      return store.getters.getSetShow
    })

    const uuidForm = computed(() => {
      if (!isEmptyValue(props.metadata.containerUuid)) {
        return props.metadata.columnName + '_' + props.metadata.containerUuid
      }
      return INVOICE_LIST_FORM
    })

    const {
      keyAction
    } = useInvoice({
      uuidForm: uuidForm.value,
      parentUuid: props.metadata.parentUuid,
      containerUuid: props.metadata.containerUuid,
      containerManager: props.containerManager,
      fieldAttributes: props.metadata
    })

    return {
      activate,
      //
      uuidForm,
      //
      keyAction
    }
  }
})
</script>
