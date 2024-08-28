var _a, _b;
import { ModelEvent } from "@bokehjs/core/bokeh_events";
import { Markup } from "@bokehjs/models/widgets/markup";
import { PanelMarkupView } from "./layout";
import { serializeEvent } from "./event-to-object";
export class DOMEvent extends ModelEvent {
    constructor(node, data) {
        super();
        this.node = node;
        this.data = data;
    }
    get event_values() {
        return { model: this.origin, node: this.node, data: this.data };
    }
}
_a = DOMEvent;
DOMEvent.__name__ = "DOMEvent";
(() => {
    _a.prototype.event_name = "dom_event";
})();
export function htmlDecode(input) {
    var doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
}
export function runScripts(node) {
    Array.from(node.querySelectorAll("script")).forEach((oldScript) => {
        const newScript = document.createElement("script");
        Array.from(oldScript.attributes)
            .forEach((attr) => newScript.setAttribute(attr.name, attr.value));
        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        if (oldScript.parentNode)
            oldScript.parentNode.replaceChild(newScript, oldScript);
    });
}
export class HTMLView extends PanelMarkupView {
    constructor() {
        super(...arguments);
        this._event_listeners = {};
    }
    connect_signals() {
        super.connect_signals();
        this.connect(this.model.properties.text.change, () => {
            const html = this.process_tex();
            this.set_html(html);
        });
        this.connect(this.model.properties.visible.change, () => {
            if (this.model.visible)
                this.container.style.visibility = 'visible';
        });
        this.connect(this.model.properties.events.change, () => {
            this._remove_event_listeners();
            this._setup_event_listeners();
        });
    }
    rerender() {
        this.render();
        this.invalidate_layout();
    }
    set_html(html) {
        if (html) {
            this.container.innerHTML = html;
            if (this.model.run_scripts)
                runScripts(this.container);
            this._setup_event_listeners();
        }
    }
    render() {
        super.render();
        this.container.style.visibility = 'hidden';
        this.shadow_el.appendChild(this.container);
        if (this.provider.status == "failed" || this.provider.status == "loaded")
            this._has_finished = true;
        const html = this.process_tex();
        this.watch_stylesheets();
        this.set_html(html);
    }
    style_redraw() {
        if (this.model.visible)
            this.container.style.visibility = 'visible';
    }
    process_tex() {
        const decoded = htmlDecode(this.model.text);
        const text = decoded || this.model.text;
        if (this.model.disable_math || !this.contains_tex(text))
            return text;
        const tex_parts = this.provider.MathJax.find_tex(text);
        const processed_text = [];
        let last_index = 0;
        for (const part of tex_parts) {
            processed_text.push(text.slice(last_index, part.start.n));
            processed_text.push(this.provider.MathJax.tex2svg(part.math, { display: part.display }).outerHTML);
            last_index = part.end.n;
        }
        if (last_index < text.length)
            processed_text.push(text.slice(last_index));
        return processed_text.join("");
    }
    contains_tex(html) {
        if (!this.provider.MathJax)
            return false;
        return this.provider.MathJax.find_tex(html).length > 0;
    }
    _remove_event_listeners() {
        for (const node in this._event_listeners) {
            const el = document.getElementById(node);
            if (el == null) {
                console.warn(`DOM node '${node}' could not be found. Cannot subscribe to DOM events.`);
                continue;
            }
            for (const event_name in this._event_listeners[node]) {
                const event_callback = this._event_listeners[node][event_name];
                el.removeEventListener(event_name, event_callback);
            }
        }
        this._event_listeners = {};
    }
    _setup_event_listeners() {
        for (const node in this.model.events) {
            const el = document.getElementById(node);
            if (el == null) {
                console.warn(`DOM node '${node}' could not be found. Cannot subscribe to DOM events.`);
                continue;
            }
            for (const event_name of this.model.events[node]) {
                const callback = (event) => {
                    this.model.trigger_event(new DOMEvent(node, serializeEvent(event)));
                };
                el.addEventListener(event_name, callback);
                if (!(node in this._event_listeners))
                    this._event_listeners[node] = {};
                this._event_listeners[node][event_name] = callback;
            }
        }
    }
}
HTMLView.__name__ = "HTMLView";
export class HTML extends Markup {
    constructor(attrs) {
        super(attrs);
    }
}
_b = HTML;
HTML.__name__ = "HTML";
HTML.__module__ = "panel.models.markup";
(() => {
    _b.prototype.default_view = HTMLView;
    _b.define(({ Any, Boolean }) => ({
        events: [Any, {}],
        run_scripts: [Boolean, true]
    }));
})();
//# sourceMappingURL=html.js.map