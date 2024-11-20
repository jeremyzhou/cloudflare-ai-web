<script setup lang="ts">
import {uniModals,textGenModels,imageGenModels} from "~/utils/db";

const {t} = useI18n()
const {selectedModel, openModelSelect} = useGlobalState()
onMounted(() => {
  const model = localStorage.getItem('selectedModel')
  selectedModel.value = models.find(i => i.id === model) || imageGenModels[0]
})
watch(selectedModel, v => {
  localStorage.setItem('selectedModel', v.id)
})

const groups = computed(() => [
  {
    key: 'universal',
    label: t('universal'),
    commands: uniModals.map(i => ({
      id: i.id,
      label: i.name
    }))
  }, {
    key: 'text generation',
    label: t('text_generation'),
    commands: textGenModels.map(i => ({
      id: i.id,
      label: i.name
    }))
  }, {
    key: 'text to image',
    label: t('text-to-image'),
    commands: imageGenModels.map(i => ({
      id: i.id,
      label: i.name
    }))
  }])

function onSelect(option: { id: string }) {
  selectedModel.value = models.find(i => i.id === option.id) || imageGenModels[0]
}
</script>

<template>
  <UModal v-model="openModelSelect">
    <UCommandPalette @update:model-value="onSelect" :groups="groups" :model-value="selectedModel"/>
  </UModal>
</template>
