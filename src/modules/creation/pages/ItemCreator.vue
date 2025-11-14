<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { marked } from 'marked'
import html2canvas from 'html2canvas'
import { exportItemToJSON, importItemFromJSON } from '../utils'
import type { Item } from '../types'

const item = ref<Item>({
  title: '',
  damage: '',
  properties: '',
  description: '',
})

const imageUrl = ref<string | null>(null)
const frontRef = ref<HTMLElement | null>(null)
const backRef = ref<HTMLElement | null>(null)
const descriptionRef = ref<HTMLElement | null>(null)
const overflowWarning = ref(false)
const titleFrontRef = ref<HTMLElement | null>(null)
const titleBackRef = ref<HTMLElement | null>(null)
const renderedMarkdown = computed(() => marked(item.value.description || ''))

function handleImageUpload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => (imageUrl.value = reader.result as string)
    reader.readAsDataURL(file)
  }
}

function handleExportJSON() {
  exportItemToJSON(item.value)
}

function handleImportJSON() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'application/json'
  input.onchange = async () => {
    const file = input.files?.[0]
    if (file) {
      const data = await importItemFromJSON(file)
      item.value = data
    }
  }
  input.click()
}

async function handleDownloadPNG() {
  if (!frontRef.value || !backRef.value) return

  const scale = 6
  const spacing = 50 * scale

  const [frontCanvas, backCanvas] = await Promise.all([
    html2canvas(frontRef.value, {
      scale,
      useCORS: true,
      backgroundColor: '#f8f5e3',
    }),
    html2canvas(backRef.value, {
      scale,
      useCORS: true,
      backgroundColor: '#f8f5e3',
    }),
  ])

  const cardWidth = frontCanvas.width
  const cardHeight = frontCanvas.height

  const combined = document.createElement('canvas')
  combined.width = cardWidth * 2 + spacing
  combined.height = cardHeight

  const ctx = combined.getContext('2d')!
  ctx.fillStyle = '#f8f5e3'
  ctx.fillRect(0, 0, combined.width, combined.height)

  ctx.drawImage(frontCanvas, 0, 0)
  ctx.drawImage(backCanvas, cardWidth + spacing, 0)

  combined.toBlob(
    (blob) => {
      if (!blob) return
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `${item.value.title || 'item'}.png`
      link.click()
    },
    'image/png',
    1.0,
  )
}

async function autoAdjustFontSize() {
  await nextTick()
  if (!descriptionRef.value) return

  const desc = descriptionRef.value
  const wrapper = desc.parentElement as HTMLElement
  if (!wrapper) return

  let fontSize = 12
  let lineHeight = 1.2

  const applySize = (size: number, lh: number) => {
    desc.style.fontSize = size + 'px'
    desc.style.lineHeight = lh.toString()
    desc.querySelectorAll('*').forEach((el) => {
      const elh = el as HTMLElement
      elh.style.fontSize = size + 'px'
      elh.style.lineHeight = lh.toString()
    })
  }

  applySize(fontSize, lineHeight)
  await nextTick()

  while (desc.scrollHeight > wrapper.clientHeight - 20 && fontSize > 6) {
    fontSize -= 0.4
    lineHeight -= 0.05
    applySize(fontSize, lineHeight)
    await nextTick()
  }

  overflowWarning.value = desc.scrollHeight > wrapper.clientHeight - 20
}

async function checkOverflow() {
  await nextTick()
  if (!descriptionRef.value || !backRef.value) return
  overflowWarning.value = descriptionRef.value.scrollHeight > backRef.value.clientHeight - 50
}

async function autoAdjustTitleFont() {
  await nextTick()

  const titles = [titleFrontRef.value, titleBackRef.value]
  for (const el of titles) {
    if (!el) continue

    let fontSize = 20
    el.style.fontSize = fontSize + 'px'

    await nextTick()

    const maxH = el.clientHeight
    const maxW = el.clientWidth

    while ((el.scrollHeight > maxH || el.scrollWidth > maxW) && fontSize > 6) {
      fontSize -= 0.4
      el.style.fontSize = fontSize + 'px'
      await nextTick()
    }
  }
}

watch(() => item.value.title, autoAdjustTitleFont)
watch(
  () => item.value.description,
  async () => {
    await autoAdjustFontSize()
    checkOverflow()
  },
)
</script>

