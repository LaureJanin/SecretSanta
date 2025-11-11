import { _ as _export_sfc, c as useAuth, a as __nuxt_component_0 } from './server.mjs';
import { useSSRContext, defineComponent, ref, mergeProps, withCtx, createTextVNode } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { useMutation } from '@vue/apollo-composable';
import { useRouter } from 'vue-router';
import { R as REGISTER_MUTATION } from './queries-DeSTm1vV.mjs';
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
  __name: "signup",
  __ssrInlineRender: true,
  setup(__props) {
    const name = ref("");
    const email = ref("");
    const password = ref("");
    const confirmPassword = ref("");
    const errorMsg = ref("");
    const loading = ref(false);
    useRouter();
    useMutation(REGISTER_MUTATION);
    useAuth();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "signup-page" }, _attrs))} data-v-5dbd26e3><div class="signup-container" data-v-5dbd26e3><h1 data-v-5dbd26e3>Cr\xE9er un compte</h1><form class="signup-form" data-v-5dbd26e3><label for="name" data-v-5dbd26e3>Nom complet</label><input id="name" name="name" type="text"${ssrRenderAttr("value", name.value)} required maxlength="100" autocomplete="name" aria-required="true" aria-describedby="name-error" data-v-5dbd26e3><label for="email" data-v-5dbd26e3>Email</label><input id="email" name="email" type="email"${ssrRenderAttr("value", email.value)} required maxlength="255" autocomplete="email" aria-required="true" aria-describedby="email-error" data-v-5dbd26e3><label for="password" data-v-5dbd26e3>Mot de passe</label><input id="password" name="password" type="password"${ssrRenderAttr("value", password.value)} required minlength="6" maxlength="100" autocomplete="new-password" aria-required="true" aria-describedby="password-error" data-v-5dbd26e3><label for="confirmPassword" data-v-5dbd26e3>Confirmer le mot de passe</label><input id="confirmPassword" name="confirmPassword" type="password"${ssrRenderAttr("value", confirmPassword.value)} required minlength="6" maxlength="100" autocomplete="new-password" aria-required="true" aria-describedby="confirm-password-error" data-v-5dbd26e3><button type="submit"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""}${ssrRenderAttr("aria-busy", loading.value)} data-v-5dbd26e3>`);
      if (loading.value) {
        _push(`<span data-v-5dbd26e3>Cr\xE9ation...</span>`);
      } else {
        _push(`<span data-v-5dbd26e3>Cr\xE9er mon compte</span>`);
      }
      _push(`</button>`);
      if (errorMsg.value) {
        _push(`<div id="email-error" class="error-msg" role="alert" data-v-5dbd26e3>${ssrInterpolate(errorMsg.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</form><div class="login-message" data-v-5dbd26e3> Tu as d\xE9j\xE0 un compte <span class="happy-face" data-v-5dbd26e3>\u{1F60A}</span> ? `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/login",
        class: "login-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Connecte-toi !`);
          } else {
            return [
              createTextVNode("Connecte-toi !")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/signup.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const signup = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-5dbd26e3"]]);

export { signup as default };
//# sourceMappingURL=signup-D3zlR6xD.mjs.map
