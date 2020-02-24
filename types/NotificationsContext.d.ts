import React from "react";
import { CreateNotificationMessageArguments, NotificationMessageProps } from "./NotificationsProvider";
export interface NotificationsContextProps {
    NotificationMessage: (args: NotificationMessageProps) => null;
    createNotificationMessage: (args: CreateNotificationMessageArguments) => void;
    clearCachedNotifications: () => void;
    clearNotifications: () => void;
}
export declare const NotificationsContext: React.Context<{}>;
