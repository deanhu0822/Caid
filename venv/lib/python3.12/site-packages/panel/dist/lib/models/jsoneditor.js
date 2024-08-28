var _a, _b;
import { ImportedStyleSheet } from "@bokehjs/core/dom";
import { ModelEvent } from "@bokehjs/core/bokeh_events";
import { HTMLBox, HTMLBoxView } from "./layout";
export class JSONEditEvent extends ModelEvent {
    constructor(data) {
        super();
        this.data = data;
    }
    get event_values() {
        return { model: this.origin, data: this.data };
    }
}
_a = JSONEditEvent;
JSONEditEvent.__name__ = "JSONEditEvent";
(() => {
    _a.prototype.event_name = "json_edit";
})();
export class JSONEditorView extends HTMLBoxView {
    connect_signals() {
        super.connect_signals();
        const { data, disabled, templates, menu, mode, search, schema } = this.model.properties;
        this.on_change([data], () => this.editor.update(this.model.data));
        this.on_change([templates], () => {
            this.editor.options.templates = this.model.templates;
        });
        this.on_change([menu], () => {
            this.editor.options.menu = this.model.menu;
        });
        this.on_change([search], () => {
            this.editor.options.search = this.model.search;
        });
        this.on_change([schema], () => {
            this.editor.options.schema = this.model.schema;
        });
        this.on_change([disabled, mode], () => {
            const mode = this.model.disabled ? 'view' : this.model.mode;
            this.editor.setMode(mode);
        });
    }
    stylesheets() {
        const styles = super.stylesheets();
        for (const css of this.model.css)
            styles.push(new ImportedStyleSheet(css));
        return styles;
    }
    remove() {
        super.remove();
        this.editor.destroy();
    }
    render() {
        super.render();
        const mode = this.model.disabled ? 'view' : this.model.mode;
        this.editor = new window.JSONEditor(this.shadow_el, {
            menu: this.model.menu,
            mode: mode,
            onChangeJSON: (json) => {
                this.model.data = json;
            },
            onSelectionChange: (start, end) => {
                this.model.selection = [start, end];
            },
            search: this.model.search,
            schema: this.model.schema,
            templates: this.model.templates,
        });
        this.editor.set(this.model.data);
    }
}
JSONEditorView.__name__ = "JSONEditorView";
export class JSONEditor extends HTMLBox {
    constructor(attrs) {
        super(attrs);
    }
}
_b = JSONEditor;
JSONEditor.__name__ = "JSONEditor";
JSONEditor.__module__ = "panel.models.jsoneditor";
(() => {
    _b.prototype.default_view = JSONEditorView;
    _b.define(({ Any, Array, Boolean, String }) => ({
        css: [Array(String), []],
        data: [Any, {}],
        mode: [String, 'tree'],
        menu: [Boolean, true],
        search: [Boolean, true],
        selection: [Array(Any), []],
        schema: [Any, null],
        templates: [Array(Any), []],
    }));
})();
//# sourceMappingURL=jsoneditor.js.map