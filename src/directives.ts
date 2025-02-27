import { type DirectiveBinding, type VNode } from 'vue';

interface ClickOutsideHTMLElement extends HTMLElement {
  clickOutsideEvent: (event: MouseEvent) => void;
}

const customDirectives = [
  {
    name: 'click-outside',
    hooks: {
      beforeMount(el: ClickOutsideHTMLElement, binding: DirectiveBinding, _vnode: VNode) {
        el.clickOutsideEvent = function (event: MouseEvent) {
          if (!(el == event.target || el.contains(event.target as Node))) {
            binding.value();
          }
        };
        document.body.addEventListener('click', el.clickOutsideEvent);
      },
      unmounted(el: ClickOutsideHTMLElement) {
        document.body.removeEventListener('click', el.clickOutsideEvent);
      }
    }
  }
];

export default customDirectives;
