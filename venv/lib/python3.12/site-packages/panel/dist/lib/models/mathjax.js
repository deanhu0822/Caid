var _a;
import { Markup } from "@bokehjs/models/widgets/markup";
import { PanelMarkupView } from "./layout";
export class MathJaxView extends PanelMarkupView {
    connect_signals() {
        super.connect_signals();
        this.connect(this.model.properties.text.change, () => this.render());
    }
    render() {
        super.render();
        this.container.innerHTML = this.has_math_disabled() ? this.model.text : this.process_tex(this.model.text);
    }
}
MathJaxView.__name__ = "MathJaxView";
export class MathJax extends Markup {
    constructor(attrs) {
        super(attrs);
    }
}
_a = MathJax;
MathJax.__name__ = "MathJax";
MathJax.__module__ = "panel.models.mathjax";
(() => {
    _a.prototype.default_view = MathJaxView;
})();
//# sourceMappingURL=mathjax.js.map