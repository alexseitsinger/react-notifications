# Notifications

Render notification message at the top level of your DOM, from anywhere in your app.

## Installation

```bash
yarn add @alexseitsinger/react-notifications
```

## Exports

#### NotificationsProvider

Add a DOM element at the root of your app (at the bottom). Each notification rendered will be placed within this container.

###### Props

Name               | Description                                                        | Default   | Required?
---                | ---                                                                | ---       | ---
displayInterval    | The time(ms) to show each notification before removing the oldest. | undefined | yes
renderNotification | Invoked to render the output for each notification.                | undefined | yes

###### Example

```javascript
// In app root
import { NotificationsProvider } from "@alexseitsinger/react-notifications"

// Re-use a render method for each notification.
const renderNotification = (message) => (
  <div>{message}</div>
)

// Add the provider to the app root. It will add a mount point into the DOM for the notifications to render within.
const App = () => (
  <NotificationsProvider renderNotification={renderNotification}>
    <Router>
      <Route path={"/"} exact component={HomePage} />
    </Router>
  </NotificationsProvider>
)
```

#### withNotifications (using <NotificationMessage />)

Component used to render a new notification.

###### Props

Name             | Description                                | Deafault  | Required?
---              | ---                                        | ---       | ---
notificationName | The unique name of the notification.       | undefined | yes
children         | The content to render as the notification. | undefined | yes

###### Example

```javascript
import { withNotifications } from "@alexseitsinger/react-notifications"

const HomePage = withNotifications(({ NotificationMessage }) => (
  <div id="homePage">
    <div> Some normal content</div>
    <NotificationMessage notificationName={"home-page-render-notification"}>
      This notification gets displayed once.
    </NotificationMessage>
  </div>
))
```

#### withNotifications (using addNotification())

Function used to render a new notification.

###### Props

Name             | Description                                                    | Default   | Required?
---              | ---                                                            | ---       | ---
notificationName | The unique name of the notification.                           | undefined | yes
text             | The text to render as the notification.                        | undefined | yes
isForced         | Should the notification be shown if it already was previously? | undefined | no

###### Example

```javascript
// In a page component, etc.
import { withNotifications } from "@alexseitsinger/react-notifications"

const HomePage = () => withNotifications(
  ({ addNotification, ...restProps }) => {
    return (
      <PageContainer>
        <div>Some normal page content</div>
        <button onClick={() => {
          addNotification({
            notificationName: "on-click-success-notification-1",
            text: "You did it!",
            isForced: true,
          })
        }}>
          Click to do action
        </button>
      </PageContainer>
    )
  }
)
```
