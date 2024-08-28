var _a;
import { Tooltip } from '@bokehjs/models/ui/tooltip';
import { LayoutDOM, LayoutDOMView } from "@bokehjs/models/layouts/layout_dom";
import { div, label } from '@bokehjs/core/dom';
import inputs_css, * as inputs from '@bokehjs/styles/widgets/inputs.css';
import icons_css from '@bokehjs/styles/icons.css';
export class TooltipIconView extends LayoutDOMView {
    get child_models() {
        if (this.model.description == null)
            return [];
        return [this.model.description];
    }
    connect_signals() {
        super.connect_signals();
        const { description } = this.model.properties;
        this.on_change(description, () => this.update_children());
    }
    stylesheets() {
        return [...super.stylesheets(), inputs_css, icons_css];
    }
    render() {
        super.render();
        const icon_el = div({ class: inputs.icon });
        this.desc_el = div({ class: inputs.description }, icon_el);
        this.model.description.target = this.desc_el;
        let persistent = false;
        const toggle = (visible) => {
            this.model.description.setv({
                visible,
                closable: persistent,
            });
            icon_el.classList.toggle(inputs.opaque, visible && persistent);
        };
        this.on_change(this.model.description.properties.visible, () => {
            const { visible } = this.model.description;
            if (!visible) {
                persistent = false;
            }
            toggle(visible);
        });
        this.desc_el.addEventListener('mouseenter', () => {
            toggle(true);
        });
        this.desc_el.addEventListener('mouseleave', () => {
            if (!persistent)
                toggle(false);
        });
        document.addEventListener('mousedown', (event) => {
            const path = event.composedPath();
            const tooltip_view = this._child_views.get(this.model.description);
            if (tooltip_view !== undefined && path.includes(tooltip_view.el)) {
                return;
            }
            else if (path.includes(this.desc_el)) {
                persistent = !persistent;
                toggle(persistent);
            }
            else {
                persistent = false;
                toggle(false);
            }
        });
        window.addEventListener('blur', () => {
            persistent = false;
            toggle(false);
        });
        // Label to get highlight when icon is hovered
        this.shadow_el.appendChild(label(this.desc_el));
    }
}
TooltipIconView.__name__ = "TooltipIconView";
export class TooltipIcon extends LayoutDOM {
    constructor(attrs) {
        super(attrs);
    }
}
_a = TooltipIcon;
TooltipIcon.__name__ = "TooltipIcon";
TooltipIcon.__module__ = 'panel.models.widgets';
(() => {
    _a.prototype.default_view = TooltipIconView;
    _a.define(({ Ref }) => ({
        description: [Ref(Tooltip), new Tooltip()],
    }));
})();
//# sourceMappingURL=tooltip_icon.js.map