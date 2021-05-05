/**
 * Generated using theia-extension-generator
 */
import { MarkingElements } from './assistance-contribution';
import { ContainerModule } from 'inversify';
import { FrontendApplicationContribution } from '@theia/core/lib/browser/frontend-application';

export default new ContainerModule((bind) => {
  // add your contribution bindings here
  bind(FrontendApplicationContribution).to(MarkingElements);
});
