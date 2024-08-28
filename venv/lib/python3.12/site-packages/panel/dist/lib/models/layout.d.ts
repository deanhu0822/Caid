import { WidgetView } from "@bokehjs/models/widgets/widget";
import { Markup } from "@bokehjs/models/widgets/markup";
import { LayoutDOM, LayoutDOMView } from "@bokehjs/models/layouts/layout_dom";
import * as p from "@bokehjs/core/properties";
export declare class PanelMarkupView extends WidgetView {
    container: HTMLDivElement;
    model: Markup;
    _initialized_stylesheets: any;
    connect_signals(): void;
    lazy_initialize(): Promise<void>;
    watch_stylesheets(): void;
    style_redraw(): void;
    has_math_disabled(): boolean;
    render(): void;
}
export declare function set_size(el: HTMLElement, model: HTMLBox, adjustMargin?: boolean): void;
export declare abstract class HTMLBoxView extends LayoutDOMView {
    model: HTMLBox;
    _initialized_stylesheets: any;
    connect_signals(): void;
    render(): void;
    watch_stylesheets(): void;
    style_redraw(): void;
    get child_models(): LayoutDOM[];
}
export declare namespace HTMLBox {
    type Attrs = p.AttrsOf<Props>;
    type Props = LayoutDOM.Props;
}
export interface HTMLBox extends HTMLBox.Attrs {
}
export declare abstract class HTMLBox extends LayoutDOM {
    properties: HTMLBox.Props;
    constructor(attrs?: Partial<HTMLBox.Attrs>);
}
