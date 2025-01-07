<script setup lang="ts">
import {compressionFile, handleImgZoom} from "~/utils/tools";
import { ref, onMounted, watch, toRaw, onUnmounted } from 'vue';

const input = ref('');
const addHistory = ref(true);
const fileList = ref<{
  file: File
  url: string
}[]>([]);
const { openModelSelect } = useGlobalState();

// 在挂载时从本地存储获取 addHistory 值
onMounted(() => {
  addHistory.value = localStorage.getItem('addHistory') === 'true';
});

// 监听 addHistory 的变化并存储到本地
watch(addHistory, () => {
  localStorage.setItem('addHistory', addHistory.value.toString());
});

const p = defineProps<{
  loading: boolean;
  selectedModel: Model;
  handleSend: (input: string, addHistory: boolean, files: {
    file: File;
    url: string;
  }[]) => void;
}>();

// 处理输入事件
function handleInput(e: KeyboardEvent) {
  if (e.shiftKey) {
    input.value += '\n';
  }
  if (e.isComposing || e.shiftKey) {
    return;
  }

  if (input.value.trim() === '') return;
  if (p.loading) return;
  p.handleSend(input.value, addHistory.value, toRaw(fileList.value));
  input.value = '';
  fileList.value = [];
}

const imageType = ['image/png', 'image/jpeg', 'image/webp', 'image/heic', 'image/heif'];

// 检查文件是否符合要求
function checkFile(file: File) {
  if (fileList.value.length >= 5) {
    alert('You can only upload up to 5 images');
    return false;
  }
  if (imageType.indexOf(file.type) === -1) {
    alert(imageType.join(', ') + ' only');
    return false;
  }
  return true;
}

// 处理添加文件
function handleAddFiles() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = imageType.join(',');
  input.multiple = true;
  input.onchange = async () => {
    document.body.style.cursor = 'wait';

    const files = Array.from(input.files || []);
    for (const f of files) {
      if (!checkFile(f)) continue;
      const file = await compressionFile(f, f.type);
      const url = URL.createObjectURL(file);
      fileList.value.push({ file, url });
    }

    document.body.style.cursor = 'auto';
  };
  input.click();
}

// 处理文件粘贴
const handlePaste = (e: ClipboardEvent) => {
  const files = Array.from(e.clipboardData?.files || []);
  files.forEach(file => {
    if (!checkFile(file)) return;

    const url = URL.createObjectURL(file);
    fileList.value.push({ file, url });
  });
};

// 清除文件对象 URL
onUnmounted(() => {
  fileList.value.forEach(i => {
    URL.revokeObjectURL(i.url);
  });
});

// 处理按钮点击，将文本复制到输入框
function handleButtonClick(text: string) {
  input.value = text;
}
</script>

