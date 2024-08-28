var _a;
import { Markup } from "@bokehjs/models/widgets/markup";
import { PanelMarkupView } from "./layout";
export class KaTeXView extends PanelMarkupView {
    connect_signals() {
        super.connect_signals();
        this.connect(this.model.properties.text.change, () => this.render());
    }
    render() {
        super.render();
        this.container.innerHTML = this.model.text;
        if (!window.renderMathInElement) {
            return;
        }
        window.renderMathInElement(this.shadow_el, {
            delimiters: [
                { left: "$$", right: "$$", display: true },
                { left: "\\[", right: "\\]", display: true },
                { left: "$", right: "$", display: false },
                { left: "\\(", right: "\\)", display: false }
            ]
        });
    }
}
KaTeXView.__name__ = "KaTeXView";
export class KaTeX extends Markup {
    constructor(attrs) {
        super(attrs);
    }
}
_a = KaTeX;
KaTeX.__name__ = "KaTeX";
KaTeX.__module__ = "panel.models.katex";
(() => {
    _a.prototype.default_view = KaTeXView;
})();
//# sourceMappingURL=katex.js.map