<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
  Contributor(s): Elsio Sanchez Elsiosanches@gmail.com https://github.com/Elsiosanchez
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
  <IssueManagement />
</template>

<script>
import { defineComponent } from '@vue/composition-api'
import IssueManagement from './index.vue'
import store from '@/store'

export default defineComponent({

  name: 'IssueManagementAll',

  components: {
    IssueManagement
  },
  setup() {
    function loadIssues() {
      store.dispatch('listRequestAll', {})
      store.dispatch('findListMailTemplates')
    }

    loadIssues()
  }
})
</script>
