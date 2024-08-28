var _a;
import { Tooltip } from "@bokehjs/models/ui/tooltip";
import { build_view } from "@bokehjs/core/build_views";
import { Button as BkButton, ButtonView as BkButtonView } from "@bokehjs/models/widgets/button";
export class ButtonView extends BkButtonView {
    *children() {
        yield* super.children();
        if (this.tooltip != null)
            yield this.tooltip;
    }
    async lazy_initialize() {
        await super.lazy_initialize();
        const { tooltip } = this.model;
        if (tooltip != null)
            this.tooltip = await build_view(tooltip, { parent: this });
    }
    remove() {
        this.tooltip?.remove();
        super.remove();
    }
    render() {
        super.render();
        const toggle = (visible) => {
            this.tooltip?.model.setv({
                visible,
            });
        };
        let timer;
        this.el.addEventListener("mouseenter", () => {
            timer = setTimeout(() => toggle(true), this.model.tooltip_delay);
        });
        this.el.addEventListener("mouseleave", () => {
            clearTimeout(timer);
            toggle(false);
        });
    }
}
ButtonView.__name__ = "ButtonView";
export class Button extends BkButton {
    constructor(attrs) {
        super(attrs);
    }
}
_a = Button;
Button.__name__ = "Button";
Button.__module__ = "panel.models.widgets";
(() => {
    _a.prototype.default_view = ButtonView;
    _a.define(({ Nullable, Ref, Number }) => ({
        tooltip: [Nullable(Ref(Tooltip)), null],
        tooltip_delay: [Number, 500],
    }));
})();
//# sourceMappingURL=button.js.map