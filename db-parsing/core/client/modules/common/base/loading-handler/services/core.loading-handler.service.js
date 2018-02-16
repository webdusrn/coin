export default function LoadingHandlerService(metaManager) {
    "ngInject";

    this.vm = null;
    this.listenCallback = undefined;
    var progressName = 'progress';

    this.init = function (vm) {
        if (!this.vm) {
            this.vm = vm;
            this.vm.LOADING = metaManager.std.loading;

            this.vm.coreLoading = {};
            this.vm.coreLoading[this.vm.LOADING.spinnerKey] = undefined;
        }
    };

    this.listen = function (listenCallback) {
        this.listenCallback = listenCallback;
    };

    this.startLoading = function (loadingKey, key) {
        if (this.vm.coreLoading[loadingKey] === undefined) {
            this.vm.coreLoading[loadingKey] = {};
        }
        this.vm.coreLoading[loadingKey][key] = true;
    };

    this.endLoading = function (loadingKey, key) {
        if (this.vm.coreLoading[loadingKey] !== undefined) {
            delete this.vm.coreLoading[loadingKey][key];
        }
        var isLoadingEmpty = true;
        for (var k in this.vm.coreLoading[loadingKey]) {
            isLoadingEmpty = false;
        }
        if (isLoadingEmpty) {
            this.vm.coreLoading[loadingKey] = undefined;
        }
    };

    this.setProgress = function (progress, title) {
        if (this.vm.coreLoading[progressName] === undefined) {
            this.vm.coreLoading[progressName] = {};
        }

        if (title !== undefined) {
            this.vm.coreLoading[progressName].ttile = title;
        }

        this.vm.coreLoading[progressName].progress = progress;

        if (this.listenCallback) {
            this.listenCallback(progress, title);
        }

    };

    this.endProgress = function () {
        this.vm.coreLoading[progressName] = undefined;
    };
}