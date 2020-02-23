/** @jsx jsx */
import React, { ReactElement, ReactNode } from "react"
import { CSSObject, jsx } from "@emotion/core"
import { throttle, uniqueId } from "underscore"

import { NotificationsContainer } from "./elements"
import {
  NotificationsContext,
  NotificationsContextProps,
} from "./NotificationsContext"
import { addRendered, clearRendered, hasRendered } from "./rendered"
import { getYPosition, hasDOM } from "./utils"

export interface NotificationMessageProps {
  notificationName: string;
  children: ReactNode;
}

export interface AddNotificationArguments {
  notificationName: string;
  isForced: boolean;
  content: ReactNode | string;
}

type PreparedNotification = AddNotificationArguments & {
  createdOn: Date,
}

const defaultProps = {
  containerClassName: "Notifications",
}

type DefaultProps = Readonly<typeof defaultProps>

type Props = {
  children: ReactNode | ReactNode[],
  renderNotification: (content: ReactNode) => ReactElement,
  displayInterval: number,
  onScroll?: (style: CSSObject) => void,
} & Partial<DefaultProps>

interface State {
  notifications: PreparedNotification[];
  style: CSSObject;
}

export class NotificationsProvider extends React.Component<Props, State> {
  static defaultProps: DefaultProps = defaultProps

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
  removeOldestNotification: () => void

  constructor(props: Props) {
    super(props)

    const { displayInterval } = props

    this.removeOldestNotification = throttle((): void => {
      const { notifications: currentNotifications } = this.state
      if (currentNotifications.length === 0) {
        return
      }

      setTimeout(() => {
        this.setState((prevState: State): State => {
          const { notifications } = prevState
          const sorted = notifications.sort((a, b): number => {
            const aDate = a.createdOn
            const bDate = b.createdOn
            if (aDate > bDate) {
              return 1
            }
            if (aDate < bDate) {
              return -1
            }
            return 0
          })

          sorted.shift()

          return {
            style: this.getStyle(),
            notifications: sorted,
          }
        })
      }, displayInterval)
    }, displayInterval)
  }

  componentDidMount(): void {
    if (hasDOM) {
      document.addEventListener("scroll", this.handleScroll)
    }
  }

  componentDidUpdate(): void {
    this.removeOldestNotification()
  }

  componentWillUnmount(): void {
    if (hasDOM) {
      document.removeEventListener("scroll", this.handleScroll)
    }
  }

  getStyle = (): CSSObject => {
    const yPos = getYPosition()
    if (yPos === 0) {
      return { bottom: 0 }
    }
    return { bottom: `-${yPos}px` }
  }

  handleScroll = (): void => {
    const style = this.getStyle()

    const { onScroll } = this.props
    if (onScroll !== undefined) {
      onScroll(style)
    }

    this.setState({ style })
  }

  /**
   * Adds a new unique notification to be rendered next.
   */
  addNotification = ({
    notificationName,
    content,
    isForced,
  }: AddNotificationArguments): void => {
    /**
     * If its's already been renders, and it's not being forced, then dont add
     * it again.
     */
    if (hasRendered(notificationName) && !isForced) {
      return
    }

    // Add our text to the cache to prevent duplicates.
    addRendered(notificationName)

    /**
     * Update the state to reflect the new notification.
     */
    const prepared: PreparedNotification = {
      notificationName,
      content,
      isForced,
      createdOn: new Date(Date.now()),
    }
    this.setState((prevState: State): State => ({
      style: this.getStyle(),
      notifications: [...prevState.notifications, prepared],
    }))
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

  renderNotifications = (): ReactElement[] => {
    const { renderNotification } = this.props
    const { notifications } = this.state

    return notifications
      .reverse()
      .map(({ content }: PreparedNotification): ReactElement => {
        const key = `renderedNotification-${uniqueId()}`
        const renderedNotification = renderNotification(content)
        return <div key={key}>{renderedNotification}</div>
      })
  }

  render(): ReactElement {
    const { addNotification } = this
    const { style } = this.state
    const { children, containerClassName } = this.props

    const NotificationMessage = ({
      children: notificationChildren,
      ...restProps
    }: NotificationMessageProps): ReactElement => {
      addNotification({
        ...restProps,
        content: notificationChildren,
        isForced: false,
      })
      return <span>{null}</span>
    }

    const value: NotificationsContextProps = {
      NotificationMessage,
      addNotification,
    }

    return (
      <NotificationsContext.Provider value={value}>
        {children}
        <NotificationsContainer css={style} className={containerClassName}>
          {this.renderNotifications()}
        </NotificationsContainer>
      </NotificationsContext.Provider>
    )
  }
}
