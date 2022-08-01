import { CustomTypedTemplate, TypedTemplate } from '../src'
describe('Typed template', () => {
  describe('with default types', () => {
    const template = TypedTemplate`The default template types are a number (eg. ${'num:number'}), a string (eg. ${'str:string'}), a boolean (eg. ${'bool:boolean'}), and null or undefined (eg. ${'n:null'}, ${'u:undefined'})`

    it('inserts the correct parameters in the correct place', () => {
      const result = template.toString({
        num: 123,
        str: 'Hello',
        bool: false,
        n: null,
        u: undefined,
      })

      expect(result).toBe(
        'The default template types are a number (eg. 123), a string (eg. Hello), a boolean (eg. false), and null or' +
          ' undefined (eg. null, undefined)',
      )
    })
  })

  describe('with param used twice', () => {
    const template = TypedTemplate`Dear ${'name:string'}, It is very nice to meet you. Have a great day ${'name:string'}`
    it('inserts the same value into both locations', () => {
      const result = template.toString({ name: 'Bob' })
      expect(result).toBe(
        'Dear Bob, It is very nice to meet you. Have a great day Bob',
      )
    })
  })

  describe('with custom types', () => {
    class Coordinates {
      constructor(public x: number, public y: number) {}

      toString() {
        return [this.x, this.y].join(', ')
      }
    }
    const MyCustomTypedTemplate = CustomTypedTemplate<{
      coords: Coordinates
    }>()

    const template = MyCustomTypedTemplate`The treasure can be found at ${'location:coords'}`
    it('creates a template parameter with that custom type', () => {
      template.toString({
        location: new Coordinates(1, 1),
      })
    })
    it('calls the toString() function of the custom type', () => {
      const result = template.toString({
        location: new Coordinates(123, 456),
      })
      expect(result).toBe('The treasure can be found at 123, 456')
    })
  })
})