<template>
  <div class="relative">
    <div class="absolute bottom-10 w-full flex flex-col" style="max-width: 33.3333%">
      <UButton class="self-center drop-shadow-xl mb-1 blur-global" color="white" style="display: none;"
               @click="openModelSelect = !openModelSelect">
        {{ selectedModel.name }}
        <template #trailing>
          <UIcon name="i-heroicons-chevron-down-solid"/>
        </template>
      </UButton>

      <ul v-if="selectedModel.type === 'universal'" style="margin: 0" 
          class="flex flex-wrap bg-white dark:bg-[#121212] rounded-t-md">
        <li v-for="file in fileList" :key="file.url" class="relative group/img">
          <button @click="fileList.splice(fileList.indexOf(file), 3)"
                  class="absolute z-10 hidden group-hover/img:block rounded-full bg-neutral-100 right-0 hover:brightness-75 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 16 16">
              <path fill="currentColor"
                    d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94z"/>
            </svg>
          </button>
          <img :src="file.url"
               class="max-h-16 m-1 shadow-xl cursor-pointer group-hover/img:brightness-75 transition-all rounded-md"
               alt="selected image" @click="handleImgZoom($event.target as HTMLImageElement)"/>
        </li>
      </ul>
    </div>

    <div class="flex items-end">
      <UTooltip :text="addHistory ? $t('with_history') : $t('without_history')">
        <UButton class="m-1" @click="addHistory = !addHistory" :color="addHistory ? 'primary' : 'gray'"
                 icon="i-heroicons-clock-solid"/>
      </UTooltip>

      <UTextarea v-model="input" :placeholder="$t('please_input_text') + '...'"
                 @keydown.prevent.enter="handleInput"
                 @paste="handlePaste"
                 autofocus :rows="1" autoresize
                 class="flex-1 max-h-48 overflow-y-auto p-1"
                 readonly
                 />
      <UButton @click="handleInput" :disabled="loading" class="m-1">
        {{ $t('send') }}
      </UButton>
    </div>

    <div class="flex items-end justify-end">
      <UButton color="white" class="m-1" icon="i-arrow-long-left-16-solid"
               @click="handleButtonClick('画一副春天的萌芽：一条小路穿过一片田野，两侧是盛开的油菜花，金黄的花海随风荡漾。小溪蜿蜒而过，岸边长满了新发的青草，几只小鸭子在水中嬉戏。近处是一棵古老的杏树，满树粉白的花瓣如雪般飘落，地上铺了一层花毯。远方是连绵的青山，山间薄雾缭绕。田野中，有农民在播种，象征着新的希望。一切都沐浴在温暖的春光中，生机勃勃，万物复苏。！')">
        假如你是一位画家，探索节气生长的力量，请画出“春天的萌芽”！
      </UButton>
      <UButton color="white" class="m-1" icon="i-arrow-long-left-16-solid"
               @click="handleButtonClick('画一副夏天的繁茂：阳光下的夏日世界：浓密的绿荫覆盖大地，果实累累，稻田与向日葵齐齐映衬，荷花在池塘中盛开，鸟鸣蝉唱不绝于耳，生命的力量在热烈的阳光下无限绽放。')">
        假如你是一位画家，探索节气生长的力量，请画出“夏天的繁茂”！
      </UButton>
    </div>
    <div class="flex items-end justify-end">
      <UButton color="white" class="m-1" icon="i-arrow-long-left-16-solid"
               @click="handleButtonClick('画一副秋天的收获：秋天的田园充满了金黄的色彩：成熟的稻谷、累累的果实、缤纷的落叶交织成一幅丰收的画卷。农民忙碌收割，欢声笑语弥漫在空气中，阳光将每一寸土地都染上了温暖的金色。')">
        假如你是一位画家，探索节气生长的力量，请画出“秋天的收获”！
      </UButton>
       <UButton color="white" class="m-1" icon="i-arrow-long-left-16-solid"
               @click="handleButtonClick('画一副冬天的休眠：冬天的大地沉入宁静，田野被白雪覆盖，树木光秃但坚韧，冰封的湖泊静静矗立，万物在休眠中蓄积力量，为来年的复苏做准备。')">
        假如你是一位画家，探索节气生长的力量，请画出“冬天的休眠“！
      </UButton>
    </div>
 <!--
    <div class="flex items-end justify-end">
      <UButton color="white" class="m-1" icon="i-arrow-long-left-16-solid"
               @click="handleButtonClick('假如你是一位画家，请画出“夏天的繁茂”！')">
        假如你是一位画家，请画出“夏天的繁茂”！
      </UButton>
    </div>

    <div class="flex items-end justify-end">
      <UButton color="white" class="m-1" icon="i-arrow-long-left-16-solid"
               @click="handleButtonClick('假如你是一位画家，请画出“秋天的收获”！')">
        假如你是一位画家，请画出“秋天的收获”！
      </UButton>
    </div>

    <div class="flex items-end justify-end">
      <UButton color="white" class="m-1" icon="i-arrow-long-left-16-solid"
               @click="handleButtonClick('假如你是一位画家，请画出“冬天的休眠“！')">
        假如你是一位画家，请画出“冬天的休眠“！
      </UButton>
    </div>
 -->
  </div>
</template>
