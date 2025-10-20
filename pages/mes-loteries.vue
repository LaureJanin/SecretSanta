<template>
  <div class="mes-loteries-page">
    <h1>Mes loteries</h1>
    <div v-if="loading" class="loading">Chargement...</div>
    <div v-else>
      <div v-if="loteries.length === 0" class="no-loterie">
        Aucune loterie trouvée.<br>
        <button class="btn-create" @click="router.push('/form')">Créer ta première loterie de Noël</button>
      </div>
      <div v-else>
        <button class="btn-create" style="margin-bottom:2rem" @click="router.push('/form')">Créer une loterie</button>
        <div v-for="loterie in loteries" :key="loterie.id" class="loterie-card">
          <h2>{{ loterie.name }}</h2>
          <p class="desc">Année : {{ loterie.year }}</p>
          <div class="tirage-section">
            <h3>Tu as tiré au sort :</h3>
            <div v-if="getDrawForMe(loterie)">
              <strong>{{ getDrawForMe(loterie).receiver.name }}</strong>
              <div v-if="getDrawForMe(loterie).receiver.giftIdeas.length">
                <span>Ses idées de cadeaux :</span>
                <ul>
                  <li v-for="cadeau in getDrawForMe(loterie).receiver.giftIdeas" :key="cadeau.id">{{ cadeau.title }}<span v-if="cadeau.description"> : {{ cadeau.description }}</span></li>
                </ul>
              </div>
              <div v-else>Aucune idée de cadeau renseignée.</div>
            </div>
            <div v-else>Le tirage n'a pas encore eu lieu ou tu n'es pas dans la liste.</div>
          </div>
          <div class="mes-cadeaux-section">
            <h3>Mes idées de cadeaux :</h3>
            <ul v-if="getMeInLoterie(loterie)?.giftIdeas?.length">
              <li v-for="cadeau in getMeInLoterie(loterie).giftIdeas" :key="cadeau.id">{{ cadeau.title }}<span v-if="cadeau.description"> : {{ cadeau.description }}</span></li>
            </ul>
            <div v-else>Tu n'as pas encore renseigné d'idées de cadeaux.</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { MES_LOTERIES_QUERY } from '~/graphql/queries'
import { useRouter } from 'vue-router'
import type { Participant, Draw, Loterie } from '~/types/loterie'

const router = useRouter()
const loteries = ref<Loterie[]>([])
const token = ref('')
const userId = ref('')
const loading = ref(true)
const error = ref(null)
let queryResult: ReturnType<typeof useQuery> | null = null

onMounted(() => {
  token.value = localStorage.getItem('token') || ''
  userId.value = localStorage.getItem('userId') || ''
  if (!token.value) {
    router.push('/login')
    return
  }
  queryResult = useQuery(MES_LOTERIES_QUERY)
  loading.value = queryResult.loading.value
  error.value = queryResult.error?.value
  watch(queryResult.result, (res) => {
    loteries.value = res?.myLotteries || []
    loading.value = false
  })
})

function getMeInLoterie(loterie: Loterie): Participant | undefined {
  return loterie.participants.find((p: Participant) => p.id === userId.value)
}

function getDrawForMe(loterie: Loterie): Draw | undefined {
  if (!userId.value || !loterie.draws) return undefined
  return loterie.draws.find((draw: Draw) => draw.giver.id === userId.value)
}
</script>

<style scoped>
.mes-loteries-page {
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem 1rem 3rem 1rem;
}
h1 {
  text-align: center;
  color: #1ca463;
  margin-bottom: 2rem;
  font-family: 'Montserrat', 'Arial', sans-serif;
  text-shadow: 1px 1px 2px #2e2519;
}
.loterie-card {
  background: rgba(255,255,255,0.97);
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(44, 62, 80, 0.08);
  margin-bottom: 2rem;
  padding: 1.5rem 1.2rem;
}
.desc {
  color: #6b7a8f;
  font-size: 1rem;
  margin-bottom: 1rem;
}
.tirage-section, .mes-cadeaux-section {
  margin-bottom: 1.2rem;
}
h2 {
  color: #1ca463;
  margin-bottom: 0.5rem;
  font-family: 'Montserrat', 'Arial', sans-serif;
}
h3 {
  color: #1ca463;
  font-size: 1.1rem;
  margin-bottom: 0.3rem;
  font-family: 'Montserrat', 'Arial', sans-serif;
}
ul {
  margin: 0.3rem 0 0.7rem 1.2rem;
}
.loading {
  text-align: center;
  color: #888;
}
.no-loterie {
  text-align: center;
  color: #d32f2f;
  font-size: 1.1rem;
  margin-top: 2rem;
}
.btn-create {
  margin-top: 1.2rem;
  background: #1ca463;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.7rem 1.4rem;
  font-size: 1.08rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(44, 62, 80, 0.08);
  transition: background 0.2s;
}
.btn-create:hover {
  background: #178a52;
}
@media (max-width: 600px) {
  .mes-loteries-page {
    padding: 1rem 0.2rem 2rem 0.2rem;
  }
  .loterie-card {
    padding: 1rem 0.3rem;
  }
}
</style>
