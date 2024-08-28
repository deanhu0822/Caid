var _a;
import { Select, SelectView } from "@bokehjs/models/widgets/selectbox";
export class CustomSelectView extends SelectView {
    connect_signals() {
        super.connect_signals();
        this.connect(this.model.properties.disabled_options.change, () => this._update_disabled_options());
    }
    options_el() {
        let opts = super.options_el();
        opts.forEach((element) => {
            if (this.model.disabled_options.includes(element.value)) {
                element.setAttribute('disabled', 'true');
            }
        });
        return opts;
    }
    _update_disabled_options() {
        for (const element of this.input_el.options) {
            if (this.model.disabled_options.includes(element.value)) {
                element.setAttribute('disabled', 'true');
            }
            else {
                element.removeAttribute('disabled');
            }
        }
    }
}
CustomSelectView.__name__ = "CustomSelectView";
export class CustomSelect extends Select {
    constructor(attrs) {
        super(attrs);
    }
}
_a = CustomSelect;
CustomSelect.__name__ = "CustomSelect";
CustomSelect.__module__ = "panel.models.widgets";
(() => {
    _a.prototype.default_view = CustomSelectView;
    _a.define(({ Array, String }) => {
        return {
            disabled_options: [Array(String), []],
        };
    });
})();
//# sourceMappingURL=customselect.js.map