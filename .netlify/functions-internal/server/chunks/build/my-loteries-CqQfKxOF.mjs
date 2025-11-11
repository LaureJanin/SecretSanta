import { _ as __nuxt_component_0 } from './Loader-CVtqSGLx.mjs';
import { useSSRContext, defineComponent, computed, mergeProps, unref } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
import { useQuery } from '@vue/apollo-composable';
import { useRouter } from 'vue-router';
import { c as ME_QUERY, d as MY_LOTERIES_QUERY } from './queries-DeSTm1vV.mjs';
import { _ as _export_sfc, c as useAuth } from './server.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "my-loteries",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    const { requireAuth } = useAuth();
    requireAuth();
    const { result: meResult } = useQuery(ME_QUERY);
    const { result, loading, error, refetch } = useQuery(MY_LOTERIES_QUERY);
    const loteries = computed(() => {
      var _a;
      return ((_a = result.value) == null ? void 0 : _a.myLotteries) || [];
    });
    const userEmail = computed(() => {
      var _a, _b;
      return ((_b = (_a = meResult.value) == null ? void 0 : _a.me) == null ? void 0 : _b.email) || "";
    });
    function isOwner(loterie) {
      var _a, _b, _c;
      return ((_a = loterie.owner) == null ? void 0 : _a.id) === ((_c = (_b = meResult.value) == null ? void 0 : _b.me) == null ? void 0 : _c.id);
    }
    function getMyDraw(loterie) {
      var _a;
      if (!loterie.draws || loterie.draws.length === 0) return void 0;
      if (!userEmail.value) return void 0;
      return (_a = loterie.draws) == null ? void 0 : _a.find((draw) => {
        var _a2;
        return compareEmails((_a2 = draw.giver) == null ? void 0 : _a2.email, userEmail.value);
      });
    }
    function getMyDrawGiftIdeas(loterie) {
      var _a;
      const draw = getMyDraw(loterie);
      return ((_a = draw == null ? void 0 : draw.receiver) == null ? void 0 : _a.giftIdeas) || [];
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_Loader = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "my-loteries-page" }, _attrs))} data-v-e60a6563><h1 data-v-e60a6563>Mes loteries</h1>`);
      if (unref(loading)) {
        _push(ssrRenderComponent(_component_Loader, null, null, _parent));
      } else if (unref(error)) {
        _push(`<div class="error" data-v-e60a6563>Erreur: ${ssrInterpolate(((_a = unref(error)) == null ? void 0 : _a.message) || "Une erreur est survenue")}</div>`);
      } else {
        _push(`<div data-v-e60a6563>`);
        if (loteries.value.length === 0) {
          _push(`<div class="no-loterie" data-v-e60a6563> Aucune loterie trouv\xE9e.<br data-v-e60a6563><button class="btn-create" data-v-e60a6563>Cr\xE9er ta premi\xE8re loterie de No\xEBl</button></div>`);
        } else {
          _push(`<div data-v-e60a6563><div class="btn-create-container" data-v-e60a6563><button class="btn-create" data-v-e60a6563>Cr\xE9er une loterie</button></div><div class="loteries-container" data-v-e60a6563><!--[-->`);
          ssrRenderList(loteries.value, (loterie) => {
            var _a2, _b;
            _push(`<div class="loterie-card" data-v-e60a6563><div class="loterie-header" data-v-e60a6563><h2 data-v-e60a6563>${ssrInterpolate(loterie.name)}</h2>`);
            if (isOwner(loterie)) {
              _push(`<div class="admin-link" data-v-e60a6563><button class="btn-admin" data-v-e60a6563>\u2699\uFE0F G\xE9rer cette loterie</button></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div><p class="desc" data-v-e60a6563>Ann\xE9e : ${ssrInterpolate(loterie.year)}</p><div class="loterie-info" data-v-e60a6563>`);
            if (isOwner(loterie)) {
              _push(`<span class="info-badge owner" data-v-e60a6563>\u{1F451} Organisateur</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<span class="info-badge" data-v-e60a6563>\u{1F465} ${ssrInterpolate(loterie.participants.length)} participant(s)</span>`);
            if (loterie.draws && loterie.draws.length > 0) {
              _push(`<span class="info-badge success" data-v-e60a6563>\u2705 Tirage effectu\xE9</span>`);
            } else {
              _push(`<span class="info-badge warning" data-v-e60a6563>\u23F3 Tirage non effectu\xE9</span>`);
            }
            _push(`</div>`);
            if (getMyDraw(loterie)) {
              _push(`<div class="draw-result" data-v-e60a6563><div class="draw-header" data-v-e60a6563><h3 data-v-e60a6563>\u{1F3AF} Votre mission de No\xEBl</h3></div><div class="receiver-info" data-v-e60a6563><p class="receiver-name" data-v-e60a6563>Vous offrez un cadeau \xE0 : <strong data-v-e60a6563>${ssrInterpolate((_b = (_a2 = getMyDraw(loterie)) == null ? void 0 : _a2.receiver) == null ? void 0 : _b.name)}</strong></p>`);
              if (getMyDrawGiftIdeas(loterie).length > 0) {
                _push(`<div class="gift-ideas-section" data-v-e60a6563><h4 data-v-e60a6563>\u{1F381} Ses id\xE9es cadeaux :</h4><div class="gift-ideas-list" data-v-e60a6563><!--[-->`);
                ssrRenderList(getMyDrawGiftIdeas(loterie), (idea) => {
                  _push(`<div class="gift-idea-item" data-v-e60a6563><div class="gift-idea-content" data-v-e60a6563><h5 data-v-e60a6563>${ssrInterpolate(idea.title)}</h5>`);
                  if (idea.description) {
                    _push(`<p class="gift-idea-description" data-v-e60a6563>${ssrInterpolate(idea.description)}</p>`);
                  } else {
                    _push(`<!---->`);
                  }
                  if (idea.link) {
                    _push(`<a${ssrRenderAttr("href", idea.link)} target="_blank" rel="noopener noreferrer" class="gift-idea-link" data-v-e60a6563>\u{1F517} Voir le lien</a>`);
                  } else {
                    _push(`<!---->`);
                  }
                  _push(`</div></div>`);
                });
                _push(`<!--]--></div></div>`);
              } else {
                _push(`<div class="no-gift-ideas" data-v-e60a6563><p data-v-e60a6563>Cette personne n&#39;a pas encore ajout\xE9 d&#39;id\xE9es cadeaux.</p></div>`);
              }
              _push(`</div></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          });
          _push(`<!--]--></div></div>`);
        }
        _push(`</div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/my-loteries.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const myLoteries = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-e60a6563"]]);

export { myLoteries as default };
//# sourceMappingURL=my-loteries-CqQfKxOF.mjs.map