<template>
  <div class="page-container">
    <h1>Criar Item</h1>

    <div class="layout">
      <!-- Formulário -->
      <form @submit.prevent class="form-section">
        <div>
          <label>Nome:</label>
          <input v-model="item.title" type="text" />
        </div>

        <div>
          <label>Dano:</label>
          <input v-model="item.damage" type="text" />
        </div>

        <div>
          <label>Propriedades:</label>
          <input v-model="item.properties" type="text" />
        </div>

        <div>
          <label>Imagem:</label>
          <input type="file" accept="image/*" @change="handleImageUpload" />
        </div>

        <div>
          <label>Descrição (Markdown):</label>
          <textarea v-model="item.description" rows="8"></textarea>
        </div>

        <div v-if="overflowWarning" class="warning">
          ⚠️ A descrição está muito longa e pode não caber na carta.
        </div>

        <div class="actions">
          <button @click="handleExportJSON">Exportar JSON</button>
          <button @click="handleImportJSON">Importar JSON</button>
          <button @click="handleDownloadPNG">Baixar PNG</button>
        </div>
      </form>

      <!-- Preview Frente e Verso -->
      <div class="cards-preview">
        <!-- Frente -->
        <div ref="frontRef" class="spell-card card-front">
          <h2 ref="titleFrontRef">{{ item.title || 'Novo Item' }}</h2>

          <div v-if="imageUrl" class="image-container">
            <img :src="imageUrl" alt="Item Image" />
          </div>

          <div class="info-grid">
            <p><strong>Dano:</strong> {{ item.damage }}</p>
            <p><strong>Propriedades:</strong> {{ item.properties }}</p>
          </div>
        </div>

        <!-- Verso -->
        <div ref="backRef" class="spell-card card-back" :class="{ overflow: overflowWarning }">
          <h2 ref="titleBackRef">{{ item.title || 'Novo Item' }}</h2>
          <div class="description-wrapper">
            <div ref="descriptionRef" v-html="renderedMarkdown"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
}

.layout {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 24px;
  align-items: start;
}

.cards-preview {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  justify-content: center;
}

.warning {
  color: #b00000;
  font-weight: bold;
  background: #ffe5e5;
  padding: 6px 10px;
  border: 1px solid #b00000;
  border-radius: 4px;
  margin-top: 10px;
  font-size: 13px;
}

/* proporção 63x88mm = 1:1.396 */
.spell-card {
  width: 252px;
  height: calc(252px * 1.396);
  background: #f8f5e3;
  border: 2px solid #a88b5f;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  padding: 10px;
  font-family: "Book Antiqua", "Times New Roman", serif;
  color: #222;
  overflow: hidden;
}

.spell-card.overflow {
  border: 3px solid red;
}

.spell-card h2 {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 40px;
  /* define o espaço reservado */
  text-align: center;
  font-weight: bold;
  text-transform: uppercase;
  border-bottom: 2px solid #a88b5f;
  margin-bottom: 8px;
  padding: 0 4px;
  line-height: 1.1;
  overflow: hidden;
  white-space: normal;
  text-overflow: clip;
  word-break: break-word;
}

/* ======================
   FRENTE DA CARTA
====================== */
.card-front {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 8px;
}

/* Imagem com tamanho fixo e proporção estável */
.card-front .image-container {
  width: 100%;
  height: 200px;
  /* Toma boa parte da carta, mas deixa espaço pro texto */
  border: 1px solid #a88b5f;
  border-radius: 4px;
  overflow: hidden;
  background: #e6dcc0;
  box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.2);
}

.card-front .image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* Ajusta a imagem sem distorcer */
  object-position: center;
}

/* Grid para os atributos da magia */
.card-front .info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px 10px;
  font-size: 12px;
  margin-top: 4px;
}

.card-front .info-grid p {
  margin: 0;
  line-height: 1.3;
  text-align: left;
}

/* Opcional: destaca os títulos dos campos */
.card-front .info-grid strong {
  color: #5a4525;
}

.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  overflow: hidden;
  margin-bottom: 8px;
}

.image-container img {
  max-height: 100%;
  max-width: 100%;
  object-fit: cover;
}

.spell-card p {
  font-size: 12px;
  margin: 2px 0;
}

.spell-card div {
  font-size: 12px;
  line-height: 1.3;
}

.card-back .description-wrapper {
  box-sizing: border-box;
  text-align: justify;
  padding: 8px;
  padding-bottom: 16px;
  height: calc(100% - 48px);
  box-sizing: border-box;
  overflow: hidden;
}

.card-back ::v-deep(*) {
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
}

.card-back ::v-deep(p) {
  font-size: 16px;
  line-height: 1.2;
  margin: 0 0 4px 0;
}
</style>
