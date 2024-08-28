var _a;
import { TextAreaInput as BkTextAreaInput, TextAreaInputView as BkTextAreaInputView } from "@bokehjs/models/widgets/textarea_input";
export class TextAreaInputView extends BkTextAreaInputView {
    connect_signals() {
        super.connect_signals();
        const { value, max_rows } = this.model.properties;
        this.on_change([max_rows, value], () => this.update_rows());
    }
    update_rows() {
        if (!this.model.auto_grow) {
            return;
        }
        // Use this.el directly to access the textarea element
        const textarea = this.input_el;
        const textLines = textarea.value.split("\n");
        const numRows = Math.max(textLines.length, this.model.rows, 1);
        textarea.rows = Math.min(numRows, this.model.max_rows || Infinity);
    }
    render() {
        super.render();
        this.update_rows();
        this.el.addEventListener("input", () => {
            this.update_rows();
        });
    }
}
TextAreaInputView.__name__ = "TextAreaInputView";
export class TextAreaInput extends BkTextAreaInput {
    constructor(attrs) {
        super(attrs);
    }
}
_a = TextAreaInput;
TextAreaInput.__name__ = "TextAreaInput";
TextAreaInput.__module__ = "panel.models.widgets";
(() => {
    _a.prototype.default_view = TextAreaInputView;
    _a.define(({ Boolean, Int, Nullable }) => ({
        auto_grow: [Boolean, false],
        max_rows: [Nullable(Int), null]
    }));
})();
//# sourceMappingURL=textarea_input.js.map