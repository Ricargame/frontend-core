/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Yamel Senih ysenih@erpya.com
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

// A simple class for make easy lookup for dynamic forms from ADempiere Meta-Data
// note that it can be used for create meta-data for lookups
// Field component: this component is created dinamically from meta-data and can be used for
// many form incluyed Window/Tab/Fields, Process and Smart Browsers
// The aproach for this file is allows define field type manual and allows get metadata from server
// Exists many attributes fro handle behavior of field, the follow is a example:
// General:
// - columnName:
// - name:
// - help
// - inTable:
// - isAdvancedQuery:
// - isMandatory:
// - isMandatoryFromLogic
// - is_read_only:
// - isDisplayed:
// - isShowedFromUser
// - isActive:
// - isSelectCreated:
// - is_always_updateable:
// - parentUuid:
// - containerUuid:
// - value:
// Lookup:
// - query:
// - directQuery:
// - tableName:
// Date and Time:
// - is_range
// - vFormat
// - valueTo
// - valueMax
// - valueMin
// Number:
// - is_range
// - valueTo
// - valueMax
// - valueMin
// Text:
// - isEncrypted
// - fieldLength
// Select:
// - isSelectCreated (created from ui for multi-selection)
// - query
// - directQuery
// - tableName
// - displayColumnName
// - default_value

import store from '@/store'

// Constants
import { CHAR, DEFAULT_SIZE, TABLE_DIRECT } from '@/utils/ADempiere/references.js'
import {
  DISPLAY_COLUMN_PREFIX, evalutateTypeField
} from '@/utils/ADempiere/dictionaryUtils.js'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import {
  getContextDefaultValue, getEvaluatedFieldLogics, getParentFields
} from '@/utils/ADempiere/contextUtils/contextField'

/**
 * Create a Field from UUID based on server meta-data
 * TODO: With table name not stored search, add table name into field metadata
 */
export function createFieldFromDictionary({
  containerUuid,
  id,
  columnId,
  elementId,
  elementColumnName,
  tableName,
  columnName,
  overwriteDefinition
}) {
  let field
  let valueToMatch
  if (id) {
    field = store.getters.getFieldFromId(id)
    valueToMatch = id
  } else if (columnId) {
    field = store.getters.getFieldFromColumnId(columnId)
    valueToMatch = columnId
  } else if (elementId) {
    field = store.getters.getFieldFromElementId(elementId)
    valueToMatch = elementId
  } if (elementColumnName) {
    field = store.getters.getFieldFromElementColumnName(elementColumnName)
    valueToMatch = elementColumnName
  } else if (tableName && columnName) {
    field = store.getters.getFieldFromElementColumnName({
      tableName,
      columnName
    })
    valueToMatch = columnName
  }

  if (isEmptyValue(field)) {
    return new Promise(resolve => {
      store.dispatch('getFieldFromServer', {
        id,
        columnId,
        elementId,
        elementColumnName,
        tableName,
        columnName
      })
        .then(response => {
          const newField = getFactoryFromField({
            containerUuid,
            field: response,
            overwriteDefinition
          })

          resolve(newField)
        }).catch(error => {
          console.warn(`LookupFactory: Get Field (match: ${valueToMatch}) From Server (State) - Error ${error.code}: ${error.message}.`)

          const templateField = createFieldFromDefinition({
            containerUuid,
            columnName,
            definition: {
              id,
              columnId,
              elementId,
              elementName: elementColumnName,
              tableName,
              columnName,
              ...overwriteDefinition
            }
          })

          resolve(templateField)
        })
    })
  }
  return new Promise(resolve => {
    const fieldWithStore = getFactoryFromField({
      containerUuid,
      field,
      overwriteDefinition
    })

    resolve(fieldWithStore)
  })
}

// Convert field getted from server to factory
function getFactoryFromField({
  containerUuid,
  field,
  overwriteDefinition = {}
}) {
  const definition = {
    parentFieldsList: field.parentFieldsList || [],
    dependent_fields: field.dependent_fields || [],
    ...field,
    is_displayed: true,
    // Overwrite definition
    ...overwriteDefinition
  }

  //  Convert it
  return createFieldFromDefinition({
    containerUuid,
    columnName: definition.columnName,
    definition
  })
}

/**
 * Create a field, it assumed that you define all behavior from source code
 * TODO: Join with generateField function
 */
