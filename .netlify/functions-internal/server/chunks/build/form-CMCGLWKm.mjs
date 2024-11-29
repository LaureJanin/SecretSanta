import { mergeProps, useSSRContext, ref, computed } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
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

const _sfc_main$3 = {
  __name: "ExclusionRule",
  __ssrInlineRender: true,
  props: {
    participants: {
      type: Array,
      required: true
    },
    exclusionRules: {
      type: Array,
      required: true
    }
  },
  emits: ["addRule"],
  setup(__props, { emit: __emit }) {
    const selectedParticipant = ref("");
    const selectedExclusions = ref([]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ id: "exclusions" }, _attrs))} data-v-38bb712c><h4 data-v-38bb712c>Ajouter des r\xE8gles d&#39;exclusion</h4><div class="form" data-v-38bb712c><select data-v-38bb712c><option disabled value="" data-v-38bb712c${ssrIncludeBooleanAttr(Array.isArray(selectedParticipant.value) ? ssrLooseContain(selectedParticipant.value, "") : ssrLooseEqual(selectedParticipant.value, "")) ? " selected" : ""}>Choisissez un participant</option><!--[-->`);
      ssrRenderList(__props.participants, (p) => {
        _push(`<option${ssrRenderAttr("value", p.name)} data-v-38bb712c${ssrIncludeBooleanAttr(Array.isArray(selectedParticipant.value) ? ssrLooseContain(selectedParticipant.value, p.name) : ssrLooseEqual(selectedParticipant.value, p.name)) ? " selected" : ""}>${ssrInterpolate(p.name)}</option>`);
      });
      _push(`<!--]--></select>`);
      if (selectedParticipant.value) {
        _push(`<div data-v-38bb712c><h5 data-v-38bb712c>Exclusions pour : ${ssrInterpolate(selectedParticipant.value)}</h5><div class="exclusion-list" data-v-38bb712c><!--[-->`);
        ssrRenderList(__props.participants, (p) => {
          _push(`<div class="exclusion-name" data-v-38bb712c><label data-v-38bb712c><input type="checkbox"${ssrRenderAttr("value", p.name)}${ssrIncludeBooleanAttr(Array.isArray(selectedExclusions.value) ? ssrLooseContain(selectedExclusions.value, p.name) : selectedExclusions.value) ? " checked" : ""}${ssrIncludeBooleanAttr(p.name === selectedParticipant.value) ? " disabled" : ""} data-v-38bb712c> ${ssrInterpolate(p.name)}</label></div>`);
        });
        _push(`<!--]--></div><button data-v-38bb712c>Ajouter les exclusions</button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (__props.exclusionRules.length > 0) {
        _push(`<div class="existing-rules" data-v-38bb712c><h3 data-v-38bb712c>Liste des exclusions :</h3><ul data-v-38bb712c><!--[-->`);
        ssrRenderList(__props.exclusionRules, (rule, index) => {
          _push(`<li data-v-38bb712c>${ssrInterpolate(rule.participant)} ne peut pas tirer : <!--[-->`);
          ssrRenderList(rule.exclusions, (excluded) => {
            _push(`<span data-v-38bb712c>${ssrInterpolate(excluded)}</span>`);
          });
          _push(`<!--]--></li>`);
        });
        _push(`<!--]--></ul></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ExclusionRule.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const ExclusionRule = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-38bb712c"]]);
const _sfc_main$2 = {
  __name: "ModaleConfirmation",
  __ssrInlineRender: true,
  props: {
    participants: {
      type: Array,
      required: true
    },
    exclusions: {
      type: Array,
      required: true
    },
    showModal: {
      type: Boolean,
      required: true
    }
  },
  emits: ["confirm", "cancel"],
  setup(__props, { emit: __emit }) {
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.showModal) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "modal-overlay" }, _attrs))} data-v-ddc5359e><div class="modal" data-v-ddc5359e><h4 data-v-ddc5359e>Confirmation du tirage</h4><p data-v-ddc5359e><strong data-v-ddc5359e>Participants :</strong></p><ul data-v-ddc5359e><!--[-->`);
        ssrRenderList(__props.participants, (participant, index) => {
          _push(`<li data-v-ddc5359e>${ssrInterpolate(participant.name)} - ${ssrInterpolate(participant.email)}</li>`);
        });
        _push(`<!--]--></ul>`);
        if (__props.exclusions.length > 0) {
          _push(`<div data-v-ddc5359e><p data-v-ddc5359e><strong data-v-ddc5359e>Exclusions :</strong></p><ul data-v-ddc5359e><!--[-->`);
          ssrRenderList(__props.exclusions, (exclusion, index) => {
            _push(`<li data-v-ddc5359e>${ssrInterpolate(exclusion.participant)} ne peut pas tirer <ul data-v-ddc5359e><!--[-->`);
            ssrRenderList(exclusion.exclusions, (excl, i) => {
              _push(`<li data-v-ddc5359e> - ${ssrInterpolate(excl)}</li>`);
            });
            _push(`<!--]--></ul></li>`);
          });
          _push(`<!--]--></ul></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="buttons" data-v-ddc5359e><button data-v-ddc5359e>Annuler</button><button data-v-ddc5359e>Confirmer</button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ModaleConfirmation.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const ModalConfirmation = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-ddc5359e"]]);
