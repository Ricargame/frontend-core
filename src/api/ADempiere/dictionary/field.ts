/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com https://github.com/EdwinBetanc0urt
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

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export function requestFieldMetadata({
  id,
  tableName,
  columnName,
  columnId,
  elementId,
  elementColumnName
}) {
  let url
  switch (true) {
    case !isEmptyValue(id):
      url = `/dictionary/fields/${id}`
      break
    case !isEmptyValue(columnId):
      url = `/dictionary/fields/column/${columnId}`
      break
    case !isEmptyValue(elementId):
      url = `/dictionary/fields/element/${elementId}`
      break
    case !isEmptyValue(elementColumnName):
      url = `/dictionary/fields/element/column/${elementColumnName}`
      break
    case (!isEmptyValue(tableName) && !isEmptyValue(columnName)):
      url = `/dictionary/fields/${tableName}/${columnName}`
      break
  }
  return request({
    url,
    method: 'get'
  })
}

/**
 * Load identifiers to build display column by rows
 * @param {String} tableName
 * @returns
 */
export function requestIdentifierColumns({
  tableName
}) {
  return request({
    url: `/dictionary/identifiers/${tableName}`,
    method: 'get'
  })
}

/**
 * Load fields to query
 * @param {String} tableName
 * @returns
 */
export function requestSearchFields({
  fieldId,
  processParameterId,
  browseFieldId,
  columnId,
  tableName,
  columnName
}) {
  let url = `dictionary/search/${tableName}`
  switch (true) {
    case !isEmptyValue(fieldId):
      url = `/dictionary/search/field/${fieldId}`
      break
    case !isEmptyValue(processParameterId):
      url = `/dictionary/search/parameter/${processParameterId}`
      break
    case !isEmptyValue(browseFieldId):
      url = `/dictionary/search/query-criteria/${browseFieldId}`
      break
    case !isEmptyValue(columnId):
      url = `/dictionary/search/column/${columnId}`
      break
    case (!isEmptyValue(tableName) && !isEmptyValue(columnName)):
      url = `/dictionary/search/table/${tableName}/${columnName}`
      break
  }

  return request({
    url: url,
    method: 'get'
  })
}
