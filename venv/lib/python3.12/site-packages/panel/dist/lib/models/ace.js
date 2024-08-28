var _a;
import { div } from "@bokehjs/core/dom";
import { HTMLBox, HTMLBoxView } from "./layout";
function ID() {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
}
export class AcePlotView extends HTMLBoxView {
    initialize() {
        super.initialize();
        this._container = div({
            id: ID(),
            style: {
                width: "100%",
                height: "100%",
                zIndex: 0,
            }
        });
    }
    connect_signals() {
        super.connect_signals();
        this.connect(this.model.properties.code.change, () => this._update_code_from_model());
        this.connect(this.model.properties.theme.change, () => this._update_theme());
        this.connect(this.model.properties.language.change, () => this._update_language());
        this.connect(this.model.properties.filename.change, () => this._update_filename());
        this.connect(this.model.properties.print_margin.change, () => this._update_print_margin());
        this.connect(this.model.properties.annotations.change, () => this._add_annotations());
        this.connect(this.model.properties.readonly.change, () => {
            this._editor.setReadOnly(this.model.readonly);
        });
    }
    render() {
        super.render();
        if (!(this._container === this.shadow_el.childNodes[0]))
            this.shadow_el.append(this._container);
        this._container.textContent = this.model.code;
        this._editor = ace.edit(this._container);
        this._editor.renderer.attachToShadowRoot();
        this._langTools = ace.require('ace/ext/language_tools');
        this._modelist = ace.require("ace/ext/modelist");
        this._editor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            fontFamily: "monospace", //hack for cursor position
        });
        this._update_theme();
        this._update_filename();
        this._update_language();
        this._editor.setReadOnly(this.model.readonly);
        this._editor.setShowPrintMargin(this.model.print_margin);
        this._editor.on('change', () => this._update_code_from_editor());
    }
    _update_code_from_model() {
        if (this._editor && this._editor.getValue() != this.model.code)
            this._editor.setValue(this.model.code);
    }
    _update_print_margin() {
        this._editor.setShowPrintMargin(this.model.print_margin);
    }
    _update_code_from_editor() {
        if (this._editor.getValue() != this.model.code) {
            this.model.code = this._editor.getValue();
        }
    }
    _update_theme() {
        this._editor.setTheme(`ace/theme/${this.model.theme}`);
    }
    _update_filename() {
        if (this.model.filename) {
            const mode = this._modelist.getModeForPath(this.model.filename).mode;
            this.model.language = mode.slice(9);
        }
    }
    _update_language() {
        if (this.model.language != null) {
            this._editor.session.setMode(`ace/mode/${this.model.language}`);
        }
    }
    _add_annotations() {
        this._editor.session.setAnnotations(this.model.annotations);
    }
    after_layout() {
        super.after_layout();
        this._editor.resize();
    }
}
AcePlotView.__name__ = "AcePlotView";
export class AcePlot extends HTMLBox {
    constructor(attrs) {
        super(attrs);
    }
}
_a = AcePlot;
AcePlot.__name__ = "AcePlot";
AcePlot.__module__ = "panel.models.ace";
(() => {
    _a.prototype.default_view = AcePlotView;
    _a.define(({ Any, Array, Boolean, String, Nullable }) => ({
        code: [String, ''],
        filename: [Nullable(String), null],
        language: [String, ''],
        theme: [String, 'chrome'],
        annotations: [Array(Any), []],
        readonly: [Boolean, false],
        print_margin: [Boolean, false]
    }));
    _a.override({
        height: 300,
        width: 300
    });
})();
//# sourceMappingURL=ace.js.map