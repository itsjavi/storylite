type ClassCondition = boolean | undefined | null
type ClassArg = string | undefined | null
type ClassArrArg = ClassArg | [ClassCondition, ClassArg, ClassArg?]

function classNames(...args: ClassArrArg[]): string {
  return args
    .map(arg => {
      if (Array.isArray(arg)) {
        return arg[0] ? arg[1] : arg.length > 2 ? classNames(arg[2]) : undefined
      }

      return arg
    })
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export { classNames }
