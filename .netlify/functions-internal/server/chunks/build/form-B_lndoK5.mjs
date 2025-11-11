import { useSSRContext, defineComponent, ref, computed, mergeProps } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrIncludeBooleanAttr, ssrInterpolate } from 'vue/server-renderer';
import { useMutation } from '@vue/apollo-composable';
import { useRouter } from 'vue-router';
import { C as CREATE_LOTTERY_MUTATION } from './queries-DeSTm1vV.mjs';
import { _ as _export_sfc, c as useAuth, u as useToast } from './server.mjs';
import '@apollo/client/core/index.js';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "form",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    const { requireAuth } = useAuth();
    useToast();
    requireAuth();
    const lotteryName = ref("");
    const lotteryYear = ref((/* @__PURE__ */ new Date()).getFullYear());
    const loading = ref(false);
    useMutation(CREATE_LOTTERY_MUTATION);
    const isFormValid = computed(() => {
      return lotteryName.value.trim().length > 0 && lotteryYear.value >= (/* @__PURE__ */ new Date()).getFullYear();
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "form-page" }, _attrs))} data-v-e49dea7c><h1 data-v-e49dea7c>\u{1F384} Cr\xE9er une nouvelle loterie \u{1F384}</h1><div class="form-container" data-v-e49dea7c><form class="lottery-form" data-v-e49dea7c><div class="form-section" data-v-e49dea7c><h2 data-v-e49dea7c>Donnez un titre \xE0 votre loterie</h2><div class="form-group" data-v-e49dea7c><label for="lotteryName" data-v-e49dea7c>Nom de la loterie *</label><input id="lotteryName"${ssrRenderAttr("value", lotteryName.value)} type="text" placeholder="Ex: Loterie de No\xEBl Famille Dupont" required maxlength="100" aria-required="true" data-v-e49dea7c></div><div class="form-group" data-v-e49dea7c><label for="lotteryYear" data-v-e49dea7c>Ann\xE9e *</label><input id="lotteryYear"${ssrRenderAttr("value", lotteryYear.value)} type="number"${ssrRenderAttr("min", (/* @__PURE__ */ new Date()).getFullYear())}${ssrRenderAttr("max", (/* @__PURE__ */ new Date()).getFullYear() + 5)} required data-v-e49dea7c></div></div><div class="form-actions" data-v-e49dea7c><button type="submit"${ssrIncludeBooleanAttr(loading.value || !isFormValid.value) ? " disabled" : ""} class="btn-primary" data-v-e49dea7c>${ssrInterpolate(loading.value ? "Cr\xE9ation en cours..." : "Cr\xE9er la loterie")}</button><button type="button" class="btn-secondary" data-v-e49dea7c> Annuler </button></div></form></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/form.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const form = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-e49dea7c"]]);

export { form as default };
//# sourceMappingURL=form-B_lndoK5.mjs.map