const _sfc_main$1 = {
  __name: "ParticipantForm",
  __ssrInlineRender: true,
  setup(__props) {
    const newParticipant = ref({
      name: "",
      email: ""
    });
    const participants = ref([]);
    const exclusions = ref([]);
    const drawResults = ref([]);
    const showModal = ref(false);
    const exclusionRules = ref([]);
    const validateEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };
    const isFormValid = computed(() => {
      return newParticipant.value.name.trim() !== "" && validateEmail(newParticipant.value.email);
    });
    const addExclusion = (rule) => {
      exclusionRules.value.push(rule);
    };
    const confirmSubmission = async () => {
      try {
        const baseUrl = false ? "http://localhost:3000/api/lottery/draw" : "https://christmaslottery.netlify.app/.netlify/functions/draw";
        const response = await $fetch(baseUrl, {
          method: "POST",
          body: {
            participants: participants.value,
            exclusions: exclusions.value
          }
        });
        drawResults.value = response.results;
        participants.value = [];
        exclusionRules.value = [];
        showModal.value = false;
      } catch (error) {
        console.error("Erreur lors du tirage ou de la sauvegarde :", error);
        alert("Une erreur est survenue lors du tirage ou de la sauvegarde.");
      }
    };
    const cancelSubmission = () => {
      showModal.value = false;
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-f5590cc5><form data-v-f5590cc5><h4 data-v-f5590cc5>Ajouter des participants</h4><div class="form" data-v-f5590cc5><input${ssrRenderAttr("value", newParticipant.value.name)} type="text" placeholder="Pr\xE9nom du participant" data-v-f5590cc5><input${ssrRenderAttr("value", newParticipant.value.email)} type="email" placeholder="Email du participant" data-v-f5590cc5><button${ssrIncludeBooleanAttr(!isFormValid.value) ? " disabled" : ""} data-v-f5590cc5> Ajouter </button></div><ul data-v-f5590cc5><!--[-->`);
      ssrRenderList(participants.value, (participant, index) => {
        _push(`<li data-v-f5590cc5>${ssrInterpolate(participant.name)} - ${ssrInterpolate(participant.email)} <button class="buttonClose" data-v-f5590cc5>\u274C</button></li>`);
      });
      _push(`<!--]--></ul>`);
      _push(ssrRenderComponent(ExclusionRule, {
        participants: participants.value,
        exclusionRules: exclusionRules.value,
        onAddRule: addExclusion
      }, null, _parent));
      _push(`<button class="buttonSubmit" type="button"${ssrIncludeBooleanAttr(participants.value.length < 2) ? " disabled" : ""} data-v-f5590cc5> Go Go Go </button></form>`);
      _push(ssrRenderComponent(ModalConfirmation, {
        participants: participants.value,
        exclusions: exclusionRules.value,
        showModal: showModal.value,
        onConfirm: confirmSubmission,
        onCancel: cancelSubmission
      }, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ParticipantForm.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const ParticipantForm = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-f5590cc5"]]);
const _sfc_main = {
  __name: "form",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "form-page" }, _attrs))}><h1>\u2603\uFE0F Formulaire des participants \u2603\uFE0F</h1>`);
      _push(ssrRenderComponent(ParticipantForm, null, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/form.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=form-CMCGLWKm.mjs.map
