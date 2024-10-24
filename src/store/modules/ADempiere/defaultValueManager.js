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

import Vue from 'vue'

// API Request Methods
import { requestDefaultValue } from '@/api/ADempiere/userInterface/defaultValue.ts'

// Constants
import {
  DISPLAY_COLUMN_PREFIX, UNIVERSALLY_UNIQUE_IDENTIFIER_COLUMN_SUFFIX
} from '@/utils/ADempiere/dictionaryUtils'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { isSameSize } from '@/utils/ADempiere/formatValue/iterableFormat'
import { generateContextKey, getContextAttributes } from '@/utils/ADempiere/contextUtils/contextAttributes'

const initState = {
  inRequest: new Map(),
  storedDefaultValue: {}
}

const defaultValueManager = {
  state: initState,

  mutations: {
    setDefaultValue(state, { key, clientId, contextAttributesList, uuid, value, displayedValue, isActive, reason }) {
      Vue.set(state.storedDefaultValue, key, {
        clientId,
        contextAttributesList,
        uuid,
        value,
        displayedValue,
        isActive,
        reason
      })
    },

    deleteDefaultValue(state, {
      key
    }) {
      Vue.set(state.storedDefaultValue, key, undefined)
    },

    resetStateDefaultValue(state) {
      state = initState
    }
  },

  actions: {
    /**
     * @param {string} parentUuid
     * @param {string} containerUuid
     * @param {string} columnName
     * @param {array} contextColumnNames
     * @param {string} fieldUuid|processParameterUuid|columnUuid|browseFieldUuid
     * @param {mixed} value overwrite default value on dictionary definition
     */
    getDefaultValueFromServer({ state, commit, rootGetters }, {
      parentUuid,
      containerUuid,
      contextColumnNames,
      //
      id,
      uuid,
      fieldUuid,
      browseFieldId,
      processParameterId,
      processParameterUuid,
      browseFieldUuid,
      columnUuid,
      columnName,
      value
    }) {
      const defaultEmptyResponse = {
        uuid: undefined,
        displayedValue: undefined,
        value: undefined
      }
      return new Promise(resolve => {
        if (isEmptyValue(id) && isEmptyValue(uuid) && isEmptyValue(processParameterId) && isEmptyValue(browseFieldId)) {
          resolve({
            ...defaultEmptyResponse,
            reason: 'Without identifier'
          })
          return
        }

        const contextAttributesList = getContextAttributes({
          parentUuid,
          containerUuid,
          contextColumnNames,
          isBooleanToString: true,
          format: 'object'
        })

        // fill context value to continue
        if (!isSameSize(contextColumnNames, Object.values(contextAttributesList))) {
          resolve({
            ...defaultEmptyResponse,
            reason: 'Without context'
          })
          return
        }

        // const isWithoutValues = contextAttributesList.find(attribute => isEmptyValue(attribute.value))
        // if (isWithoutValues) {
        //   console.warn(`Default value without response, fill the ${isWithoutValues.columnName} field.`)
        //   resolve(defaultEmptyResponse)
        //   return
        // }

        const clientId = rootGetters.getSessionContextClientId

        let key = clientId
        // TODO: generate with your fieldUuid, processParameterUuid, browseFieldUuid
        // if (!isEmptyValue(uuid)) {
        //   key += `|${uuid}`
        // }
        if (!isEmptyValue(fieldUuid)) {
          key += `|${fieldUuid}`
        } else if (!isEmptyValue(processParameterUuid)) {
          key += `|${processParameterUuid}`
        } else if (!isEmptyValue(browseFieldUuid)) {
          key += `|${browseFieldUuid}`
        }

        const contextKey = generateContextKey(contextAttributesList)
        key += contextKey
        key += `|${value}`

        // if it is the same request, it is not made
        if (state.inRequest.get(key)) {
          resolve({
            ...defaultEmptyResponse,
            reason: 'In Request'
          })
          return
        }
        state.inRequest.set(key, true)

        let contextAttributes
        if (!isEmptyValue(contextAttributesList)) {
          contextAttributes = JSON.stringify(contextAttributesList)
        }

        requestDefaultValue({
          contextAttributes,
          id,
          browseFieldId,
          processParameterId,
          value
        })
          .then(valueResponse => {
            const { values, is_active } = valueResponse
            // const values = {
            //   KeyColumn: undefined,
            //   DisplayColumn: undefined,
            //   UUID: undefined
            // }

            let valueOfServer = values.KeyColumn
            // do not use the convertArrayKeyValueToObject method to avoid losing a key with an empty value
            if (isEmptyValue(valueOfServer) && Object.keys(values).length === 1) {
              // number values (`Line` for example)
              valueOfServer = values[columnName]
            }
            // } else {
            //   valueResponse.attributes.forEach(attribute => {
            //     const { key: column, value: attributeValue } = attribute
            //     values[column] = attributeValue
            //   })
            // }

            const displayValue = values.DisplayColumn

            commit('setDefaultValue', {
              key,
              clientId,
              contextAttributesList,
              id, // field id
              uuid: values.UUID, // record uuid
              // set value of server to parsed if is number as string "101" -> 101
              value: valueOfServer,
              displayedValue: displayValue,
              isActive: is_active,
              reason: 'Successful default value'
            })

            commit('updateValueOfField', {
              parentUuid,
              containerUuid,
              columnName,
              value: valueOfServer
            })
            if (!isEmptyValue(displayValue)) {
              commit('updateValueOfField', {
                parentUuid,
                containerUuid,
                columnName: DISPLAY_COLUMN_PREFIX + columnName,
                value: displayValue
              })
            }
            if (!isEmptyValue(values.UUID)) {
              commit('updateValueOfField', {
                parentUuid,
                containerUuid,
                columnName: columnName + UNIVERSALLY_UNIQUE_IDENTIFIER_COLUMN_SUFFIX,
                value: values.UUID
              })
            }

            resolve({
              displayedValue: displayValue,
              value: valueOfServer,
              uuid: values.UUID,
              isActive: is_active,
              reason: 'Successful default value'
            })
          })
          .catch(error => {
            // clear default value if error
            commit('updateValueOfField', {
              parentUuid,
              containerUuid,
              columnName,
              value: undefined
            })
            commit('updateValueOfField', {
              parentUuid,
              containerUuid,
              columnName: DISPLAY_COLUMN_PREFIX + columnName,
              value: undefined
            })
            commit('updateValueOfField', {
              parentUuid,
              containerUuid,
              columnName: columnName + UNIVERSALLY_UNIQUE_IDENTIFIER_COLUMN_SUFFIX,
              value: undefined
            })

            resolve({
              ...defaultEmptyResponse,
              reason: 'Error request default value'
            })
            console.warn(`Error getting default value (${columnName}) from server. Error code ${error.code}: ${error.message}.`)
          })
          .finally(() => {
            // current request finalized
            state.inRequest.set(key, false)
          })
      })
    },

    deleteDefaultValue({ commit, rootGetters }, {
      parentUuid,
      containerUuid,
      uuid,
      contextColumnNames = [],
      value
    }) {
      return new Promise(resolve => {
        const clientId = rootGetters.getSessionContextClientId
        let key = `${clientId}|${uuid}`

        const contextAttributesList = getContextAttributes({
          parentUuid,
          containerUuid,
          contextColumnNames,
          isBooleanToString: true
        })

        const contextKey = generateContextKey(contextAttributesList)

        key += contextKey
        key += `|${value}`

        commit('deleteDefaultValue', {
          key
        })

        resolve()
      })
    }
  },

  getters: {
    getStoredDefaultValue: (state, getters, rootState, rootGetters) => ({
      parentUuid,
      containerUuid,
      contextColumnNames = [],
      contextAttributesList = [],
      value,
      uuid
    }) => {
      if (isEmptyValue(contextAttributesList) && !isEmptyValue(contextColumnNames)) {
        contextAttributesList = getContextAttributes({
          parentUuid,
          containerUuid,
          contextColumnNames,
          isBooleanToString: true
        })
      }

      const clientId = rootGetters.getSessionContextClientId
      let key = `${clientId}|${uuid}`
      const contextKey = generateContextKey(contextAttributesList)
      key += contextKey
      key += `|${value}`

      const values = state.storedDefaultValue[key]

      return values
    }
  }
}

export default defaultValueManager
