import { SourcePackage } from "./package"

/**
 * This function's role is to construct a SourcePackage given a template, the global presets, and, optionally, a working HTMLElement to serve as a source of. 
 * This will return SourcePackage can be used to bind an HTMLElement and an optional Model to a set of new Sources. 
 *    
 * @param      {external:HTMLElement} Template  The template
 * @param      {Presets} presets   The presets
 * @param      {DOMElement} WORKING_DOM - Should include any other templates that need to be rolled in. 
 * @return     {SourcePackage}  SourcePackage can be used to bind an HTMLElement and an optional Model to a generated of Sources.
 */

export const SourceConstructor = (Template, Presets, WORKING_DOM) => new SourcePackage(Template, Presets, WORKING_DOM);