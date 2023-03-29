// Utility types:

export type ValueOf<T extends Array<string | number>> = T[number]
export declare type ExcludeOptional<T> = T extends undefined ? never : T
export declare type PickOptional<T> = T extends undefined ? T : never
export declare type StringToBoolean<T> = T extends 'true' | 'false' ? boolean : T

export type Simplified<T> = {
  [K in keyof T]: T[K]
} & object

export type SimplifiedInfer<T> = T extends infer Tbis
  ? {
      [K in keyof Tbis]: Tbis[K]
    }
  : never

// Others:

export type CssModule = { readonly [key: string]: string } & Record<string, string>
