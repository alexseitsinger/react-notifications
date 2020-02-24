import React from "react"

import {
  CreateNotificationMessageArguments,
  NotificationMessageProps,
} from "./NotificationsProvider"

export interface NotificationsContextProps {
  NotificationMessage: (args: NotificationMessageProps) => null;
  createNotificationMessage: (args: CreateNotificationMessageArguments) => void;
  clearCachedNotifications: () => void;
  clearNotifications: () => void;
}

const defaultContext = {}

export const NotificationsContext = React.createContext(defaultContext)
