export type SLObject =
  | {
      [name: string]: any
    }
  | Record<string, any>

export type SLBaseType = {
  required?: boolean // if can be undefined
  nullable?: boolean // if can be null
  raw?: string | ((value: any) => string) // raw representation of the type
}
export type SLScalarType = SLBaseType & {
  name: 'string' | 'number' | 'boolean'
  value: SLNativeScalarType
}
export type SLArrayType = SLBaseType & {
  name: 'array'
  value: SLNativeScalarType
}
export type SLEnumType = SLBaseType & {
  name: 'enum'
  value: (string | number)[]
}
// type SLObjectType = SLBaseType & {
//   name: 'object'
//   value: Record<string, SLType>
// }
export type SLNativeScalarType = string | number | boolean
export type SLNativeType = SLNativeScalarType | null | undefined | SLObject | any[]
export type SLType = SLScalarType | SLEnumType | SLArrayType // | SLObjectType
export type SLInputType = {
  name?: string
  description?: string
  defaultValue?: any
  type?: SLType | SLScalarType['name']
  if?: never // Storybook-only
  [key: string]: any
}

export type SLArgTypes<TArgs = SLObject> = {
  [_name in keyof TArgs]: SLInputType
}

export type SLPageProps = {
  [name: string]: any
}

export type SLStoryPageProps = {
  storyId: string
}
