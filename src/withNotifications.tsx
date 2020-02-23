import React, { ComponentType, ReactElement } from "react"

import {
  NotificationsContext,
  NotificationsContextProps,
} from "./NotificationsContext"

export function withNotifications<P>(
  Component: ComponentType<Partial<P>>
): ComponentType<Partial<P>> {
  return (props: any): ReactElement => (
    <NotificationsContext.Consumer>
      {({
        NotificationMessage,
        addNotification,
      }: NotificationsContextProps): ReactElement => (
        <Component
          {...props}
          NotificationMessage={NotificationMessage}
          addNotification={addNotification}
        />
      )}
    </NotificationsContext.Consumer>
  )
}
