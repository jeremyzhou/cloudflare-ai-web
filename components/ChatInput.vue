<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted, toRaw } from 'vue';
import { compressionFile, handleImgZoom } from "~/utils/tools";
import { useGlobalState } from '~/path/to/useGlobalState'; // 根据实际路径调整

const input = ref('')
const addHistory = ref(true)
const fileList = ref<{
  file: File
  url: string
}[]>([])
const { openModelSelect } = useGlobalState()

onMounted(() => {
  addHistory.value = localStorage.getItem('addHistory') === 'true'
})

watch(addHistory, () => {
  localStorage.setItem('addHistory', addHistory.value.toString())
})

const p = defineProps<{
  loading: boolean
  selectedModel: Model

  handleSend: (input: string, addHistory: boolean, files: {
    file: File
    url: string
  }[]) => void
}>()

function handleInput(e: KeyboardEvent) {
  if (e.shiftKey) {
    input.value += '\n'
  }
  if (e.isComposing || e.shiftKey) {
    return
  }

  if (input.value.trim() === '') return
  if (p.loading) return
  p.handleSend(input.value, addHistory.value, toRaw(fileList.value))
  input.value = ''
  fileList.value = []
}

const imageType = ['image/png', 'image/jpeg', 'image/webp', 'image/heic', 'image/heif']

function checkFile(file: File) {
  if (fileList.value.length >= 5) {
    alert('一次最多上传 5 张图片')
    return false
  }
  if (imageType.indexOf(file.type) === -1) {
    alert('仅支持以下格式：' + imageType.join(', '))
    return false
  }
  return true
}

function handleAddFiles() {
  const inputElement = document.createElement('input')
  inputElement.type = 'file'
  inputElement.accept = imageType.join(',')
  inputElement.multiple = true
  inputElement.onchange = async () => {
    document.body.style.cursor = 'wait'

    const files = Array.from(inputElement.files || [])
    for (const f of files) {
      if (!checkFile(f)) continue;
      const file = await compressionFile(f, f.type)
      const url = URL.createObjectURL(file)
      fileList.value.push({ file, url })
    }

    document.body.style.cursor = 'auto'
  }
  inputElement.click()
}

onUnmounted(() => {
  fileList.value.forEach(i => {
    URL.revokeObjectURL(i.url)
  })
})

const handlePaste = (e: ClipboardEvent) => {
  const files = Array.from(e.clipboardData?.files || [])
  files.forEach(file => {
    if (!checkFile(file)) return

    const url = URL.createObjectURL(file)
    fileList.value.push({ file, url })
  })
}

// 添加 handleButtonClick 函数
function handleButtonClick(text: string) {
  input.value = text;
}
</script>

<template>
  <div class="relative">
    <div class="absolute bottom-10 w-full flex flex-col">
      <!-- 您现有的代码 -->
    </div>
    <div class="flex items-end">
      <UTooltip :text="addHistory?$t('with_history'):$t('without_history')">
        <UButton class="m-1" @click="addHistory = !addHistory" :color="addHistory?'primary':'gray'"
                 icon="i-heroicons-clock-solid"/>
      </UTooltip>
      <UTooltip v-if="selectedModel.type === 'universal'" :text="$t('add_image') + '(' + $t('support_paste') + ')'" >
        <UButton @click="handleAddFiles" color="white" class="m-1" icon="i-heroicons-paper-clip-16-solid"/>
      </UTooltip>
      <UTextarea v-model="input" :placeholder="$t('please_input_text') + '...'"
                 @keydown.prevent.enter="handleInput($event)"
                 @paste="handlePaste"
                 autofocus :rows="1" autoresize
                 class="flex-1 max-h-48 overflow-y-auto p-1"
                 readonly />
      <UButton @click="handleInput($event)" :disabled="loading" class="m-1">
        {{ $t('send') }}
      </UButton>
    </div>
    <div class="flex items-end">
      <UButton color="white" class="m-1" icon="i-arrow-long-left-16-solid"
               @click="handleButtonClick('你是一个专业的医生，请解释这张化验单上异常指标，并简单分析！')">
        你是一个专业的医生，请解释这张化验单上异常指标，并简单分析！
      </UButton>
    </div>
    <div class="flex items-end">
      <UButton color="white" class="m-1" icon="i-arrow-long-left-16-solid"
               @click="handleButtonClick('你是一个专业的医生，请解释这个药的用途，并简单讲述如何使用！')">
        你是一个专业的医生，请解释这个药的用途，并简单讲述如何使用！
      </UButton>
    </div>
    <div class="flex items-end">
      <UButton color="white" class="m-1" icon="i-arrow-long-left-16-solid"
               @click="handleButtonClick('你是一个专业的医生，如果我感冒咳嗽，该如何治疗！')">
        你是一个专业的医生，如果我感冒咳嗽，该如何治疗！
      </UButton>
      <UButton color="white" class="m-1" icon="i-arrow-long-left-16-solid"
               @click="handleButtonClick('你是一个专业的医生，如果我发烧干咳，该如何治疗！')">
        你是一个专业的医生，如果我发烧干咳，该如何治疗！
      </UButton>
      <UButton color="white" class="m-1" icon="i-arrow-long-left-16-solid"
               @click="handleButtonClick('你是一个专业的医生，如果我拉肚子，该如何治疗！')">
        你是一个专业的医生，如果我拉肚子，该如何治疗！
      </UButton>
    </div>
  </div>
</template>
