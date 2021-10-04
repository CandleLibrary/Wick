import { Logger } from '@candlelib/log';
import { traverseFilesFromRoot } from "@candlelib/paraffin";
import URI from '@candlelib/uri';
import { ComponentData } from '../entry-point/wick-full.js';
import wick from '../entry-point/wick-server.js';
import { rt } from '../runtime/global.js';
import { PresetOptions } from '../types/all.js';

function IsEntryComponent(uri: URI): {
	IS_ENTRY_COMPONENT: boolean;
	output_name?: string;
} {
	if (uri.filename.slice(0, 5) == "page_") {
		if (uri.filename == "page_home")
			return {
				IS_ENTRY_COMPONENT: true,
				output_name: "root"
			};

		return {
			IS_ENTRY_COMPONENT: true,
			output_name: uri.filename.slice(5)
		};

	}

	return {
		IS_ENTRY_COMPONENT: false
	};
}
export async function loadComponentsFromDirectory(
	working_directory: URI,
	presets: PresetOptions = rt.presets,
	/**
	 * A function that can be used to determine
	 * weather a component file should be used
	 * as an entry point for a compiled page.
	 */
	page_criteria: (uri: URI) => {
		IS_ENTRY_COMPONENT: boolean;
		/**
		 * A file path and name to give to the
		 * output component.
		 */
		output_name?: string;
	} = IsEntryComponent): Promise<{
		/**
		 * A mapping from an endpoint to a component and its (optional) associated
		 * template data.
		 */
		endpoints: Map<string, { comp: ComponentData; template_data?: any; }>;
		/**
		 * A mapping from a local component path to a set of endpoints
		 */
		page_components: Map<string, { endpoints: string[]; }>;
		/**
		 * A mapping of all component file paths to their respective components
		 */
		components: Map<string, { comp: ComponentData; }>;
	}> {

	const endpoints: Map<string, { comp: ComponentData; template_data?: any; }> = new Map();
	const page_components = new Map();
	const components = new Map();

	//Find all wick files and compile them into components. 
	for await (const file_uri of traverseFilesFromRoot(
		working_directory, {
		directory_evaluator_function: (uri) => {

			const dir_name = uri.path.split("/").pop();

			//Skip linux "hidden" directories
			if (dir_name[0] == ".")
				return false;

			//Skip package repo folders
			if (dir_name == "node_modules")
				return false;

			return true;
		}
	})) {
		if (["wick"].includes(file_uri.ext.toLowerCase())) {

			const file_path = file_uri + "";

			const { IS_ENTRY_COMPONENT, output_name } = page_criteria(file_uri);

			if (IS_ENTRY_COMPONENT) {

				try {

					const comp: ComponentData = await wick(file_uri, presets);

					const endpoints_strings = [];

					if (comp.TEMPLATE) {
						let i = 0;
						for (const data of presets.active_template_data(comp)) {
							if (data.endpoint) {
								endpoints.set(data.endpoint, { comp, template_data: data });
								endpoints_strings.push(data.endpoint);
							} else {
								Logger
									.get("wick")
									.get("build")
									.warn(
										`Could not create endpoint for template (${file_path})[${i}].\nMissing endpoint string attribute in template data`,
										data
									);
							}
							i++;
						}
					} else {
						endpoints.set(output_name, { comp });
						endpoints_strings.push(output_name);
					}

					page_components.set(file_path, { endpoints: endpoints_strings });

				} catch (e) {

					Logger
						.get("wick")
						.get("build")
						.error(file_path);

					Logger
						.get("wick")
						.get("build")
						.error(e);

					return {
						endpoints: null,
						page_components: null,
						components: null
					};
				}
			}
		}
	};

	for (const [, comp] of presets.components)
		components.set(comp.location + "", comp);

	return {
		endpoints,
		page_components,
		components
	};
}
