import { QwikDOMAttributes } from "@builder.io/qwik"

export interface IconProps extends QwikDOMAttributes {
  size?: number,
  color?: string,
  strokeWidth?: number,
  strokeLinecap?: string,
  strokeLinejoin?: string
}

export interface BaseIconProps extends IconProps {
  name: string
}
