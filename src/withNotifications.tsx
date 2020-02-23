import React, { ElementType, ReactElement } from "react"

import { Context, ContextProps } from "./context"

export function withNotifications(Component: ElementType): ElementType {
  return (props: any): ReactElement => {
    return (
      <Context.Consumer>
        {({
          NotificationMessage,
          addNotification,
        }: ContextProps): ReactElement => (
          <Component
            {...props}
            NotificationMessage={NotificationMessage}
            addNotification={addNotification}
          />
        )}
      </Context.Consumer>
    )
  }
}
