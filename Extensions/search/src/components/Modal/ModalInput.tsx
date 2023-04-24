import React from "react"

type ModalInputProps = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  value?: string
  className?: string
}

export default function ModalInput(props: ModalInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const { onChange, ...delegated } = props

  React.useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <input
      type="text"
      ref={inputRef}
      placeholder="Search for product..."
      onChange={onChange}
      {...delegated}
    />
  )
}
