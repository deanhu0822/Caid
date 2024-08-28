var _a, _b;
import { div } from "@bokehjs/core/dom";
import { ModelEvent } from "@bokehjs/core/bokeh_events";
import { HTMLBox, HTMLBoxView, set_size } from "./layout";
export class KeystrokeEvent extends ModelEvent {
    constructor(key) {
        super();
        this.key = key;
    }
    get event_values() {
        return { model: this.origin, key: this.key };
    }
}
_a = KeystrokeEvent;
KeystrokeEvent.__name__ = "KeystrokeEvent";
(() => {
    _a.prototype.event_name = "keystroke";
})();
export class TerminalView extends HTMLBoxView {
    connect_signals() {
        super.connect_signals();
        this.connect(this.model.properties.output.change, this.write);
        this.connect(this.model.properties._clears.change, this.clear);
    }
    render() {
        super.render();
        this.container = div({ class: "terminal-container" });
        set_size(this.container, this.model);
        this.term = this.getNewTerminal();
        this.term.onData((value) => {
            this.handleOnData(value);
        });
        this.webLinksAddon = this.getNewWebLinksAddon();
        this.term.loadAddon(this.webLinksAddon);
        this.term.open(this.container);
        this.term.onRender(() => {
            if (!this._rendered)
                this.fit();
        });
        this.write();
        this.shadow_el.appendChild(this.container);
    }
    getNewTerminal() {
        const wn = window;
        if (wn.Terminal)
            return new wn.Terminal(this.model.options);
        else
            return new wn.xtermjs.Terminal(this.model.options);
    }
    getNewWebLinksAddon() {
        const wn = window;
        return new wn.WebLinksAddon.WebLinksAddon();
    }
    handleOnData(value) {
        this.model.trigger_event(new KeystrokeEvent(value));
    }
    write() {
        const text = this.model.output;
        if (text == null || !text.length)
            return;
        // https://stackoverflow.com/questions/65367607/how-to-handle-new-line-in-xterm-js-while-writing-data-into-the-terminal
        const cleaned = text.replace(/\r?\n/g, "\r\n");
        // var text = Array.from(cleaned, (x) => x.charCodeAt(0))
        this.term.write(cleaned);
    }
    clear() {
        this.term.clear();
    }
    fit() {
        const width = this.container.offsetWidth;
        const height = this.container.offsetHeight;
        const renderer = this.term._core._renderService;
        const cell_width = renderer.dimensions.actualCellWidth || 9;
        const cell_height = renderer.dimensions.actualCellHeight || 18;
        if (width == null || height == null || width <= 0 || height <= 0)
            return;
        const cols = Math.max(2, Math.floor(width / cell_width));
        const rows = Math.max(1, Math.floor(height / cell_height));
        if (this.term.rows !== rows || this.term.cols !== cols)
            this.term.resize(cols, rows);
        this.model.ncols = cols;
        this.model.nrows = rows;
        this._rendered = true;
    }
    after_layout() {
        super.after_layout();
        this.fit();
    }
}
TerminalView.__name__ = "TerminalView";
// The Bokeh .ts model corresponding to the Bokeh .py model
export class Terminal extends HTMLBox {
    constructor(attrs) {
        super(attrs);
    }
}
_b = Terminal;
Terminal.__name__ = "Terminal";
Terminal.__module__ = "panel.models.terminal";
(() => {
    _b.prototype.default_view = TerminalView;
    _b.define(({ Any, Int, String }) => ({
        _clears: [Int, 0],
        options: [Any, {}],
        output: [String, ''],
        ncols: [Int, 0],
        nrows: [Int, 0],
    }));
})();
//# sourceMappingURL=terminal.js.map