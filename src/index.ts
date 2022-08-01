type TemplateParamTypes = Record<string, unknown>
type TemplateParam<
  TParamTypes extends TemplateParamTypes,
  TParamName extends string,
  TParamType extends keyof TemplateParamTypes,
> = `${TParamName}:${TParamType}`
type TypeOfParam<
  TParamTypes extends TemplateParamTypes,
  T,
> = T extends TemplateParam<TParamTypes, any, infer TType>
  ? TParamTypes[TType]
  : never
type NameOfParam<
  TParamTypes extends TemplateParamTypes,
  T,
> = T extends TemplateParam<TParamTypes, infer TName, any> ? TName : never
type TupleKeys<T> = Exclude<keyof T, keyof any[]>
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never

type MapParamsInternal<
  TParams extends TemplateParamTypes,
  TKey extends keyof T,
  T,
> = TKey extends any
  ? { [key in NameOfParam<TParams, T[TKey]>]: TypeOfParam<TParams, T[TKey]> }
  : never
type MapParams<TParams extends TemplateParamTypes, T> = UnionToIntersection<
  MapParamsInternal<TParams, TupleKeys<T>, T>
>

type DefaultParams = {
  string: string
  number: number
  boolean: boolean
  null: null
  undefined: undefined
}

export type TypedTemplateObj<TArgs> = {
  toString(args: TArgs): string
}

export type ArgsFrom<TTemplate extends TypedTemplateObj<unknown>> =
  TTemplate extends TypedTemplateObj<infer TArgs> ? TArgs : never

const buildTemplate = (
  templateParts: readonly string[],
  paramTypes: string[],
  paramValues: Record<string, unknown>,
) => {
  return templateParts.reduce((acc, cur, i) => {
    if (i >= paramTypes.length) {
      return `${acc}${cur}`
    } else {
      return `${acc}${cur}${paramValues[paramTypes[i].split(':')[0]]}`
    }
  }, '')
}
export function CustomTypedTemplate<TParamTypes extends TemplateParamTypes>() {
  return function TypedTemplate<
    TArgs extends TemplateParam<TParamTypes, any, any>[],
  >(
    templateStr: TemplateStringsArray,
    ...params: TArgs
  ): TypedTemplateObj<MapParams<TParamTypes & DefaultParams, TArgs>> {
    return {
      toString(args) {
        return buildTemplate(
          templateStr,
          params,
          args as unknown as Record<string, unknown>,
        )
      },
    }
  }
}
export const TypedTemplate = CustomTypedTemplate<DefaultParams>()
