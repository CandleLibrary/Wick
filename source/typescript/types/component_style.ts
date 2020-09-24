import { CSSNode } from "@candlefw/css";

export interface ComponentStyle {
    data: CSSNode;

    /**
     * If the style is defined within the same file
     * as the component element, the style is considered
     * inlined.
     */
    INLINE: boolean;
    location: string;
}
