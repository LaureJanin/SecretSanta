import { _ as __nuxt_component_0 } from './Loader-CVtqSGLx.mjs';
import { useSSRContext, defineComponent, ref, computed, mergeProps, unref } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { useQuery, useMutation } from '@vue/apollo-composable';
import { c as ME_QUERY, d as MY_LOTERIES_QUERY, e as ADD_GIFT_IDEA_MUTATION, f as DELETE_GIFT_IDEA_MUTATION } from './queries-DeSTm1vV.mjs';
import { _ as _export_sfc, c as useAuth, u as useToast, b as useConfirm } from './server.mjs';
import { c as compareEmails } from './email-DLVNwuQm.mjs';
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
import 'vue-router';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "gift-ideas",
  __ssrInlineRender: true,
  setup(__props) {
    const { requireAuth } = useAuth();
    useToast();
    useConfirm();
    requireAuth();
    const { result: meResult } = useQuery(ME_QUERY);
    const { result, loading, error, refetch } = useQuery(MY_LOTERIES_QUERY);
    useMutation(ADD_GIFT_IDEA_MUTATION);
    useMutation(DELETE_GIFT_IDEA_MUTATION);
    const newIdea = ref({ title: "", description: "", link: "" });
    const userEmail = computed(() => {
      var _a, _b;
      return ((_b = (_a = meResult.value) == null ? void 0 : _a.me) == null ? void 0 : _b.email) || "";
    });
    const myLotteries = computed(() => {
      var _a;
      return ((_a = result.value) == null ? void 0 : _a.myLotteries) || [];
    });
    function getMyParticipant(lottery) {
      var _a;
      if (!userEmail.value) return void 0;
      return (_a = lottery.participants) == null ? void 0 : _a.find((p) => compareEmails(p.email, userEmail.value));
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_Loader = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "gift-ideas-page" }, _attrs))} data-v-87e38ff5><div class="header" data-v-87e38ff5><h1 data-v-87e38ff5>\u{1F381} Mes id\xE9es cadeaux</h1></div>`);
      if (unref(loading)) {
        _push(ssrRenderComponent(_component_Loader, null, null, _parent));
      } else if (unref(error)) {
        _push(`<div class="error" data-v-87e38ff5>Erreur: ${ssrInterpolate((_a = unref(error)) == null ? void 0 : _a.message)}</div>`);
      } else {
        _push(`<div data-v-87e38ff5><div class="intro" data-v-87e38ff5><p data-v-87e38ff5>Aide tes proches \xE0 trouver le cadeau parfait ! Ajoute tes id\xE9es de cadeaux pour que ton P\xE8re No\xEBl secret sache ce qui te ferait plaisir.</p></div>`);
        if (myLotteries.value.length === 0) {
          _push(`<div class="no-lotteries" data-v-87e38ff5><p data-v-87e38ff5>Tu ne participes \xE0 aucune loterie pour le moment.</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--[-->`);
        ssrRenderList(myLotteries.value, (lottery) => {
          var _a2, _b, _c;
          _push(`<div class="lottery-section card" data-v-87e38ff5><h2 data-v-87e38ff5>${ssrInterpolate(lottery.name)} (${ssrInterpolate(lottery.year)})</h2>`);
          if (!getMyParticipant(lottery)) {
            _push(`<div class="no-participant" data-v-87e38ff5><p data-v-87e38ff5>Vous n&#39;\xEAtes pas participant dans cette loterie.</p></div>`);
          } else {
            _push(`<!---->`);
          }
          if (getMyParticipant(lottery)) {
            _push(`<div class="my-ideas" data-v-87e38ff5><h3 data-v-87e38ff5>Mes id\xE9es de cadeaux</h3>`);
            if ((_b = (_a2 = getMyParticipant(lottery)) == null ? void 0 : _a2.giftIdeas) == null ? void 0 : _b.length) {
              _push(`<div class="ideas-list" data-v-87e38ff5><!--[-->`);
              ssrRenderList((_c = getMyParticipant(lottery)) == null ? void 0 : _c.giftIdeas, (idea) => {
                _push(`<div class="idea-card" data-v-87e38ff5><div class="idea-content" data-v-87e38ff5><h4 data-v-87e38ff5>${ssrInterpolate(idea.title)}</h4>`);
                if (idea.description) {
                  _push(`<p data-v-87e38ff5>${ssrInterpolate(idea.description)}</p>`);
                } else {
                  _push(`<!---->`);
                }
                if (idea.link) {
                  _push(`<a${ssrRenderAttr("href", idea.link)} target="_blank" rel="noopener noreferrer" class="idea-link" data-v-87e38ff5>\u{1F517} Voir le lien</a>`);
                } else {
                  _push(`<!---->`);
                }
                _push(`</div><button class="btn-delete" title="Supprimer" data-v-87e38ff5>\u{1F5D1}\uFE0F</button></div>`);
              });
              _push(`<!--]--></div>`);
            } else {
              _push(`<div class="no-ideas" data-v-87e38ff5> Aucune id\xE9e cadeau pour le moment. Ajoute-en une ci-dessous ! \u{1F447} </div>`);
            }
            _push(`<div class="add-idea-form" data-v-87e38ff5><h4 data-v-87e38ff5>\u2795 Ajouter une id\xE9e</h4><form data-v-87e38ff5><div class="form-group" data-v-87e38ff5><label data-v-87e38ff5>Titre *</label><input${ssrRenderAttr("value", newIdea.value.title)} type="text" required placeholder="Ex: Un livre, un jeu vid\xE9o..." maxlength="200" aria-required="true" data-v-87e38ff5></div><div class="form-group" data-v-87e38ff5><label data-v-87e38ff5>Description</label><textarea placeholder="Pr\xE9cisions, genre pr\xE9f\xE9r\xE9, taille..." rows="3" maxlength="1000" data-v-87e38ff5>${ssrInterpolate(newIdea.value.description)}</textarea></div><div class="form-group" data-v-87e38ff5><label data-v-87e38ff5>Lien (optionnel)</label><input${ssrRenderAttr("value", newIdea.value.link)} type="url" placeholder="https://..." maxlength="500" data-v-87e38ff5></div><button type="submit"${ssrIncludeBooleanAttr(!newIdea.value.title) ? " disabled" : ""} data-v-87e38ff5>Ajouter cette id\xE9e</button></form></div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/gift-ideas.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const giftIdeas = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-87e38ff5"]]);

export { giftIdeas as default };
//# sourceMappingURL=gift-ideas-BfF5ZAh8.mjs.map
