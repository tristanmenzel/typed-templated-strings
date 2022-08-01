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

## Putting it to use

```ts
import { CustomTypedTemplate, ArgsFrom } from 'typed-templated-strings'

class FormattedDate{
  format: Intl.DateTimeFormat
  constructor(public date:Date, locale = 'en-AU') {
    this.format = new Intl.DateTimeFormat(locale)
  }
  toString() {
    return this.format.format(this.date)
  }
}

// You can declare re-usable param types
const Params = {
  FirstName: 'firstName:string' as const,
  LastName: 'lastName:string' as const,
  Birthday: 'birthday:formattedDate' as const
}

// Create your custom typed template which maps any custom types to an alias
const TypedTemplate = CustomTypedTemplate<{
  formattedDate: FormattedDate
}>()

// Define a bunch of templates
const Templates = {
  Welcome: TypedTemplate`Hello ${Params.FirstName} ${Params.LastName}, welcome to the site`,
  Birthday: TypedTemplate`Hello ${Params.FirstName}, Wishing you a very happy birthday on ${Params.Birthday}!`
}

// Alias the type of our template dictionary
type TemplatesType = typeof Templates

// Use the ArgsFrom utility type to extract arg types from a template
function sendTemplatedEmail<TTemplateName extends keyof TemplatesType>(templateName: TTemplateName, args: ArgsFrom<TemplatesType[TTemplateName]>) {
  /* we have to cast args here as `TTemplateName` is an open generic meaning our args type is a union of all possible templates, however when we call sendTemplatedEmail we close the generic and the type of args will be inferred correctly. */
  const body = Templates[templateName].toString(args as any)
  // Do something with 'body'
}

// Invoke the function. Note that missing and/or incorrectly typed parameters are detected by typescript
sendTemplatedEmail('Welcome', {
  firstName: 'Billy',
  lastName: 'Joel',    
})
sendTemplatedEmail('Birthday', {
  firstName: 'Sally',
  birthday: new FormattedDate(new Date('2000-01-01'))
})
```


