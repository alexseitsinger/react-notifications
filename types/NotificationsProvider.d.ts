import React, { PureComponent, ReactElement, ReactNode } from "react";
import { CSSObject } from "@emotion/core";
export interface NotificationMessageProps {
    notificationName: string;
    children: ReactNode | ReactNode[];
}
export interface CreateNotificationMessageArguments {
    notificationName: string;
    isForced: boolean;
    content: ReactNode;
}
declare type PreparedNotification = CreateNotificationMessageArguments & {
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
export declare class NotificationsProvider extends PureComponent<Props, State> {
    static defaultProps: DefaultProps;
    state: State;
    removeOldestNotification: () => void;
    constructor(props: Props);
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    getStyle: () => CSSObject;
    handleScroll: () => void;
    createNotificationMessage: ({ notificationName, content, isForced, }: CreateNotificationMessageArguments) => void;
    clearCachedNotifications: () => void;
    clearNotifications: () => void;
    renderNotifications: () => React.ReactNode[];
    render(): ReactElement;
}
export {};
