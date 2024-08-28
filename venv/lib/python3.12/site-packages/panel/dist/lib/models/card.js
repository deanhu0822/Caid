var _a;
import { Column, ColumnView } from "./column";
import * as DOM from "@bokehjs/core/dom";
export class CardView extends ColumnView {
    constructor() {
        super(...arguments);
        this.collapsed_style = new DOM.InlineStyleSheet();
    }
    connect_signals() {
        super.connect_signals();
        const { active_header_background, collapsed, header_background, header_color, hide_header } = this.model.properties;
        this.on_change(collapsed, () => this._collapse());
        this.on_change([header_color, hide_header], () => this.render());
        this.on_change([active_header_background, collapsed, header_background], () => {
            const header_background = this.header_background;
            if (header_background == null)
                return;
            this.child_views[0].el.style.backgroundColor = header_background;
            this.header_el.style.backgroundColor = header_background;
        });
    }
    *_stylesheets() {
        yield* super._stylesheets();
        yield this.collapsed_style;
    }
    get header_background() {
        let header_background = this.model.header_background;
        if (!this.model.collapsed && this.model.active_header_background)
            header_background = this.model.active_header_background;
        return header_background;
    }
    render() {
        this.empty();
        if (this.model.collapsed)
            this.collapsed_style.replace(":host", {
                "height": "fit-content",
                "flex": "none"
            });
        this._update_stylesheets();
        this._update_css_classes();
        this._apply_styles();
        this._apply_visible();
        this.class_list.add(...this.css_classes());
        const { button_css_classes, header_color, header_tag, header_css_classes } = this.model;
        const header_background = this.header_background;
        const header = this.child_views[0];
        let header_el;
        if (this.model.collapsible) {
            this.button_el = DOM.createElement("button", { type: "button", class: header_css_classes });
            const icon = DOM.createElement("div", { class: button_css_classes });
            icon.innerHTML = this.model.collapsed ? "\u25ba" : "\u25bc";
            this.button_el.appendChild(icon);
            this.button_el.style.backgroundColor = header_background != null ? header_background : "";
            header.el.style.backgroundColor = header_background != null ? header_background : "";
            this.button_el.appendChild(header.el);
            this.button_el.onclick = () => this._toggle_button();
            header_el = this.button_el;
        }
        else {
            header_el = DOM.createElement(header_tag, { class: header_css_classes });
            header_el.style.backgroundColor = header_background != null ? header_background : "";
            header_el.appendChild(header.el);
        }
        this.header_el = header_el;
        if (!this.model.hide_header) {
            header_el.style.color = header_color != null ? header_color : "";
            this.shadow_el.appendChild(header_el);
            header.render();
            header.after_render();
        }
        if (this.model.collapsed)
            return;
        for (const child_view of this.child_views.slice(1)) {
            this.shadow_el.appendChild(child_view.el);
            child_view.render();
            child_view.after_render();
        }
    }
    async update_children() {
        await this.build_child_views();
        this.render();
        this.invalidate_layout();
    }
    _toggle_button() {
        this.model.collapsed = !this.model.collapsed;
    }
    _collapse() {
        for (const child_view of this.child_views.slice(1)) {
            if (this.model.collapsed) {
                this.shadow_el.removeChild(child_view.el);
                child_view.model.visible = false;
            }
            else {
                child_view.render();
                child_view.after_render();
                this.shadow_el.appendChild(child_view.el);
                child_view.model.visible = true;
            }
        }
        if (this.model.collapsed) {
            this.collapsed_style.replace(":host", {
                "height": "fit-content",
                'flex': "none"
            });
        }
        else
            this.collapsed_style.clear();
        this.button_el.children[0].innerHTML = this.model.collapsed ? "\u25ba" : "\u25bc";
        this.invalidate_layout();
    }
    _createElement() {
        return DOM.createElement(this.model.tag, { class: this.css_classes() });
    }
}
CardView.__name__ = "CardView";
export class Card extends Column {
    constructor(attrs) {
        super(attrs);
    }
}
_a = Card;
Card.__name__ = "Card";
Card.__module__ = "panel.models.layout";
(() => {
    _a.prototype.default_view = CardView;
    _a.define(({ Array, Boolean, Nullable, String }) => ({
        active_header_background: [Nullable(String), null],
        button_css_classes: [Array(String), []],
        collapsed: [Boolean, true],
        collapsible: [Boolean, true],
        header_background: [Nullable(String), null],
        header_color: [Nullable(String), null],
        header_css_classes: [Array(String), []],
        header_tag: [String, "div"],
        hide_header: [Boolean, false],
        tag: [String, "div"],
    }));
})();
//# sourceMappingURL=card.js.map