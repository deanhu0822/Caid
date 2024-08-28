var _a;
import { HTMLBox, HTMLBoxView } from "./layout";
export class VideoView extends HTMLBoxView {
    initialize() {
        super.initialize();
        this._blocked = false;
        this._setting = false;
        this._time = Date.now();
    }
    connect_signals() {
        super.connect_signals();
        this.connect(this.model.properties.loop.change, () => this.set_loop());
        this.connect(this.model.properties.paused.change, () => this.set_paused());
        this.connect(this.model.properties.muted.change, () => this.set_muted());
        this.connect(this.model.properties.autoplay.change, () => this.set_autoplay());
        this.connect(this.model.properties.time.change, () => this.set_time());
        this.connect(this.model.properties.value.change, () => this.set_value());
        this.connect(this.model.properties.volume.change, () => this.set_volume());
    }
    render() {
        super.render();
        this.videoEl = document.createElement('video');
        this.containerEl = document.createElement('div');
        this.containerEl.className = "pn-video-container";
        this.containerEl.style.height = '100%';
        this.containerEl.style.width = '100%';
        this.videoEl.style.objectFit = 'fill';
        this.videoEl.style.width = '100%';
        this.videoEl.style.height = '100%';
        if (!this.model.sizing_mode || this.model.sizing_mode === 'fixed') {
            if (this.model.height)
                this.videoEl.height = this.model.height;
            if (this.model.width)
                this.videoEl.width = this.model.width;
        }
        if (this.model.max_height)
            this.videoEl.style.maxHeight = `${this.model.max_height}px`;
        if (this.model.max_width)
            this.videoEl.style.maxWidth = `${this.model.max_width}px`;
        this.videoEl.controls = true;
        this.videoEl.src = this.model.value;
        this.videoEl.currentTime = this.model.time;
        this.videoEl.loop = this.model.loop;
        this.videoEl.muted = this.model.muted;
        this.videoEl.autoplay = this.model.autoplay;
        if (this.model.volume != null)
            this.videoEl.volume = this.model.volume / 100;
        else
            this.model.volume = this.videoEl.volume * 100;
        this.videoEl.onpause = () => this.model.paused = true;
        this.videoEl.onplay = () => this.model.paused = false;
        this.videoEl.ontimeupdate = () => this.update_time(this);
        this.videoEl.onvolumechange = () => this.update_volume(this);
        this.containerEl.appendChild(this.videoEl);
        this.shadow_el.appendChild(this.containerEl);
        if (!this.model.paused)
            this.videoEl.play();
    }
    update_time(view) {
        if (view._setting) {
            view._setting = false;
            return;
        }
        if ((Date.now() - view._time) < view.model.throttle)
            return;
        view._blocked = true;
        view.model.time = view.videoEl.currentTime;
        view._time = Date.now();
    }
    update_volume(view) {
        if (view._setting) {
            view._setting = false;
            return;
        }
        view._blocked = true;
        view.model.volume = view.videoEl.volume * 100;
    }
    set_loop() {
        this.videoEl.loop = this.model.loop;
    }
    set_muted() {
        this.videoEl.muted = this.model.muted;
    }
    set_autoplay() {
        this.videoEl.autoplay = this.model.autoplay;
    }
    set_paused() {
        if (!this.videoEl.paused && this.model.paused)
            this.videoEl.pause();
        if (this.videoEl.paused && !this.model.paused)
            this.videoEl.play();
    }
    set_volume() {
        if (this._blocked) {
            this._blocked = false;
            return;
        }
        this._setting = true;
        if (this.model.volume != null)
            this.videoEl.volume = this.model.volume / 100;
    }
    set_time() {
        if (this._blocked) {
            this._blocked = false;
            return;
        }
        this._setting = true;
        this.videoEl.currentTime = this.model.time;
    }
    set_value() {
        this.videoEl.src = this.model.value;
    }
}
VideoView.__name__ = "VideoView";
export class Video extends HTMLBox {
    constructor(attrs) {
        super(attrs);
    }
}
_a = Video;
Video.__name__ = "Video";
Video.__module__ = "panel.models.widgets";
(() => {
    _a.prototype.default_view = VideoView;
    _a.define(({ Any, Boolean, Int, Number, Nullable }) => ({
        loop: [Boolean, false],
        paused: [Boolean, true],
        muted: [Boolean, false],
        autoplay: [Boolean, false],
        time: [Number, 0],
        throttle: [Int, 250],
        value: [Any, ''],
        volume: [Nullable(Int), null],
    }));
})();
//# sourceMappingURL=video.js.map