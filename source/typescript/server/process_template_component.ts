import { ComponentData, PresetOptions } from '../types/all';

export async function processTemplateComponent(
    component: ComponentData,
    presets: PresetOptions
) {

    if (component.TEMPLATE) {

        let data = presets.template_data.get(component);

        for (const template_data of data) {

            if (!template_data.page_name)
                component.root_frame.ast.pos.throw(
                    "Expected [page_name] for template",
                    component.location.toString()
                );

            presets.active_template_data = template_data;

            const { USE_RADIATE_RUNTIME: A, USE_WICK_RUNTIME: B }
                = await buildComponentPage(component, presets, template_data.page_name, output_directory);

            presets.active_template_data = null;

            USE_RADIATE_RUNTIME ||= A;
            USE_WICK_RUNTIME ||= B;
        }
    }
}