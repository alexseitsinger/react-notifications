import React, { ElementType } from "react"

import { NotificationArguments } from "./provider"

export interface ContextProps {
  NotificationMessage: ElementType;
  addNotification: ({
    text,
    isForced
  }: NotificationArguments) => void;
}

const defaultContext: ContextProps = {
  NotificationMessage: null,
  addNotification: () => {
    console.log("addNotification() not implemented.")
  },
}

export const Context = React.createContext(defaultContext)
