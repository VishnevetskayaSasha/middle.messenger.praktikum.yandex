import Handlebars from 'handlebars';
import type { HelperOptions } from 'handlebars';
import type { Block } from './Block';

let uniqueId = 0;

type ComponentClass<Props extends object = object> = {
  componentName: string;
  new (props: Props): Block<Props>;
};

export function registerComponent<Props extends object>(
  Component: ComponentClass<Props>,
) {
  Handlebars.registerHelper(
    Component.componentName,
    function (this: unknown, { hash, data }: HelperOptions) {
      const component = new Component(hash as Props);

      const dataAttribute = `data-component-hbs-id="${++uniqueId}"`;

      if ('ref' in hash) {
        (data.root.__refs = data.root.__refs || {})[hash.ref] =
          component.element();
      }

      (data.root.__children = data.root.__children || []).push({
        component,

        embed(node: DocumentFragment) {
          const placeholder = node.querySelector(`[${dataAttribute}]`);

          if (!placeholder) {
            throw new Error(
              `Can't find placeholder for ${Component.componentName}`,
            );
          }

          const element = component.element();

          if (!element) {
            throw new Error('Component element is not created');
          }

          placeholder.replaceWith(element);
        },
      });

      return new Handlebars.SafeString(`<div ${dataAttribute}></div>`);
    },
  );
}
