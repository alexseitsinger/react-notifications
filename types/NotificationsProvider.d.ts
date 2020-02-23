import React, { ReactElement, ReactNode } from "react";
import { CSSObject } from "@emotion/core";
export interface NotificationMessageProps {
    notificationName: string;
    children: ReactNode;
}
export interface AddNotificationArguments {
    notificationName: string;
    isForced: boolean;
    content: ReactNode | string;
}
declare type PreparedNotification = AddNotificationArguments & {
    createdOn: Date;
};
declare const defaultProps: {
    containerClassName: string;
};
declare type DefaultProps = Readonly<typeof defaultProps>;
declare type Props = {
    children: ReactNode | ReactNode[];
    renderNotification: (content: ReactNode) => ReactElement;
    displayInterval: number;
    onScroll?: (style: CSSObject) => void;
} & Partial<DefaultProps>;
interface State {
    notifications: PreparedNotification[];
    style: CSSObject;
}
export declare class NotificationsProvider extends React.Component<Props, State> {
    static defaultProps: DefaultProps;
    state: State;
    removeOldestNotification: () => void;
    constructor(props: Props);
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    getStyle: () => CSSObject;
    handleScroll: () => void;
    addNotification: ({ notificationName, content, isForced, }: AddNotificationArguments) => void;
    clearNotificationsCache: () => void;
    removeAllNotifications: () => void;
    renderNotifications: () => React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)>[];
    render(): ReactElement;
}
export {};
