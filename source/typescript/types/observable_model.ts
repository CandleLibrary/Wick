
export interface ObservableModel {
    OBSERVABLE: true,
    subscribe: (ObservableWatcher) => boolean;
    unsubscribe: (ObservableWatcher) => boolean;
}

export interface ObservableWatcher {
    onModelUpdate(data: ObservableModel);
}