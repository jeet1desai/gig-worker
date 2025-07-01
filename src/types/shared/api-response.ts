export interface FieldErrorMap {
  [field: string]: string
}

export interface ErrorObject {
  code: string
  message: string
  details?: string | string[]
  fieldErrors?: FieldErrorMap
}

export interface ApiResponse<T = null, S = null> {
  success: boolean
  data?: T
  meta?: S
  error?: ErrorObject
  message?: string
}
