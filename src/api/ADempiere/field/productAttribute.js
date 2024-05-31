/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Elsio Sanchez elsiosanches@gmail.com https://github.com/elsiosanchez
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

// Get Instance for connection
import { request } from '@/utils/ADempiere/request'

// Constants
import { ROWS_OF_RECORDS_BY_PAGE } from '@/utils/ADempiere/tableUtils'

// Utils and Helper Methods
import { camelizeObjectKeys } from '@/utils/ADempiere/transformObject.js'

export function requestListProductAttributesSetInstances({
  productId,
  searchValue,
  pageToken,
  pageSize = ROWS_OF_RECORDS_BY_PAGE
}) {
  return request({
    url: `/material-management/products/${productId}/instances`,
    method: 'get',
    params: {
      page_size: pageSize,
      page_token: pageToken,
      search_value: searchValue
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

export function requestGetProductAttributeSet({
  id
}) {
  return request({
    url: `/material-management/products/${id}/attribute-values`,
    method: 'get'
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

export function requestSaveAttributeSetInstance({
  id,
  lot,
  serial,
  attributes,
  productId,
  productAttributeSetId
}) {
  console.log(attributes)
  return request({
    url: `/material-management/products/${productId}/instances`,
    method: 'post',
    data: {
      //  DSL Query
      id,
      lot,
      serial,
      attributes,
      product_attribute_set_id: productAttributeSetId
    }
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

export function requestGetProductAttributeSetInstace({
  id,
  productId
}) {
  return request({
    url: `/material-management/products/${productId}/instances/${id}`,
    method: 'get'
  })
    .then(response => {
      return camelizeObjectKeys(response)
    })
}

