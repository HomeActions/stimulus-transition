"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const stimulus_1 = require("@hotwired/stimulus");
class default_1 extends stimulus_1.Controller {
    initialize() {
        this.observer = new MutationObserver((mutations) => {
            this.observer.disconnect();
            this.verifyChange.call(this, mutations);
        });
        if (this.hasInitialValue)
            this.enter();
        else
            this.startObserver();
    }
    enter() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.runTransition("enter");
            this.dispatchEnd("enter");
            this.startObserver();
        });
    }
    leave(attribute) {
        return __awaiter(this, void 0, void 0, function* () {
            // Cancel out the display style
            if (attribute === "hidden")
                this.element.hidden = false;
            else
                this.displayStyle = this.currentDisplayStyle;
            yield this.runTransition("leave");
            // Restore the display style to previous value
            if (attribute === "hidden")
                this.element.hidden = true;
            else
                this.displayStyle = attribute === "style" ? "none" : undefined;
            this.dispatchEnd("leave");
            // Destroy element, or restart observer
            if (this.hasDestroyValue)
                this.element.remove();
            else
                this.startObserver();
        });
    }
    // Helpers for transition
    nextFrame() {
        return new Promise((resolve) => {
            requestAnimationFrame(() => {
                requestAnimationFrame(resolve);
            });
        });
    }
    afterTransition() {
        return new Promise((resolve) => {
            const duration = Number(getComputedStyle(this.element)
                .transitionDuration.split(",")[0]
                .replace("s", "")) * 1000;
            setTimeout(() => {
                resolve();
            }, duration);
        });
    }
    runTransition(dir) {
        return __awaiter(this, void 0, void 0, function* () {
            const activeClasses = this.getTransitionClasses(`${dir}-active`);
            const fromClasses = this.getTransitionClasses(`${dir}-from`);
            const toClasses = this.getTransitionClasses(`${dir}-to`);
            this.element.classList.add(...activeClasses);
            this.element.classList.add(...fromClasses);
            yield this.nextFrame();
            this.element.classList.remove(...fromClasses);
            this.element.classList.add(...toClasses);
            yield this.afterTransition();
            this.element.classList.remove(...toClasses);
            this.element.classList.remove(...activeClasses);
        });
    }
    getTransitionClasses(name) {
        var _a, _b;
        return ((_b = (_a = this.element.getAttribute(`data-transition-${name}`)) === null || _a === void 0 ? void 0 : _a.split(" ")) !== null && _b !== void 0 ? _b : []);
    }
    dispatchEnd(dir) {
        const type = `transition:end-${dir}`;
        const event = new CustomEvent(type, { bubbles: true, cancelable: true });
        this.element.dispatchEvent(event);
        return event;
    }
    get display() {
        return getComputedStyle(this.element)["display"];
    }
    set displayStyle(v) {
        v
            ? this.element.style.setProperty("display", v)
            : this.element.style.removeProperty("display");
    }
    // Helpers for observer
    verifyChange(mutations) {
        const newDisplayStyle = this.display;
        // Make sure there is a new computed displayStyle && the it was or will be "none"
        if (newDisplayStyle !== this.currentDisplayStyle &&
            (newDisplayStyle === "none" || this.currentDisplayStyle === "none"))
            newDisplayStyle === "none"
                ? this.leave(mutations[0].attributeName)
                : this.enter();
        else
            this.startObserver();
    }
    startObserver() {
        this.currentDisplayStyle = this.display;
        if (this.element.isConnected)
            this.observer.observe(this.element, {
                attributeFilter: ["class", "hidden", "style"],
            });
    }
}
exports.default = default_1;
default_1.values = { initial: Boolean, destroy: Boolean };
