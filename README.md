# Notifications

Render notification message at the top level of your DOM, from anywhere in your app.

## Installation

```bash
yarn add @alexseitsinger/react-notifications
```

## Exports

#### NotificationsProvider

Add a DOM element at the root of your app (at the bottom). Each notification rendered will be placed within this container.
for each provided notification to be rendered within.

###### Props

Name               | Description                                                        | Default   | Required?
---                | ---                                                                | ---       | ---
displayInterval    | The time(ms) to show each notification before removing the oldest. | undefined | yes
renderNotification | Invoked to render each notification.                               | undefined | yes

###### Example

```javascript
// In app root
import { NotificationsProvider } from "@alexseitsinger/react-notifications"

// Re-use a render method for each notification.
// Use this to render each notification with the same template.
const renderNotification = (element) => (
  <div>{element}</div>
)

// Add the provider to the app root. It will add a mount point into the DOM for the notifications to render within.
const App = () => (
  <NotificationsProvider renderNotification={renderNotification} displayInterval={3000}>
    <Router>
      <Route path={"/"} exact component={HomePage} />
    </Router>
  </NotificationsProvider>
)
```

#### withNotifications

HOC that provides **notifications props** to a component.

###### Notification Props Provided:

Name                      | Description
---                       | ---
NotificationMessage       | Component used to render notification messages.
createNotificationMessage | Function to create notification messages. (Useful for button callback, etc.)
clearCachedNotifications  | Clears the cached notification names. (Setting `isForced` to `true` ignores this cache)
clearNotifications        | Removes all the currently renderd notifications.

#### NotificationMessage (via withNotifications)

Component used to create new notification messages. NOTE: `isForced` is automatically set to `false` for this to prevent render loops.

###### Props

Name             | Description                               | Deafault  | Required?
---              | ---                                       | ---       | ---
notificationName | The unique name of the notification.      | undefined | yes
isRepeated       | Show multiple copies of the same message  | false     | no
children         | The content to render as the notification | undefined | yes

###### Example

```javascript
import { withNotifications } from "@alexseitsinger/react-notifications"

const HomePage = withNotifications(({ NotificationMessage }) => (
  <div id="homePage">
    <div> Some normal content</div>
    <NotificationMessage notificationName={"home-page-render-notification"} isRepeated={false}>
      This notification gets displayed once.
    </NotificationMessage>
  </div>
))
```

#### createNotificationMessage (via withNotifications)

Function used to create a new notification message.

###### Props

Name             | Description                                                    | Default   | Required?
---              | ---                                                            | ---       | ---
notificationName | The unique name of the notification.                           | undefined | yes
isForced         | Should the notification be shown if it already was previously? | false     | no
isRepeated       | Show multiple copies of the same message                       | false     | no
onRender         | Invoked to render the notification message                     | undefined | yes

###### Example

```javascript
// In a page component, etc.
import { withNotifications } from "@alexseitsinger/react-notifications"

const HomePage = () => withNotifications(
  ({ createNotificationMessage, ...restProps }) => {
    return (
      <PageContainer>
        <div>Some normal page content</div>
        <button onClick={() => {
          createNotificationMessage({
            notificationName: "on-click-success-notification-1",
            onRender: () => <div>You did it!</div>,
            isForced: true,
            isRepeated: false,
          })
        }}>
          Click to do action
        </button>
      </PageContainer>
    )
  }
)
```
