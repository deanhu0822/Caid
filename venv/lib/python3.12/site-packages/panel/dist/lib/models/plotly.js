var _a;
import { div } from "@bokehjs/core/dom";
import { clone } from "@bokehjs/core/util/object";
import { is_equal } from "@bokehjs/core/util/eq";
import { ColumnDataSource } from "@bokehjs/models/sources/column_data_source";
import { debounce } from "debounce";
import { deepCopy, isPlainObject, get, reshape, throttle } from "./util";
import { HTMLBox, HTMLBoxView, set_size } from "./layout";
function convertUndefined(obj) {
    Object
        .entries(obj)
        .forEach(([key, value]) => {
        if (!!value && (typeof value === 'object')) {
            convertUndefined(value);
        }
        else if (value === undefined) {
            obj[key] = null;
        }
    });
    return obj;
}
const filterEventData = (gd, eventData, event) => {
    // Ported from dash-core-components/src/components/Graph.react.js
    let filteredEventData = Array.isArray(eventData) ? [] : {};
    if (event === "click" || event === "hover" || event === "selected") {
        const points = [];
        if (eventData === undefined || eventData === null) {
            return null;
        }
        /*
         * remove `data`, `layout`, `xaxis`, etc
         * objects from the event data since they're so big
         * and cause JSON stringify circular structure errors.
         *
         * also, pull down the `customdata` point from the data array
         * into the event object
         */
        const data = gd.data;
        for (let i = 0; i < eventData.points.length; i++) {
            const fullPoint = eventData.points[i];
            let pointData = {};
            for (let property in fullPoint) {
                const val = fullPoint[property];
                if (fullPoint.hasOwnProperty(property) &&
                    !Array.isArray(val) && !isPlainObject(val) &&
                    val !== undefined) {
                    pointData[property] = val;
                }
            }
            if (fullPoint !== undefined && fullPoint !== null) {
                if (fullPoint.hasOwnProperty("curveNumber") &&
                    fullPoint.hasOwnProperty("pointNumber") &&
                    data[fullPoint["curveNumber"]].hasOwnProperty("customdata")) {
                    pointData["customdata"] =
                        data[fullPoint["curveNumber"]].customdata[fullPoint["pointNumber"]];
                }
                // specific to histogram. see https://github.com/plotly/plotly.js/pull/2113/
                if (fullPoint.hasOwnProperty('pointNumbers')) {
                    pointData["pointNumbers"] = fullPoint.pointNumbers;
                }
            }
            points[i] = pointData;
        }
        filteredEventData["points"] = points;
    }
    else if (event === 'relayout' || event === 'restyle') {
        /*
         * relayout shouldn't include any big objects
         * it will usually just contain the ranges of the axes like
         * "xaxis.range[0]": 0.7715822247381828,
         * "xaxis.range[1]": 3.0095292008680063`
         */
        for (let property in eventData) {
            if (eventData.hasOwnProperty(property)) {
                filteredEventData[property] = eventData[property];
            }
        }
    }
    if (eventData.hasOwnProperty('range')) {
        filteredEventData["range"] = eventData["range"];
    }
    if (eventData.hasOwnProperty('lassoPoints')) {
        filteredEventData["lassoPoints"] = eventData["lassoPoints"];
    }
    return convertUndefined(filteredEventData);
};
const _isHidden = (gd) => {
    var display = window.getComputedStyle(gd).display;
    return !display || display === 'none';
};
export class PlotlyPlotView extends HTMLBoxView {
    constructor() {
        super(...arguments);
        this._settingViewport = false;
        this._plotInitialized = false;
        this._rendered = false;
        this._reacting = false;
        this._relayouting = false;
        this._end_relayouting = debounce(() => {
            this._relayouting = false;
        }, 2000, false);
    }
    connect_signals() {
        super.connect_signals();
        const { data, data_sources, layout, relayout, restyle } = this.model.properties;
        this.on_change([data, data_sources, layout], () => {
            const render_count = this.model._render_count;
            setTimeout(() => {
                if (this.model._render_count === render_count)
                    this.model._render_count += 1;
            }, 250);
        });
        this.on_change([relayout], () => {
            if (this.model.relayout == null)
                return;
            window.Plotly.relayout(this.container, this.model.relayout);
            this.model.relayout = null;
        });
        this.on_change([restyle], () => {
            if (this.model.restyle == null)
                return;
            window.Plotly.restyle(this.container, this.model.restyle.data, this.model.restyle.traces);
            this.model.restyle = null;
        });
        this.connect(this.model.properties.viewport_update_policy.change, () => {
            this._updateSetViewportFunction();
        });
        this.connect(this.model.properties.viewport_update_throttle.change, () => {
            this._updateSetViewportFunction();
        });
        this.connect(this.model.properties._render_count.change, () => {
            this.plot();
        });
        this.connect(this.model.properties.frames.change, () => {
            this.plot(true);
        });
        this.connect(this.model.properties.viewport.change, () => this._updateViewportFromProperty());
    }
    remove() {
        window.Plotly.purge(this.container);
        super.remove();
    }
    render() {
        super.render();
        this.container = div();
        set_size(this.container, this.model);
        this._rendered = false;
        this.shadow_el.appendChild(this.container);
        this.watch_stylesheets();
        this.plot().then(() => {
            this._rendered = true;
            if (this.model.relayout != null)
                window.Plotly.relayout(this.container, this.model.relayout);
            window.Plotly.Plots.resize(this.container);
        });
    }
    style_redraw() {
        if (this._rendered)
            window.Plotly.Plots.resize(this.container);
    }
    after_layout() {
        super.after_layout();
        if (this._rendered)
            window.Plotly.Plots.resize(this.container);
    }
    _trace_data() {
        const data = [];
        for (let i = 0; i < this.model.data.length; i++)
            data.push(this._get_trace(i, false));
        return data;
    }
    _layout_data() {
        const newLayout = deepCopy(this.model.layout);
        if (this._relayouting) {
            const { layout } = this.container;
            // For each xaxis* and yaxis* property of layout, if the value has a 'range'
            // property then use this in newLayout
            Object.keys(layout).reduce((value, key) => {
                if (key.slice(1, 5) === "axis" && 'range' in value) {
                    newLayout[key].range = value.range;
                }
            }, {});
        }
        return newLayout;
    }
    _install_callbacks() {
        //  - plotly_relayout
        this.container.on('plotly_relayout', (eventData) => {
            if (eventData['_update_from_property'] !== true) {
                this.model.relayout_data = filterEventData(this.container, eventData, 'relayout');
                this._updateViewportProperty();
                this._end_relayouting();
            }
        });
        //  - plotly_relayouting
        this.container.on('plotly_relayouting', () => {
            if (this.model.viewport_update_policy !== 'mouseup') {
                this._relayouting = true;
                this._updateViewportProperty();
            }
        });
        //  - plotly_restyle
        this.container.on('plotly_restyle', (eventData) => {
            this.model.restyle_data = filterEventData(this.container, eventData, 'restyle');
            this._updateViewportProperty();
        });
        //  - plotly_click
        this.container.on('plotly_click', (eventData) => {
            this.model.click_data = filterEventData(this.container, eventData, 'click');
        });
        //  - plotly_hover
        this.container.on('plotly_hover', (eventData) => {
            this.model.hover_data = filterEventData(this.container, eventData, 'hover');
        });
        //  - plotly_selected
        this.container.on('plotly_selected', (eventData) => {
            this.model.selected_data = filterEventData(this.container, eventData, 'selected');
        });
        //  - plotly_clickannotation
        this.container.on('plotly_clickannotation', (eventData) => {
            delete eventData["event"];
            delete eventData["fullAnnotation"];
            this.model.clickannotation_data = eventData;
        });
        //  - plotly_deselect
        this.container.on('plotly_deselect', () => {
            this.model.selected_data = null;
        });
        //  - plotly_unhover
        this.container.on('plotly_unhover', () => {
            this.model.hover_data = null;
        });
    }
    async plot(new_plot = false) {
        if (!window.Plotly)
            return;
        const data = this._trace_data();
        const newLayout = this._layout_data();
        this._reacting = true;
        if (new_plot) {
            const obj = { data: data, layout: newLayout, config: this.model.config, frames: this.model.frames };
            await window.Plotly.newPlot(this.container, obj);
        }
        else {
            await window.Plotly.react(this.container, data, newLayout, this.model.config);
            if (this.model.frames != null)
                await window.Plotly.addFrames(this.container, this.model.frames);
        }
        this._updateSetViewportFunction();
        this._updateViewportProperty();
        if (!this._plotInitialized)
            this._install_callbacks();
        else if (!_isHidden(this.container))
            window.Plotly.Plots.resize(this.container);
        this._reacting = false;
        this._plotInitialized = true;
    }
    _get_trace(index, update) {
        const trace = clone(this.model.data[index]);
        const cds = this.model.data_sources[index];
        for (const column of cds.columns()) {
            let array = cds.get_array(column)[0];
            if (array.shape != null && array.shape.length > 1) {
                array = reshape(array, array.shape);
            }
            let prop_path = column.split(".");
            let prop = prop_path[prop_path.length - 1];
            let prop_parent = trace;
            for (let k of prop_path.slice(0, -1)) {
                prop_parent = prop_parent[k];
            }
            if (update && prop_path.length == 1) {
                prop_parent[prop] = [array];
            }
            else {
                prop_parent[prop] = array;
            }
        }
        return trace;
    }
    _updateViewportFromProperty() {
        if (!window.Plotly || this._settingViewport || this._reacting || !this.model.viewport) {
            return;
        }
        const fullLayout = this.container._fullLayout;
        // Call relayout if viewport differs from fullLayout
        Object.keys(this.model.viewport).reduce((value, key) => {
            if (!is_equal(get(fullLayout, key), value)) {
                let clonedViewport = deepCopy(this.model.viewport);
                clonedViewport['_update_from_property'] = true;
                this._settingViewport = true;
                window.Plotly.relayout(this.el, clonedViewport).then(() => {
                    this._settingViewport = false;
                });
                return false;
            }
            else {
                return true;
            }
        }, {});
    }
    _updateViewportProperty() {
        const fullLayout = this.container._fullLayout;
        let viewport = {};
        // Get range for all xaxis and yaxis properties
        for (let prop in fullLayout) {
            if (!fullLayout.hasOwnProperty(prop))
                continue;
            let maybe_axis = prop.slice(0, 5);
            if (maybe_axis === 'xaxis' || maybe_axis === 'yaxis')
                viewport[prop + '.range'] = deepCopy(fullLayout[prop].range);
        }
        if (!is_equal(viewport, this.model.viewport))
            this._setViewport(viewport);
    }
    _updateSetViewportFunction() {
        if (this.model.viewport_update_policy === "continuous" ||
            this.model.viewport_update_policy === "mouseup") {
            this._setViewport = (viewport) => {
                if (!this._settingViewport) {
                    this._settingViewport = true;
                    this.model.viewport = viewport;
                    this._settingViewport = false;
                }
            };
        }
        else {
            this._setViewport = throttle((viewport) => {
                if (!this._settingViewport) {
                    this._settingViewport = true;
                    this.model.viewport = viewport;
                    this._settingViewport = false;
                }
            }, this.model.viewport_update_throttle);
        }
    }
}
PlotlyPlotView.__name__ = "PlotlyPlotView";
export class PlotlyPlot extends HTMLBox {
    constructor(attrs) {
        super(attrs);
    }
}
_a = PlotlyPlot;
PlotlyPlot.__name__ = "PlotlyPlot";
PlotlyPlot.__module__ = "panel.models.plotly";
(() => {
    _a.prototype.default_view = PlotlyPlotView;
    _a.define(({ Array, Any, Nullable, Number, Ref, String }) => ({
        data: [Array(Any), []],
        layout: [Any, {}],
        config: [Any, {}],
        frames: [Nullable(Array(Any)), null],
        data_sources: [Array(Ref(ColumnDataSource)), []],
        relayout: [Nullable(Any), {}],
        restyle: [Nullable(Any), {}],
        relayout_data: [Any, {}],
        restyle_data: [Array(Any), []],
        click_data: [Any, {}],
        hover_data: [Any, {}],
        clickannotation_data: [Any, {}],
        selected_data: [Any, {}],
        viewport: [Any, {}],
        viewport_update_policy: [String, "mouseup"],
        viewport_update_throttle: [Number, 200],
        _render_count: [Number, 0],
    }));
})();
//# sourceMappingURL=plotly.js.map