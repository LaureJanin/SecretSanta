import { _ as __nuxt_component_0 } from './Loader-CVtqSGLx.mjs';
import { useSSRContext, defineComponent, computed, ref, mergeProps, unref } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr, ssrRenderClass } from 'vue/server-renderer';
import { useQuery, useMutation } from '@vue/apollo-composable';
import { useRouter } from 'vue-router';
import { _ as _export_sfc, u as useToast, b as useConfirm, c as useAuth } from './server.mjs';
import { M as MY_OWNED_LOTTERIES_QUERY, A as ADD_PARTICIPANT_MUTATION, a as ADD_EXCLUSION_MUTATION, D as DELETE_EXCLUSION_MUTATION, P as PERFORM_DRAW_MUTATION, S as SEND_DRAW_RESULTS_MUTATION, b as DELETE_LOTTERY_MUTATION } from './queries-DeSTm1vV.mjs';
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
  __name: "admin",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    useToast();
    useConfirm();
    const { requireAuth } = useAuth();
    requireAuth();
    const { result, loading, error, refetch } = useQuery(MY_OWNED_LOTTERIES_QUERY);
    const loteries = computed(() => {
      var _a;
      return ((_a = result.value) == null ? void 0 : _a.myOwnedLotteries) || [];
    });
    const selectedLotteryId = ref("");
    const activeTab = ref("participants");
    const showAddParticipantForm = ref(false);
    const showAddExclusionForm = ref(false);
    const newParticipant = ref({ name: "", email: "", isActive: true });
    const newExclusion = ref({ participantId: "", excludedId: "" });
    const performingDraw = ref(false);
    const sendingResults = ref(false);
    const drawResult = ref(null);
    const drawResultsResult = ref(null);
    const selectedLottery = computed(() => {
      return loteries.value.find((l) => l.id === selectedLotteryId.value);
    });
    const activeParticipants = computed(() => {
      var _a, _b;
      return ((_b = (_a = selectedLottery.value) == null ? void 0 : _a.participants) == null ? void 0 : _b.filter((p) => p.isActive)) || [];
    });
    const hasDrawBeenDone = computed(() => {
      var _a;
      return ((_a = selectedLottery.value) == null ? void 0 : _a.draws) && selectedLottery.value.draws.length > 0;
    });
    useMutation(ADD_PARTICIPANT_MUTATION);
    useMutation(ADD_EXCLUSION_MUTATION);
    useMutation(DELETE_EXCLUSION_MUTATION);
    useMutation(PERFORM_DRAW_MUTATION);
    useMutation(SEND_DRAW_RESULTS_MUTATION);
    useMutation(DELETE_LOTTERY_MUTATION);
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_Loader = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "admin-page" }, _attrs))} data-v-a0a5a61b><h1 data-v-a0a5a61b>\u{1F385} Administration des loteries</h1>`);
      if (unref(loading)) {
        _push(ssrRenderComponent(_component_Loader, null, null, _parent));
      } else if (unref(error)) {
        _push(`<div class="error" data-v-a0a5a61b>${ssrInterpolate(unref(error).message)}</div>`);
      } else if (loteries.value.length === 0) {
        _push(`<div class="no-loterie" data-v-a0a5a61b><p data-v-a0a5a61b>Vous n&#39;avez cr\xE9\xE9 aucune loterie.</p><button class="btn-primary" data-v-a0a5a61b>Cr\xE9er une loterie</button></div>`);
      } else {
        _push(`<div data-v-a0a5a61b><div class="lottery-selector" data-v-a0a5a61b><label for="lotterySelect" data-v-a0a5a61b>S\xE9lectionner une loterie :</label><select id="lotterySelect" data-v-a0a5a61b><option value="" data-v-a0a5a61b${ssrIncludeBooleanAttr(Array.isArray(selectedLotteryId.value) ? ssrLooseContain(selectedLotteryId.value, "") : ssrLooseEqual(selectedLotteryId.value, "")) ? " selected" : ""}>-- Choisir une loterie --</option><!--[-->`);
        ssrRenderList(loteries.value, (lot) => {
          _push(`<option${ssrRenderAttr("value", lot.id)} data-v-a0a5a61b${ssrIncludeBooleanAttr(Array.isArray(selectedLotteryId.value) ? ssrLooseContain(selectedLotteryId.value, lot.id) : ssrLooseEqual(selectedLotteryId.value, lot.id)) ? " selected" : ""}>${ssrInterpolate(lot.name)} (${ssrInterpolate(lot.year)}) </option>`);
        });
        _push(`<!--]--></select></div>`);
        if (selectedLottery.value) {
          _push(`<div class="lottery-details" data-v-a0a5a61b><div class="lottery-header" data-v-a0a5a61b><div class="lottery-header-top" data-v-a0a5a61b><h2 data-v-a0a5a61b>${ssrInterpolate(selectedLottery.value.name)} - ${ssrInterpolate(selectedLottery.value.year)}</h2><button class="btn-delete-lottery" title="Supprimer la loterie" data-v-a0a5a61b>\u{1F5D1}\uFE0F</button></div><div class="lottery-stats" data-v-a0a5a61b><span class="stat-badge" data-v-a0a5a61b>\u{1F465} ${ssrInterpolate(selectedLottery.value.participants.length)} participants</span>`);
          if (hasDrawBeenDone.value) {
            _push(`<span class="stat-badge success" data-v-a0a5a61b>\u2705 Tirage effectu\xE9</span>`);
          } else {
            _push(`<span class="stat-badge warning" data-v-a0a5a61b>\u23F3 Tirage non effectu\xE9</span>`);
          }
          _push(`</div></div><div class="tabs" data-v-a0a5a61b><button class="${ssrRenderClass(["tab", { active: activeTab.value === "participants" }])}" data-v-a0a5a61b> \u{1F465} Participants </button><button class="${ssrRenderClass(["tab", { active: activeTab.value === "exclusions" }])}" data-v-a0a5a61b> \u{1F6AB} Exclusions </button><button class="${ssrRenderClass(["tab", { active: activeTab.value === "actions" }])}" data-v-a0a5a61b> \u2699\uFE0F Actions </button></div><div class="tab-content" data-v-a0a5a61b>`);
          if (activeTab.value === "participants") {
            _push(`<div class="participants-section" data-v-a0a5a61b><div class="section-header" data-v-a0a5a61b><h3 data-v-a0a5a61b>Gestion des participants</h3><button class="btn-add" data-v-a0a5a61b>${ssrInterpolate(showAddParticipantForm.value ? "\u2716 Annuler" : "\u2795 Ajouter un participant")}</button></div>`);
            if (showAddParticipantForm.value) {
              _push(`<div class="add-participant-form card" data-v-a0a5a61b><h4 data-v-a0a5a61b>Nouveau participant</h4><form data-v-a0a5a61b><div class="form-row" data-v-a0a5a61b><div class="form-group" data-v-a0a5a61b><label data-v-a0a5a61b>Nom *</label><input${ssrRenderAttr("value", newParticipant.value.name)} type="text" required placeholder="Pr\xE9nom Nom" maxlength="100" aria-required="true" data-v-a0a5a61b></div><div class="form-group" data-v-a0a5a61b><label data-v-a0a5a61b>Email</label><input${ssrRenderAttr("value", newParticipant.value.email)} type="email" placeholder="email@example.com" maxlength="255" autocomplete="email" data-v-a0a5a61b></div></div><button type="submit"${ssrIncludeBooleanAttr(!newParticipant.value.name) ? " disabled" : ""} class="btn-primary" data-v-a0a5a61b>Ajouter</button></form></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<div class="participants-list" data-v-a0a5a61b><!--[-->`);
            ssrRenderList(selectedLottery.value.participants, (participant) => {
              var _a2;
              _push(`<div class="participant-card" data-v-a0a5a61b><div class="participant-info" data-v-a0a5a61b><h4 data-v-a0a5a61b>${ssrInterpolate(participant.name)}</h4>`);
              if (participant.email) {
                _push(`<p class="email" data-v-a0a5a61b>\u{1F4E7} ${ssrInterpolate(participant.email)}</p>`);
              } else {
                _push(`<!---->`);
              }
              if (participant.isActive) {
                _push(`<span class="badge active" data-v-a0a5a61b>\u2705 Actif</span>`);
              } else {
                _push(`<span class="badge inactive" data-v-a0a5a61b>\u{1F476} Enfant</span>`);
              }
              _push(`</div><div class="participant-actions" data-v-a0a5a61b><span class="gift-count" data-v-a0a5a61b>\u{1F381} ${ssrInterpolate(((_a2 = participant.giftIdeas) == null ? void 0 : _a2.length) || 0)} id\xE9e(s)</span></div></div>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (activeTab.value === "exclusions") {
            _push(`<div class="exclusions-section" data-v-a0a5a61b><div class="section-header" data-v-a0a5a61b><h3 data-v-a0a5a61b>R\xE8gles d&#39;exclusion</h3><button class="btn-add" data-v-a0a5a61b>${ssrInterpolate(showAddExclusionForm.value ? "\u2716 Annuler" : "\u2795 Ajouter une exclusion")}</button></div>`);
            if (showAddExclusionForm.value) {
              _push(`<div class="add-exclusion-form card" data-v-a0a5a61b><h4 data-v-a0a5a61b>Nouvelle exclusion</h4><form data-v-a0a5a61b><div class="form-row" data-v-a0a5a61b><div class="form-group" data-v-a0a5a61b><label data-v-a0a5a61b>Participant</label><select required data-v-a0a5a61b><option value="" data-v-a0a5a61b${ssrIncludeBooleanAttr(Array.isArray(newExclusion.value.participantId) ? ssrLooseContain(newExclusion.value.participantId, "") : ssrLooseEqual(newExclusion.value.participantId, "")) ? " selected" : ""}>-- Choisir --</option><!--[-->`);
              ssrRenderList(activeParticipants.value, (p) => {
                _push(`<option${ssrRenderAttr("value", p.id)} data-v-a0a5a61b${ssrIncludeBooleanAttr(Array.isArray(newExclusion.value.participantId) ? ssrLooseContain(newExclusion.value.participantId, p.id) : ssrLooseEqual(newExclusion.value.participantId, p.id)) ? " selected" : ""}>${ssrInterpolate(p.name)}</option>`);
              });
              _push(`<!--]--></select></div><div class="form-group" data-v-a0a5a61b><label data-v-a0a5a61b>Ne peut pas tirer</label><select required data-v-a0a5a61b><option value="" data-v-a0a5a61b${ssrIncludeBooleanAttr(Array.isArray(newExclusion.value.excludedId) ? ssrLooseContain(newExclusion.value.excludedId, "") : ssrLooseEqual(newExclusion.value.excludedId, "")) ? " selected" : ""}>-- Choisir --</option><!--[-->`);
              ssrRenderList(activeParticipants.value, (p) => {
                _push(`<option${ssrRenderAttr("value", p.id)}${ssrIncludeBooleanAttr(p.id === newExclusion.value.participantId) ? " disabled" : ""} data-v-a0a5a61b${ssrIncludeBooleanAttr(Array.isArray(newExclusion.value.excludedId) ? ssrLooseContain(newExclusion.value.excludedId, p.id) : ssrLooseEqual(newExclusion.value.excludedId, p.id)) ? " selected" : ""}>${ssrInterpolate(p.name)}</option>`);
              });
              _push(`<!--]--></select></div></div><button type="submit"${ssrIncludeBooleanAttr(!newExclusion.value.participantId || !newExclusion.value.excludedId) ? " disabled" : ""} class="btn-primary" data-v-a0a5a61b> Ajouter l&#39;exclusion </button></form></div>`);
            } else {
              _push(`<!---->`);
            }
            if (selectedLottery.value.exclusions && selectedLottery.value.exclusions.length > 0) {
              _push(`<div class="exclusions-list" data-v-a0a5a61b><!--[-->`);
              ssrRenderList(selectedLottery.value.exclusions, (exclusion) => {
                _push(`<div class="exclusion-item" data-v-a0a5a61b><span class="exclusion-text" data-v-a0a5a61b><strong data-v-a0a5a61b>${ssrInterpolate(exclusion.participant.name)}</strong> ne peut pas tirer <strong data-v-a0a5a61b>${ssrInterpolate(exclusion.excluded.name)}</strong></span><button class="btn-delete-exclusion" title="Supprimer cette exclusion" data-v-a0a5a61b> \u{1F5D1}\uFE0F </button></div>`);
              });
              _push(`<!--]--></div>`);
            } else {
              _push(`<div class="no-data" data-v-a0a5a61b> Aucune exclusion d\xE9finie. </div>`);
            }
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          if (activeTab.value === "actions") {
            _push(`<div class="actions-section" data-v-a0a5a61b><h3 data-v-a0a5a61b>Actions administrateur</h3><div class="action-cards" data-v-a0a5a61b><div class="action-card" data-v-a0a5a61b><h4 data-v-a0a5a61b>\u{1F3B2} Effectuer le tirage au sort</h4><p data-v-a0a5a61b>Lance le tirage au sort en respectant les exclusions.</p><button${ssrIncludeBooleanAttr(performingDraw.value || activeParticipants.value.length < 2) ? " disabled" : ""} class="btn-warning" data-v-a0a5a61b>${ssrInterpolate(performingDraw.value ? "Tirage en cours..." : "Lancer le tirage")}</button>`);
            if (activeParticipants.value.length < 2) {
              _push(`<p class="warning-text" data-v-a0a5a61b> \u26A0\uFE0F Il faut au moins 2 participants actifs </p>`);
            } else {
              _push(`<!---->`);
            }
            if (drawResult.value) {
              _push(`<div class="result-message success" data-v-a0a5a61b> \u2705 Tirage effectu\xE9 avec succ\xE8s ! </div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div><div class="action-card" data-v-a0a5a61b><h4 data-v-a0a5a61b>\u{1F381} Envoyer les r\xE9sultats du tirage</h4><p data-v-a0a5a61b>Envoie un email \xE0 chaque participant avec le nom de la personne qu&#39;il doit g\xE2ter.</p><button${ssrIncludeBooleanAttr(sendingResults.value || !hasDrawBeenDone.value) ? " disabled" : ""} class="btn-warning" data-v-a0a5a61b>${ssrInterpolate(sendingResults.value ? "Envoi en cours..." : "Envoyer les r\xE9sultats")}</button>`);
            if (!hasDrawBeenDone.value) {
              _push(`<p class="warning-text" data-v-a0a5a61b> \u26A0\uFE0F Le tirage doit \xEAtre effectu\xE9 d&#39;abord </p>`);
            } else {
              _push(`<!---->`);
            }
            if (drawResultsResult.value) {
              _push(`<div class="${ssrRenderClass([drawResultsResult.value.success ? "success" : "error", "result-message"])}" data-v-a0a5a61b>${ssrInterpolate(drawResultsResult.value.success ? `\u2705 Email(s) envoy\xE9(s) avec succ\xE8s` : `\u274C Erreur: ${((_a = drawResultsResult.value.errors) == null ? void 0 : _a.join(", ")) || "Erreur inconnue"}`)}</div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const admin = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-a0a5a61b"]]);

export { admin as default };
//# sourceMappingURL=admin-CgmLlzYX.mjs.map
