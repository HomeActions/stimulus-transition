import { Controller } from "@hotwired/stimulus";
export default class extends Controller {
    static values: {
        initial: BooleanConstructor;
        destroy: BooleanConstructor;
    };
    hasDestroyValue: boolean;
    hasInitialValue: boolean;
    observer: MutationObserver;
    currentDisplayStyle: string;
    initialize(): void;
    enter(): Promise<void>;
    leave(attribute?: string | null): Promise<void>;
    private nextFrame;
    private afterTransition;
    private runTransition;
    private getTransitionClasses;
    private dispatchEnd;
    private get display();
    private set displayStyle(value);
    private verifyChange;
    private startObserver;
}
