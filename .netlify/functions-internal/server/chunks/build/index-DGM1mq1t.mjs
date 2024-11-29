import { resolveComponent, mergeProps, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'vue-router';

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const items = ["Un Jouet en plastique", "Des puces de lit", "Un iPad inutile", "Une 'Surprise'", "Une \xC9toile de mer", "Un truc gnangnan et rose \xE0 paillettes", "Des chaussettes moches", "Un Secret de famille"];
    const repeatedItems = [...items, ...items];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(`<div${ssrRenderAttrs(mergeProps({ id: "home" }, _attrs))} data-v-a051fa51><div data-v-a051fa51> \u{1F385} OH OH OH \u{1F384} C&#39;est bient\xF4t No\xEBl\u202F! <br data-v-a051fa51> Est ce que tu as d\xE9j\xE0 \xE9crit ta liste au p\xE8re No\xEBl ? <br data-v-a051fa51> Est ce que tu as \xE9t\xE9 bien sage ? <br data-v-a051fa51> Vraiment ? <br data-v-a051fa51> Mouais... Bon. Admettons </div><h1 data-v-a051fa51>Super Loterie de No\xEBl</h1><div class="lottery-container" data-v-a051fa51><div class="lottery-wheel" data-v-a051fa51><!--[-->`);
      ssrRenderList(repeatedItems, (item) => {
        _push(`<div class="lottery-item" data-v-a051fa51> \u{1F381} ${ssrInterpolate(item)}</div>`);
      });
      _push(`<!--]--></div></div>`);
      _push(ssrRenderComponent(_component_router_link, { to: "/form" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<button data-v-a051fa51${_scopeId}>Commencer</button>`);
          } else {
            return [
              createVNode("button", null, "Commencer")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-a051fa51"]]);

export { index as default };
//# sourceMappingURL=index-DGM1mq1t.mjs.map