export function createFieldFromDefinition({
  parentUuid,
  containerUuid,
  columnName,
  panelType = 'form',
  definition = {}
}) {
  if (!isEmptyValue(definition)) {
    if (isEmptyValue(definition.display_type)) {
      definition.display_type = CHAR.id
    } else if (definition.display_type === TABLE_DIRECT.id &&
      isEmptyValue(definition.tableName) &&
      columnName.indexOf('_ID') > 0) {
      definition.tableName = columnName.replace('_ID', '')
    }
    if (isEmptyValue(definition.is_displayed)) {
      definition.is_displayed = true
    }
    if (isEmptyValue(definition.is_read_only)) {
      definition.is_read_only = false
    }

    if (isEmptyValue(definition.isMandatory)) {
      definition.isMandatory = false
    }
    if (isEmptyValue(definition.sequence)) {
      definition.sequence = 0
      if (definition.is_displayed) {
        definition.sequence = 10
      }
    }
  }

  return getFieldTemplate({
    panelType,
    ...definition,
    isShowedFromUser: true,
    isCustomField: true,
    parentUuid,
    containerUuid,
    columnName
  })
}

// Default template for injected fields
export function getFieldTemplate(overwriteDefinition) {
  let display_type = CHAR.id // String reference (10)
  if (!isEmptyValue(overwriteDefinition.display_type)) {
    display_type = overwriteDefinition.display_type
  }

  const componentReference = evalutateTypeField(display_type)

  // set size from displayed, max 24
  let size = DEFAULT_SIZE
  if (!isEmptyValue(componentReference.size)) {
    size = componentReference.size
  }
  // rewrite size default size field
  if (!isEmptyValue(overwriteDefinition.size)) {
    size = overwriteDefinition.size
    delete overwriteDefinition.size
    if (typeof size === 'number') {
      size = {
        xs: size,
        sm: size,
        md: size,
        lg: size,
        xl: size
      }
    }
  }

  const fieldTemplateMetadata = {
    id: 0,
    uuid: '',
    name: '',
    description: '',
    help: '',
    columnName: '',
    displayColumnName: DISPLAY_COLUMN_PREFIX + overwriteDefinition.columnName, // key to display column
    elementName: '',
    fieldGroup: {
      name: '',
      fieldGroupType: ''
    },
    display_type,
    componentPath: componentReference.componentPath,
    size,
    isFieldOnly: false,
    is_range: false,
    isSameLine: false,
    sequence: 0,
    seq_no_grid: 0,
    is_identifier: 0,
    is_key: false,
    is_selection_column: false,
    is_updateable: true,
    //
    formatPattern: undefined,
    vFormat: undefined,
    value: undefined,
    valueTo: undefined,
    default_value: undefined,
    parsedDefaultValue: undefined,
    default_value_to: undefined,
    parsedDefaultValueTo: undefined,
    valueType: componentReference.valueType, // value type to convert with gGRPC
    valueMin: undefined,
    valueMax: undefined,
    //
    is_displayed: false,
    is_mandatory: false,
    is_read_only: false,
    isDisplayedFromLogic: undefined,
    isReadOnlyFromLogic: undefined,
    isMandatoryFromLogic: undefined,
    // browser attributes
    callout: undefined,
    is_query_criteria: false,
    display_logic: undefined,
    mandatory_logic: undefined,
    read_only_logic: undefined,
    handleFocusGained: false,
    handleFocusLost: false,
    handleKeyPressed: false,
    handleKeyReleased: false,
    handleActionKeyPerformed: false,
    handleActionPerformed: false,
    dependent_fields: [],
    reference: {
      tableName: '',
      keyColumnName: '',
      displayColumnName: '',
      contextColumnNames: [],
      zoomWindows: []
    },
    contextInfo: undefined,
    isShowedFromUser: false,
    isFixedTableColumn: false,
    isEnabledOptionsFields: false,
    ...overwriteDefinition
  }

  if (isEmptyValue(fieldTemplateMetadata.element_name) && !isEmptyValue(fieldTemplateMetadata.columnName)) {
    fieldTemplateMetadata.elementColumnName = fieldTemplateMetadata.columnName
  }

  // get parsed parent fields list
  const parentFieldsList = getParentFields(fieldTemplateMetadata)

  // TODO: Add support to isSOTrxDictionary
  const parsedDefaultValue = getContextDefaultValue({
    ...fieldTemplateMetadata
  })

  let parsedDefaultValueTo
  if (fieldTemplateMetadata.is_range) {
    parsedDefaultValueTo = getContextDefaultValue({
      ...fieldTemplateMetadata,
      default_value: fieldTemplateMetadata.default_value_to,
      columnName: `${fieldTemplateMetadata.columnName}_To`,
      element_name: `${fieldTemplateMetadata.element_name}_To`
    })
  }

  // evaluate logics (diplayed, mandatory, readOnly)
  const evaluatedLogics = getEvaluatedFieldLogics({
    ...fieldTemplateMetadata
  })

  return {
    ...fieldTemplateMetadata,
    ...evaluatedLogics,
    column_name: fieldTemplateMetadata.columnName,
    parsedDefaultValue,
    parsedDefaultValueTo,
    parentFieldsList
  }
}
