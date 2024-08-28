var _a;
import { View } from "@bokehjs/core/view";
import { Model } from "@bokehjs/model";
export class BrowserInfoView extends View {
    initialize() {
        super.initialize();
        if (window.matchMedia != null) {
            this.model.dark_mode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        this.model.device_pixel_ratio = window.devicePixelRatio;
        if (navigator != null) {
            this.model.language = navigator.language;
            this.model.webdriver = navigator.webdriver;
        }
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (timezone != null)
            this.model.timezone = timezone;
        const timezone_offset = new Date().getTimezoneOffset();
        if (timezone_offset != null)
            this.model.timezone_offset = timezone_offset;
        this._has_finished = true;
        this.notify_finished();
    }
}
BrowserInfoView.__name__ = "BrowserInfoView";
export class BrowserInfo extends Model {
    constructor(attrs) {
        super(attrs);
    }
}
_a = BrowserInfo;
BrowserInfo.__name__ = "BrowserInfo";
BrowserInfo.__module__ = "panel.models.browser";
(() => {
    _a.prototype.default_view = BrowserInfoView;
    _a.define(({ Boolean, Nullable, Number, String }) => ({
        dark_mode: [Nullable(Boolean), null],
        device_pixel_ratio: [Nullable(Number), null],
        language: [Nullable(String), null],
        timezone: [Nullable(String), null],
        timezone_offset: [Nullable(Number), null],
        webdriver: [Nullable(Boolean), null]
    }));
})();
//# sourceMappingURL=browser.js.map