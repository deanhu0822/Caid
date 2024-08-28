var _a;
import { Column as BkColumn, ColumnView as BkColumnView } from "@bokehjs/models/layouts/column";
import * as DOM from "@bokehjs/core/dom";
export class ColumnView extends BkColumnView {
    connect_signals() {
        super.connect_signals();
        const { children, scroll_position, scroll_button_threshold } = this.model.properties;
        this.on_change(children, () => this.trigger_auto_scroll());
        this.on_change(scroll_position, () => this.scroll_to_position());
        this.on_change(scroll_button_threshold, () => this.toggle_scroll_button());
    }
    get distance_from_latest() {
        return this.el.scrollHeight - this.el.scrollTop - this.el.clientHeight;
    }
    scroll_to_position() {
        requestAnimationFrame(() => {
            this.el.scrollTo({ top: this.model.scroll_position });
        });
    }
    scroll_to_latest() {
        // Waits for the child to be rendered before scrolling
        requestAnimationFrame(() => {
            this.el.scrollTo({ top: this.el.scrollHeight });
        });
    }
    trigger_auto_scroll() {
        const limit = this.model.auto_scroll_limit;
        const within_limit = this.distance_from_latest <= limit;
        if (limit == 0 || !within_limit)
            return;
        this.scroll_to_latest();
    }
    record_scroll_position() {
        this.model.scroll_position = Math.round(this.el.scrollTop);
    }
    toggle_scroll_button() {
        const threshold = this.model.scroll_button_threshold;
        const exceeds_threshold = this.distance_from_latest >= threshold;
        if (this.scroll_down_button_el) {
            this.scroll_down_button_el.classList.toggle("visible", threshold !== 0 && exceeds_threshold);
        }
    }
    render() {
        super.render();
        this.scroll_down_button_el = DOM.createElement('div', { class: 'scroll-button' });
        this.shadow_el.appendChild(this.scroll_down_button_el);
        this.el.addEventListener("scroll", () => {
            this.record_scroll_position();
            this.toggle_scroll_button();
        });
        this.scroll_down_button_el.addEventListener("click", () => {
            this.scroll_to_latest();
        });
    }
    after_render() {
        super.after_render();
        requestAnimationFrame(() => {
            if (this.model.scroll_position) {
                this.scroll_to_position();
            }
            if (this.model.view_latest) {
                this.scroll_to_latest();
            }
            this.toggle_scroll_button();
        });
    }
}
ColumnView.__name__ = "ColumnView";
export class Column extends BkColumn {
    constructor(attrs) {
        super(attrs);
    }
}
_a = Column;
Column.__name__ = "Column";
Column.__module__ = "panel.models.layout";
(() => {
    _a.prototype.default_view = ColumnView;
    _a.define(({ Int, Boolean }) => ({
        scroll_position: [Int, 0],
        auto_scroll_limit: [Int, 0],
        scroll_button_threshold: [Int, 0],
        view_latest: [Boolean, false],
    }));
})();
//# sourceMappingURL=column.js.map