import React from "react"

export default function useInputDebounce(input: string, delay: number = 500) {
  const [value, setValue] = React.useState<string>(input)

  React.useEffect(() => {
    const handler = setTimeout(() => setValue(input), delay)

    return () => clearTimeout(handler)
  }, [input, delay])

  return [value, setValue]
}
