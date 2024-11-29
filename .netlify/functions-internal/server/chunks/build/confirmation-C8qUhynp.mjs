import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs } from 'vue/server-renderer';
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

const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "confirmation" }, _attrs))} data-v-168c0087><h1 data-v-168c0087>Tirage au sort effectu\xE9 \u{1F389}</h1><p data-v-168c0087> Les participants recevront un message WhatsApp avec le nom de la personne \xE0 qui ils doivent offrir un cadeau. Merci d&#39;avoir utilis\xE9 notre service\u202F! </p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/confirmation.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const confirmation = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-168c0087"]]);

export { confirmation as default };
//# sourceMappingURL=confirmation-C8qUhynp.mjs.map
