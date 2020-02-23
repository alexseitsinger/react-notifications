/** @jsx jsx */
import { ReactElement } from "react"
import { jsx } from "@emotion/core"
import { mount } from "enzyme"
import { matchers } from "jest-emotion"
//import waitForExpect from "wait-for-expect"

expect.extend(matchers)

import { NotificationsProvider, withNotifications } from "src"
import { NotificationsContextProps } from "src/NotificationsContext"
//import { NotificationsContainer } from "src/elements"

const renderNotification = (text: string): ReactElement => (
  <div className={"notification"}>{text}</div>
)

describe("NotificationsProvider", () => {
  it("should render a container at the bottom (bottom: 0) the dom", () => {
    const wrapper = mount(
      <div id={"app"}>
        <NotificationsProvider
          displayInterval={3000}
          renderNotification={renderNotification}>
          <div id={"page"}>Page</div>
        </NotificationsProvider>
      </div>
    )

    expect(wrapper.find("div.Notifications")).toHaveLength(1)
    expect(wrapper.find("div.Notifications")).toHaveStyleRule("bottom", "0")
  })

  it("should continue to move to the bottom of the dom after scrolls", () => {
    const handleScroll = jest.fn()

    const wrapper = mount(
      <div id={"app"}>
        <NotificationsProvider
          displayInterval={3000}
          renderNotification={renderNotification}
          onScroll={handleScroll}>
          <div id={"page"}>Page</div>
        </NotificationsProvider>
      </div>
    )

    document.documentElement.scrollTop = 100
    document.dispatchEvent(new Event("scroll"))
    wrapper.update()

    expect(handleScroll).toHaveBeenCalledWith({
      bottom: "-100px",
    })
    expect(wrapper.find("div.Notifications")).toHaveStyleRule(
      "bottom",
      "-100px"
    )

    document.documentElement.scrollTop = 0
    document.dispatchEvent(new Event("scroll"))
    wrapper.update()

    expect(handleScroll).toHaveBeenCalledWith({
      bottom: 0,
    })
    expect(wrapper.find("div.Notifications")).toHaveStyleRule("bottom", "0")
  })

  it("should render notifications using <NotificationMessage />, then remove it", () => {
    const PageWithNotifications = withNotifications(
      ({ NotificationMessage }: NotificationsContextProps): ReactElement => (
        <div id={"page"}>
          <h1>Page</h1>
          <NotificationMessage notificationName={"three"}>
            This is a notification
          </NotificationMessage>
        </div>
      )
    )

    const wrapper = mount(
      <div id={"app"}>
        <NotificationsProvider
          displayInterval={3000}
          renderNotification={renderNotification}>
          <PageWithNotifications />
        </NotificationsProvider>
      </div>
    )

    expect(wrapper.find("div.notification")).toHaveLength(1)

    setTimeout(() => {
      expect(wrapper.find(".div.notification")).toHaveLength(0)
    }, 3000)
  })
})
