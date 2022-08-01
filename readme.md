# typed-templated-strings

[String interpolation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#string_interpolation) is a fantastic tool for inserting arbitrary values into a string, but the template is not re-usable.  [Tagged templates](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates) allow us to define a template in a familiar format but customise the way the interpolated string is built. 

This library takes advantage of this feature, plus a bit of typescript [magic](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html) to create strongly typed template objects which allow you to evaluate the template with the relevant arguments at a later point. 


## Installation

```shell
npm i -S typed-templated-strings
```

## Usage - Basic

```ts
import { TypedTemplate } from 'typed-templated-strings'

const template = TypedTemplate`Greetings ${'toName:string'}, from ${'fromName:string'}`

// Prints 'Greetings Jane, from Greg'
console.log(template.toString({toName: 'Jane', fromName: 'Greg'}))
```

## Usage - Custom types

```ts
import { CustomTypedTemplate } from 'typed-templated-strings'

class MyClass {
  constructor(public value: number) {}
  // The toString method will be called to format the object as a string
  toString() {
    return `{custom type value: ${this.value}}`
  }
}

const MyTypedTemplate = CustomTypedTemplate<{myClassAlias: MyClass}>()

const template = MyTypedTemplate`Now you can use a parameter with custom types. ${'arg:myClassAlias'}`

// Prints 'Now you can use a parameter with custom types. {custom type value: 5}'
console.log(template.toString({arg:new MyClass(5)}))
```


