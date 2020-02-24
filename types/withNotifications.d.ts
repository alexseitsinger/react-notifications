import { ComponentType } from "react";
import { NotificationsContextProps as ContextProps } from "./NotificationsContext";
declare type Partialize<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>> & Partial<Pick<T, K>>;
declare type WithoutContextProps<P extends ContextProps> = Partialize<P, keyof ContextProps>;
export declare function withNotifications<P extends ContextProps>(Component: ComponentType<WithoutContextProps<P>>): ComponentType<WithoutContextProps<P>>;
export {};
