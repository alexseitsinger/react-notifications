import React, { ComponentType, ReactElement } from "react"

import {
  NotificationsContext as Context,
  NotificationsContextProps as ContextProps,
} from "./NotificationsContext"

type Partialize<T, K extends keyof T> =
  Pick<T, Exclude<keyof T, K>> &
  Partial<Pick<T, K>>

type WithoutContextProps<P extends ContextProps> =
  Partialize<P, keyof ContextProps>

export function withNotifications<P extends ContextProps>(
  Component: ComponentType<WithoutContextProps<P>>
): ComponentType<WithoutContextProps<P>> {
  return (props: WithoutContextProps<P>): ReactElement => (
    <Context.Consumer>
      {({
        NotificationMessage,
        createNotificationMessage,
        clearCachedNotifications,
        clearNotifications,
      }: ContextProps): ReactElement => (
        <Component
          {...props}
          NotificationMessage={NotificationMessage}
          createNotificationMessage={createNotificationMessage}
          clearCachedNotifications={clearCachedNotifications}
          clearNotifications={clearNotifications}
        />
      )}
    </Context.Consumer>
  )
}
