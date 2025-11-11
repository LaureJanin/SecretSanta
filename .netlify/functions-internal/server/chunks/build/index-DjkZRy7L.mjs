import { _ as _export_sfc, a as __nuxt_component_0 } from './server.mjs';
import { mergeProps, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
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
    const items = [
      "Un Jouet en plastique",
      "Des puces de lit",
      "Une \xC9toile de mer",
      "Un truc gnangnan et rose \xE0 paillettes",
      "Des chaussettes moches",
      "Un Secret malaisant",
      "Un plein d'essence",
      "Un abonnement \xE0 vie \xE0 MyLittlePoney.tv"
    ];
    const repeatedItems = [...items, ...items];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "home-page" }, _attrs))} data-v-176a72eb><div class="home-intro" data-v-176a72eb><span class="emoji" data-v-176a72eb>\u{1F385}</span><h2 data-v-176a72eb>OH OH OH \u{1F384} C&#39;est bient\xF4t No\xEBl\u202F!</h2><p data-v-176a72eb>Est-ce que tu aimes <span class="red" data-v-176a72eb>RECEVOIR</span> des cadeaux ?</p><p data-v-176a72eb>Est-ce que tu aimes <span class="red" data-v-176a72eb>FAIRE</span> des cadeaux ?</p><p data-v-176a72eb> Est-ce que tu as \xE9t\xE9 bien sage ?</p><p data-v-176a72eb>Vraiment ?</p><p data-v-176a72eb>Mouais... Bon... Admettons.</p></div><h3 data-v-176a72eb>As-tu d\xE9j\xE0 fait ta liste pour Santa ?</h3><div class="lottery-container" data-v-176a72eb><div class="lottery-wheel" data-v-176a72eb><!--[-->`);
      ssrRenderList(repeatedItems, (item) => {
        _push(`<p class="lottery-item" data-v-176a72eb> \u{1F381} ${ssrInterpolate(item)}</p>`);
      });
      _push(`<!--]--></div></div><h3 data-v-176a72eb>Et toi que vas-tu offrir ?</h3><p data-v-176a72eb>Pour r\xE9pondre \xE0 ces questions, clique \u{1F447}.</p><div class="action-buttons" data-v-176a72eb>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/signup" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<button class="btn-signup" data-v-176a72eb${_scopeId}>Cr\xE9er un compte</button>`);
          } else {
            return [
              createVNode("button", { class: "btn-signup" }, "Cr\xE9er un compte")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/login" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<button class="btn-login" data-v-176a72eb${_scopeId}>Se connecter</button>`);
          } else {
            return [
              createVNode("button", { class: "btn-login" }, "Se connecter")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-176a72eb"]]);

export { index as default };
//# sourceMappingURL=index-DjkZRy7L.mjs.map
