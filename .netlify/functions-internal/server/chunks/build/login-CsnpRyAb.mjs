import { _ as _export_sfc, c as useAuth, a as __nuxt_component_0 } from './server.mjs';
import { useSSRContext, defineComponent, ref, mergeProps, withCtx, createTextVNode } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { useMutation } from '@vue/apollo-composable';
import { useRouter } from 'vue-router';
import { L as LOGIN_MUTATION } from './queries-DeSTm1vV.mjs';
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
import '@apollo/client/core/index.js';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    const email = ref("");
    const password = ref("");
    const errorMsg = ref("");
    const loading = ref(false);
    useRouter();
    useMutation(LOGIN_MUTATION);
    useAuth();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "login-page" }, _attrs))} data-v-30719467><div class="signup-container" data-v-30719467><h1 data-v-30719467>Connexion</h1><form class="login-form" data-v-30719467><label for="email" data-v-30719467>Email</label><input id="email" name="email" type="email"${ssrRenderAttr("value", email.value)} required maxlength="255" autocomplete="email" aria-required="true" aria-describedby="email-error" data-v-30719467><label for="password" data-v-30719467>Mot de passe</label><input id="password" name="password" type="password"${ssrRenderAttr("value", password.value)} required maxlength="100" autocomplete="current-password" aria-required="true" aria-describedby="password-error" data-v-30719467><button type="submit"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""}${ssrRenderAttr("aria-busy", loading.value)} data-v-30719467>`);
      if (loading.value) {
        _push(`<span data-v-30719467>Connexion...</span>`);
      } else {
        _push(`<span data-v-30719467>Se connecter</span>`);
      }
      _push(`</button>`);
      if (errorMsg.value) {
        _push(`<div id="email-error" class="error-msg" role="alert" data-v-30719467>${ssrInterpolate(errorMsg.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</form><div class="login-message" data-v-30719467> Tu n&#39;as pas de compte <span class="sad-face" data-v-30719467>\u{1F622}</span> ? `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/signup",
        class: "login-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Cr\xE9e-toi en un !`);
          } else {
            return [
              createTextVNode("Cr\xE9e-toi en un !")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const login = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-30719467"]]);

export { login as default };
//# sourceMappingURL=login-CsnpRyAb.mjs.map
