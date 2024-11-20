import {createGlobalState} from "@vueuse/shared"
import {ref} from "vue"
import {imageGenModels} from "./db"

export const useGlobalState = createGlobalState(() => {
    const openModelSelect = ref(false)
    const passModal = ref(false)
    const openAside = ref(false)
    const openSettings = ref(false)
    const selectedModel = ref(imageGenModels[2])

    return {
        openModelSelect,
        passModal,
        openAside,
        openSettings,
        selectedModel
    }
})
