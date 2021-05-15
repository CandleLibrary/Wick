
export interface ObservableModel {
    OBSERVABLE: true,
    subscribe: (ObservableWatcher) => boolean;
    unsubscribe: (ObservableWatcher) => boolean;
    data: any;
}

export interface ObservableWatcher {
    onModelUpdate(data: ObservableModel);
}