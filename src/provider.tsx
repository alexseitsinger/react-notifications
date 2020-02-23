import React, { ReactElement, ReactNode } from "react"
import { CSSObject } from "@emotion/core"
import { throttle } from "underscore"

import { Context, ContextProps } from "./context"
import { NotificationsContainer } from "./elements"
import { addRendered, clearRendered, hasRendered } from "./rendered"

const hasWindow = typeof window !== "undefined"

interface Props {
  children: ReactNode | ReactNode[];
  renderNotification: (text: string) => ReactElement;
}

interface State {
  notifications: string[];
  style: CSSObject;
}

export interface NotificationArguments {
  text: string;
  isForced: boolean;
}

export class NotificationsProvider extends React.Component<Props, State> {
  state: State = {
    notifications: [],
    style: { bottom: 0 },
  }

  /**
   * After a delay, remove the first (oldest) notification from the DOM.
   *
   * TODO: Add datestamps to each notification as they're added sow e can easily
   * sort and manage them in order easily.
   */
  removeFirstNotification = throttle((): void => {
    if (this.state.notifications.length === 0) {
      return
    }

    setTimeout(() => {
      this.setState((prevState: State): State => {
        const { notifications } = prevState
        notifications.shift()

        return {
          style: this.getStyle(),
          notifications,
        }
      })
    }, 6000)
  }, 6000)

  componentDidMount(): void {
    if (hasWindow) {
      window.addEventListener("scroll", this.handleScroll)
    }
  }

  componentDidUpdate(): void {
    this.removeFirstNotification()
  }

  componentWillUnmount(): void {
    if (hasWindow) {
      window.removeEventListener("scroll", this.handleScroll)
    }
  }

  getStyle = (): CSSObject => {
    if (hasWindow) {
      const yOffset = Math.abs(window.pageYOffset)
      return {
        bottom: `-${yOffset}px`,
      }
    }
    return { bottom: 0 }
  }

  handleScroll = (): void => {
    if (hasWindow) {
      this.setState({
        style: this.getStyle(),
      })
    }
  }

  /**
   * Adds a new unique notification to be rendered next.
   */
  addNotification = ({ text, isForced }: NotificationArguments): void => {
    if (hasRendered(text) && !isForced) {
      return
    }

    this.setState((prevState: State): State => {
      addRendered(text)
      return {
        style: this.getStyle(),
        notifications: [...prevState.notifications, text],
      }
    })
  }

  /**
   * Clears the cached names so the same notifictions can be rendered again.
   */
  clearNotificationsCache = (): void => {
    clearRendered()
  }

  /**
   * Immediately remove all currently rendered notifications.
   */
  removeAllNotifications = (): void => {
    this.setState({ notifications: [] })
  }

  render(): ReactElement {
    const { addNotification } = this
    const { notifications, style } = this.state
    const { children, renderNotification } = this.props
    const NotificationMessage = ({
      text,
      isForced,
    }: NotificationArguments): ReactElement => {
      addNotification({ text, isForced })
      return null
    }
    const value: ContextProps = {
      NotificationMessage,
      addNotification,
    }

    const renderedNotifications = notifications
      .reverse()
      .map((text: string): ReactElement => renderNotification(text))

    return (
      <Context.Provider value={value}>
        {children}
        <NotificationsContainer css={style}>
          {renderedNotifications}
        </NotificationsContainer>
      </Context.Provider>
    )
  }
}
