import { CSS_Color } from "../../types/color";
import { CSS_Length } from "../../types/length";
import { CSS_Percentage } from "../../types/percentage";
import { CSS_URL } from "../../types/url";
import { CSS_String } from "../../types/string";
import { CSS_Id } from "../../types/id";
import { CSS_Shape } from "../../types/shape";
import { CSS_Number } from "../../types/number";
import { CSS_Bezier } from "../../types/cubic_bezier";

export const types = {
    color: CSS_Color,
    length: CSS_Length,
    time: CSS_Length,
    flex: CSS_Length,
    angle: CSS_Length,
    frequency: CSS_Length,
    resolution: CSS_Length,
    percentage: CSS_Percentage,
    url: CSS_URL,
    uri: CSS_URL,
    number: CSS_Number,
    id: CSS_Id,
    string: CSS_String,
    shape: CSS_Shape,
    cubic_bezier: CSS_Bezier
}

/** CSS Property Definitions */
export const props = {
    //CSS1 Properties https://www.w3.org/TR/CSS1/
    color: `<color>`,

    /* Background */
    background_color: `transparent|<color>`,
    background_image: `<url>|none`,
    background_repeat: `repeat|repeat-x|repeat-y|no-repeat`,
    background_attachment: `scroll|fixed`,
    background_position: `[<percentage>|<length>]{1,2}|[top|center|bottom]||[left|center|right]`,
    background: `<background_color>||<background_image>||<background_repeat>||<background_attachment>||<background_position>`,

    /* Font */
    font_family: `[[<family_name>|<generic_family>],]*[<family_name>|<generic_family>]`,
    family_name: `<id>||<string>`,
    generic_name: `serif|sans_serif|cursive|fantasy|monospace`,
    font: `[<font_style>||<font_variant>||<font_weight>]?<font_size>[/<line_height>]?<font_family>`,
    font_variant: `normal|small_caps`,
    font_style: `normal|italic|oblique`,
    font_size: `<absolute_size>|<relative_size>|<length>|<percentage>`,
    absolute_size: `xx_small|x_small|small|medium|large|x_large|xx_large`,
    relative_size: `larger|smaller`,
    font_wight: `normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900`,

    /* Text */
    word_spacing: `normal|<length>`,
    letter_spacing: `normal|<length>`,
    text_decoration: `none|[underline||overline||line-through||blink]`,
    vertical_align: `baseline|sub|super|top|text-top|middle|bottom|text-bottom|<percentage>`,
    text_transform: `capitalize|uppercase|lowercase|none`,
    text_align: `left|right|center|justify`,
    text_indent: `<length>|<percentage>`,
    line_height: `normal|<length>|<percentage>|<number>`,

    /* Box */
    margin: `[<length>|<percentage>|auto]{1,4}`,
    margin_top: `<length>|<percentage>|auto`,
    margin_right: `<length>|<percentage>|auto`,
    margin_bottom: `<length>|<percentage>|auto`,
    margin_left: `<length>|<percentage>|auto`,

    padding: `[<length>|<percentage>|auto]{1,4}`,
    padding_top: `<length>|<percentage>|auto`,
    padding_right: `<length>|<percentage>|auto`,
    padding_bottom: `<length>|<percentage>|auto`,
    padding_left: `<length>|<percentage>|auto`,

    border_width: `[thin|medium|thick|<length>]{1,4}`,
    border_top_width: `thin|medium|thick|<length>`,
    border_right_width: `thin|medium|thick|<length>`,
    border_bottom_width: `thin|medium|thick|<length>`,
    border_left_width: `thin|medium|thick|<length>`,

    border_color: `<color>{1,4}`,
    border_style: `none|dotted|dashed|solid|double|groove|ridge|inset|outset`,

    border_top: `<border_top_width>||<border_style>||<color>`,
    border_right: `<border_right_width>||<border_style>||<color>`,
    border_bottom: `<border_bottom_width>||<border_style>||<color>`,
    border_left: `<border_left_width>||<border_style>||<color>`,

    border: `<border_style>||<color>||<border_width>`,

    width: `<length>|<percentage>|auto|inherit`,
    height: `<length>|<percentage>|auto|inherit`,
    float: `left|right|none`,
    clear: `left|right|both`,

    /* Classification */

    display: `block|inline|list-item|none`,
    white_space: `normal|pre|nowrap`,
    list_style_type: `disc|circle|square|decimal|decimal-leading-zero|lower-roman|upper-roman|lower-greek|lower-latin|upper-latin|armenian|georgian|lower-alpha|upper-alpha|none|inherit`,
    list_style_image: `<url>|none`,
    list_style_position: `inside|outside`,
    list_style: `[disc|circle|square|decimal|lower-roman|upper-roman|lower-alpha|upper-alpha|none]||[inside|outside]||[<url>|none]`,

    //CSS2 Properties

    /* Box */
    min_width: "<length>|<percentage>|inherit",
    max_width: "<length>|<percentage>|none|inherit",
    line_height: "normal|<number>|<length>|<percentage>|inherit",
    vertical_align: "baseline|sub|super|top|text-top|middle|bottom|text-bottom|<percentage>|<length>|inherit",
    overflow: 'visible|hidden|scroll|auto|inherit',

    clip: '<shape>|auto|inherit',

    /* Visual Effects */
    visibility: "visible|hidden|collapse|inherit",
    content: "normal|none|[<string>|<uri>|<counter>|attr(<identifier>)|open-quote|close-quote|no-open-quote|no-close-quote]+|inherit",
    quotas: "[<string><string>]+|none|inherit",
    counter_reset: "[<identifier><integer>?]+|none|inherit",
    counter_increment: "[<identifier><integer>?]+|none|inherit",

    /* Identifier https://drafts.csswg.org/css-values-4/ */
    identifier: "<id>",
    custom_ident: "<id>",


    /* CSS3 Stuff */
    length_percentage: "<length>|<percentage>",
    frequency_percentage: "<frequency>|<percentage>",
    angle_percentage: "<angle>|<percentage>",
    time_percentage: "<time>|<percentage>",
    number_percentage: "<number>|<percentage>",

    /* CSS3 Animation https://drafts.csswg.org/css-animations-1/ */
    animation: "<single_animation>#",

    animation_name: "[none|<keyframes_name>]#",
    animation_duration: "<time>#",
    animation_timing_function: "<timing_function>#",
    animation_iteration_count: "<single_animation_iteration_count>#",
    animation_direction: "<single_animation_direction>#",
    animation_play_state: "<single_animation_play_state>#",
    animation_delayed: "<time>#",
    animation_fill_mode: "<single_animation_fill_mode>#",

    single_animation: "<time>||<timing_function>||<time>||<single_animation_iteration_count>||<single_animation_direction>||<single_animation_fill_mode>||<single_animation_play_state>||[none|<keyframes_name>]",
    keyframes_name: "<string>",
    single_animation_fill_mode: "none|forwards|backwards|both",
    single_animation_play_state: "running|paused",
    single_animation_direction: "normal|reverse|alternate|alternate-reverse",
    single_animation_iteration_count: "infinite|<number>",

    /* https://drafts.csswg.org/css-timing-1/#typedef-timing-function */

    timing_function: "linear|<cubic_bezier_timing_function>|<step_timing_function>|<frames_timing_function>",
    cubic_bezier_timing_function: "<cubic_bezier>",
    step_timing_function: "step-start|step-end|'steps()'",
    frames_timing_function: "'frames()",

    /* https://drafts.csswg.org/css-transitions-1/ */

    transition: "<single_transition>#",
    transition_property: "none|<single_transition_property>#",
    transition_duration: "<time>#",
    transition_timing_function: "<timing_function>#",
    transition_delay: "<time>#",

    single_transition_property: "all|<custom_ident>",
    single_transition: "[none|<single_transition_property>]||<time>||<timing_function>||<time>",
}