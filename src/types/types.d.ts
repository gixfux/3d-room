declare interface TerminalContext {
  isShow: boolean
  isActive: boolean
  top: number
  left: number
  bottom: number
  right: number
  windowBox: HTMLDivElement | null
  windowName: string
  minWidth: number
  minHeight: number
  zIndex: number
}

declare interface BrowserContext {
  isShow: boolean
  isActive: boolean
  top: number
  left: number
  bottom: number
  right: number
  windowBox: HTMLDivElement | null
  windowName: string
  minWidth: number
  minHeight: number
  zIndex: number
}

declare interface BlobContext {
  isShow: boolean
  isActive: boolean
  top: number
  left: number
  bottom: number
  right: number
  windowBox: HTMLDivElement | null
  windowName: string
  minWidth: number
  minHeight: number
  zIndex: number
}

declare interface WindowInfo {
  isShow: boolean
  isActive: boolean
  top: number
  left: number
  bottom: number
  right: number
  windowBox: HTMLDivElement | null
  windowName: string
}

declare interface SvgContext {
  logos: {
    [name: string]: string
  }
}

declare interface TerminalBoxContext {
  terminal?: HTMLDivElement
  historyInfoBox?: HTMLDivElement
  currentInfoBox?: HTMLDivElement,
  commendEnterSpan?: {
    element?: HTMLSpanElement,
    onclickFun?: Function
  }
}