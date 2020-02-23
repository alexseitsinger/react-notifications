import React, { ReactElement } from "react";
import { AddNotificationArguments, NotificationMessageProps } from "./NotificationsProvider";
export interface NotificationsContextProps {
    NotificationMessage: (args: NotificationMessageProps) => ReactElement;
    addNotification: (args: AddNotificationArguments) => void;
}
export declare const NotificationsContext: React.Context<{}>;
