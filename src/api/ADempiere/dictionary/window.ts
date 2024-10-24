/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Elsio Sanchez elsiosanchez15@outlook.com https://github.com/elsiosanchez
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

/**
 * Request dictionary Window metadata
 * @param {number} id, identifier
 */
export function requestWindowMetadata({
  id,
  // mandatory to open search
  language,
  clientId,
  roleId,
  userId
}) {
  return request({
    url: `/dictionary/windows/${id}`,
    method: 'get',
    params: {
      language,
      client_id: clientId,
      role_id: roleId,
      user_id: userId
    }
  })
}

/**
 * Request Get Tabs
 * @param {number} id
 */
export function requestTabMetadata({
  id,
  windowId
}) {
  return request({
    url: `/dictionary/windows/${windowId}/tabs/${id}`,
    method: 'get'
  })
}
