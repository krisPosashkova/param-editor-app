type ParamType = 'string' | 'number' | 'select'

export interface Param {
  id: number
  name: string
  type: ParamType
  options?: string[]
}

export interface ParamValue {
  paramId: number
  value: string
}

export interface Color {
  id: number
  name: string
}

export interface Model {
  paramValues: ParamValue[]
  colors?: Color[]
}

export interface ParamEditorRef {
  getModel: () => Model
}
