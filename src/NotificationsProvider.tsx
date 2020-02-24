/** @jsx jsx */
import React, { PureComponent, ReactElement, ReactNode } from "react"
import { CSSObject, jsx } from "@emotion/core"
import { throttle, uniqueId } from "underscore"

import { NotificationsContainer } from "./elements"
import {
  NotificationsContext,
  NotificationsContextProps,
} from "./NotificationsContext"
import { addRendered, clearRendered, hasRendered } from "./rendered"
import { getYPosition, hasDOM } from "./utils"

interface NotificationProps {
  notificationName: string;
  isForced?: boolean;
  isRepeated?: boolean;
  displayInterval?: number;
}

export type NotificationMessageProps = NotificationProps & {
  children: ReactNode | ReactNode[],
}

export type CreateNotificationMessageArguments = NotificationProps & {
  onRender: () => ReactNode,
}

type PreparedNotification = CreateNotificationMessageArguments & {
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

export class NotificationsProvider extends PureComponent<Props, State> {
  static defaultProps: DefaultProps = defaultProps

  state: State = {
    notifications: [],
    style: { bottom: 0 },
  }

  /**
   * After a delay, remove the first (oldest) notification from the DOM.
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
  createNotificationMessage = ({
    notificationName,
    isForced = false,
    isRepeated = false,
    onRender,
  }: CreateNotificationMessageArguments): void => {
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
      onRender,
      isForced,
      isRepeated,
      createdOn: new Date(Date.now()),
    }
    const { notifications } = this.state
    const isRepeating = notifications
      .map((o: PreparedNotification): boolean => {
        return o.notificationName === prepared.notificationName
      })
      .includes(true)

    // Prevent duplicate messages from being displayed at the same time.
    if (isRepeating && !isRepeated) {
      return
    }

    this.setState({
      style: this.getStyle(),
      notifications: [...notifications, prepared],
    })
  }

  /**
   * Clears the cached names so the same notifictions can be rendered again.
   */
  clearCachedNotifications = (): void => {
    clearRendered()
  }

  /**
   * Immediately remove all currently rendered notifications.
   */
  clearNotifications = (): void => {
    this.setState({ notifications: [] })
  }

  renderNotifications = (): ReactNode[] => {
    const { renderNotification } = this.props
    const { notifications } = this.state

    return notifications
      .reverse()
      .map(({ onRender }: PreparedNotification): ReactNode => {
        const key = `Notification-${uniqueId()}`
        const rendered = renderNotification(onRender())
        return (
          <div key={key} className={"Notification"}>
            {rendered}
          </div>
        )
      })
  }

  render(): ReactElement {
    const {
      createNotificationMessage,
      clearNotifications,
      clearCachedNotifications,
    } = this
    const { style } = this.state
    const { children, containerClassName } = this.props

    const NotificationMessage = ({
      children: theseChildren,
      ...restProps
    }: NotificationMessageProps): null => {
      createNotificationMessage({
        ...restProps,
        onRender: (): ReactNode => theseChildren,
        isForced: false,
      })
      return null
    }

    const value: NotificationsContextProps = {
      NotificationMessage,
      createNotificationMessage,
      clearCachedNotifications,
      clearNotifications,
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
