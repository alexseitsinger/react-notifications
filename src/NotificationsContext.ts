import React, { ReactElement } from "react"

import {
  AddNotificationArguments,
  NotificationMessageProps,
} from "./NotificationsProvider"

export interface NotificationsContextProps {
  NotificationMessage: (args: NotificationMessageProps) => ReactElement;
  addNotification: (args: AddNotificationArguments) => void;
}

const defaultContext = {}

export const NotificationsContext = React.createContext(defaultContext)
