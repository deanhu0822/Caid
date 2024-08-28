import * as p from "@bokehjs/core/properties";
import { HTMLBox, HTMLBoxView } from "./layout";
export declare class VideoView extends HTMLBoxView {
    model: Video;
    protected videoEl: HTMLVideoElement;
    protected containerEl: HTMLElement;
    protected dialogEl: HTMLElement;
    private _blocked;
    private _time;
    private _setting;
    initialize(): void;
    connect_signals(): void;
    render(): void;
    update_time(view: VideoView): void;
    update_volume(view: VideoView): void;
    set_loop(): void;
    set_muted(): void;
    set_autoplay(): void;
    set_paused(): void;
    set_volume(): void;
    set_time(): void;
    set_value(): void;
}
export declare namespace Video {
    type Attrs = p.AttrsOf<Props>;
    type Props = HTMLBox.Props & {
        loop: p.Property<boolean>;
        paused: p.Property<boolean>;
        muted: p.Property<boolean>;
        autoplay: p.Property<boolean>;
        time: p.Property<number>;
        throttle: p.Property<number>;
        value: p.Property<any>;
        volume: p.Property<number | null>;
    };
}
export interface Video extends Video.Attrs {
}
export declare class Video extends HTMLBox {
    properties: Video.Props;
    constructor(attrs?: Partial<Video.Attrs>);
    static __module__: string;
}
