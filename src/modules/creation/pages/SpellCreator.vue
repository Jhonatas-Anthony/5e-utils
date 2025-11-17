<script setup lang="ts">
import { ref, computed, nextTick, watch } from "vue";
import { marked } from "marked";
import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
import { exportSpellToJSON, importSpellFromJSON } from "../utils";
import type { Spell } from "../types";

const spell = ref<Spell>({
  title: "",
  circle: "",
  school: "",
  castingTime: "",
  range: "",
  components: "",
  duration: "",
  description: "",
});

const imageUrl = ref<string | null>(null);
const frontRef = ref<HTMLElement | null>(null);
const backRef = ref<HTMLElement | null>(null);
const descriptionRef = ref<HTMLElement | null>(null);
const overflowWarning = ref(false);
const titleFrontRef = ref<HTMLElement | null>(null);
const titleBackRef = ref<HTMLElement | null>(null);
const renderedMarkdown = computed(() => marked(spell.value.description || ""));

function handleImageUpload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => (imageUrl.value = reader.result as string);
    reader.readAsDataURL(file);
  }
}

function handleExportJSON() {
  exportSpellToJSON(spell.value);
}

function handleImportJSON() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "application/json";
  input.onchange = async () => {
    const file = input.files?.[0];
    if (file) {
      const data = await importSpellFromJSON(file);
      spell.value = data;
    }
  };
  input.click();
}

/* async function renderCardToCanvas(el: HTMLElement) {
  return html2canvas(el, {
    scale: 6,
    useCORS: true,
    backgroundColor: "#f8f5e3",
  });
} */

async function checkOverflow() {
  await nextTick();
  if (!descriptionRef.value || !backRef.value) return;
  const desc = descriptionRef.value;
  overflowWarning.value = desc.scrollHeight > backRef.value.clientHeight - 50;
}

watch(() => spell.value.description, checkOverflow);
watch(renderedMarkdown, checkOverflow);

/* async function handleDownloadPNG() {
  if (!frontRef.value || !backRef.value) return;

  const [frontCanvas, backCanvas] = await Promise.all([
    renderCardToCanvas(frontRef.value),
    renderCardToCanvas(backRef.value),
  ]);

  const combined = document.createElement("canvas");
  const cardWidth = frontCanvas.width;
  const cardHeight = frontCanvas.height;
  combined.width = cardWidth * 2 + 50;
  combined.height = cardHeight;

  const ctx = combined.getContext("2d")!;
  ctx.fillStyle = "#f8f5e3";
  ctx.fillRect(0, 0, combined.width, combined.height);
  ctx.drawImage(frontCanvas, 0, 0);
  ctx.drawImage(backCanvas, cardWidth + 50, 0);

  const link = document.createElement("a");
  link.download = `${spell.value.title || "magia"}.png`;
  link.href = combined.toDataURL("image/png", 1.0);
  link.click();
} */

async function handleDownloadPNG() {
  if (!frontRef.value || !backRef.value) return;

  const scale = 6; // alta resolução
  const spacing = 50 * scale; // ajusta espaço proporcional à escala

  // renderiza as cartas com a mesma escala
  const [frontCanvas, backCanvas] = await Promise.all([
    html2canvas(frontRef.value, {
      scale,
      useCORS: true,
      backgroundColor: "#f8f5e3",
    }),
    html2canvas(backRef.value, {
      scale,
      useCORS: true,
      backgroundColor: "#f8f5e3",
    }),
  ]);

  // usa as dimensões reais renderizadas
  const cardWidth = frontCanvas.width;
  const cardHeight = frontCanvas.height;

  // cria um canvas final proporcional (sem redimensionar)
  const combined = document.createElement("canvas");
  combined.width = cardWidth * 2 + spacing;
  combined.height = cardHeight;

  const ctx = combined.getContext("2d")!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.fillStyle = "#f8f5e3";
  ctx.fillRect(0, 0, combined.width, combined.height);

  // desenha as duas cartas sem distorção
  ctx.drawImage(frontCanvas, 0, 0, cardWidth, cardHeight);
  ctx.drawImage(backCanvas, cardWidth + spacing, 0, cardWidth, cardHeight);

  // exporta com qualidade total (sem conversão base64 intermediária)
  combined.toBlob(
    (blob) => {
      if (!blob) return;
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${spell.value.title || "magia"}.png`;
      link.click();
      URL.revokeObjectURL(link.href);
    },
    "image/png",
    1.0
  );
}


async function autoAdjustFontSize() {
  await nextTick();
  if (!descriptionRef.value) return;

  const desc = descriptionRef.value;
  const wrapper = desc.parentElement as HTMLElement;
  if (!wrapper) return;

  let fontSize = 12;
  let lineHeight = 1.2;

  const applySize = (size: number, lh: number) => {
    desc.style.fontSize = size + "px";
    desc.style.lineHeight = lh.toString();
    desc.querySelectorAll("*").forEach((el) => {
      const elh = el as HTMLElement;
      elh.style.fontSize = size + "px";
      elh.style.lineHeight = lh.toString();
      elh.style.wordWrap = "break-word";
      elh.style.overflowWrap = "break-word";
    });
  };

  applySize(fontSize, lineHeight);
  await nextTick();

  while (desc.scrollHeight > wrapper.clientHeight - 20 && fontSize > 6) {
    fontSize -= 0.4;
    lineHeight = Math.max(1.0, lineHeight - 0.05);
    applySize(fontSize, lineHeight);
    await nextTick();
  }

  overflowWarning.value = desc.scrollHeight > wrapper.clientHeight - 20;
}


/* async function handleDownloadPDF() {
  if (!frontRef.value || !backRef.value) return;

  const [frontCanvas, backCanvas] = await Promise.all([
    renderCardToCanvas(frontRef.value),
    renderCardToCanvas(backRef.value),
  ]);

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [63 * 2 + 10, 88],
  });

  const frontImg = frontCanvas.toDataURL("image/png");
  const backImg = backCanvas.toDataURL("image/png");

  pdf.addImage(frontImg, "PNG", 0, 0, 63, 88);
  pdf.addImage(backImg, "PNG", 63 + 10, 0, 63, 88);

  pdf.save(`${spell.value.title || "magia"}.pdf`);
} */


async function autoAdjustTitleFont() {
  await nextTick();


  const titles = [titleFrontRef.value, titleBackRef.value];
  for (const el of titles) {
    console.log(el)
    if (!el) continue;

    let fontSize = 20;
    el.style.fontSize = fontSize + "px";
    el.style.lineHeight = "1.1";
    el.style.whiteSpace = "normal";
    el.style.overflow = "visible";
    el.style.textOverflow = "clip";

    await nextTick();

    // Reduz fonte até caber na área visível
    const maxHeight = el.clientHeight;
    const maxWidth = el.clientWidth;

    while (
      (el.scrollHeight > maxHeight || el.scrollWidth > maxWidth) &&
      fontSize > 6
    ) {
      fontSize -= 0.4;
      el.style.fontSize = fontSize + "px";
      await nextTick();
    }

    console.log(fontSize)

    // Finaliza com o overflow controlado
    el.style.overflow = "hidden";
  }
}


watch(() => spell.value.title, async () => {
  await nextTick();
  await autoAdjustTitleFont();
});

watch(() => spell.value.description, async () => {
  await autoAdjustFontSize();
  checkOverflow();
});

/* watch(renderedMarkdown, async () => {
  await autoAdjustFontSize();
  checkOverflow();
}); */
</script>

<template>
  <div class="page-container">
    <h1>Criar Magia a</h1>

    <div class="layout">
      <!-- Formulário -->
      <form @submit.prevent class="form-section">
        <div>
          <label>Título:</label>
          <input v-model="spell.title" type="text" />
        </div>

        <div>
          <label>Círculo:</label>
          <input v-model="spell.circle" type="text" />
        </div>

        <div>
          <label>Escola:</label>
          <input v-model="spell.school" type="text" />
        </div>

        <div>
          <label>Tempo de Conjuração:</label>
          <input v-model="spell.castingTime" type="text" />
        </div>

        <div>
          <label>Alcance:</label>
          <input v-model="spell.range" type="text" />
        </div>

        <div>
          <label>Componentes:</label>
          <input v-model="spell.components" type="text" />
        </div>

        <div>
          <label>Duração:</label>
          <input v-model="spell.duration" type="text" />
        </div>

        <div>
          <label>Imagem:</label>
          <input type="file" accept="image/*" @change="handleImageUpload" />
        </div>

        <div>
          <label>Descrição:</label>
          <textarea v-model="spell.description" rows="8"></textarea>
        </div>

        <div v-if="overflowWarning" class="warning">
          ⚠️ A descrição está muito longa e pode não caber na carta.
        </div>

        <div class="actions">
          <button @click="handleExportJSON">Exportar JSON</button>
          <button @click="handleImportJSON">Importar JSON</button>
          <!-- <button @click="handleDownloadPDF">Baixar PDF</button> -->
          <button @click="handleDownloadPNG">Baixar PNG</button>
        </div>
      </form>

      <!-- Preview Frente e Verso -->
      <div class="cards-preview">
        <div ref="frontRef" class="spell-card card-front">
          <h2 ref="titleFrontRef">{{ spell.title || "Nova Magia" }}</h2>

          <div v-if="imageUrl" class="image-container">
            <img :src="imageUrl" alt="Spell Image" />
          </div>

          <div class="info-grid">
            <p><strong>Círculo:</strong> {{ spell.circle }}</p>
            <p><strong>Escola:</strong> {{ spell.school }}</p>
            <p><strong>Tempo de Conjuração:</strong> {{ spell.castingTime }}</p>
            <p><strong>Alcance:</strong> {{ spell.range }}</p>
            <p><strong>Componentes:</strong> {{ spell.components }}</p>
            <p><strong>Duração:</strong> {{ spell.duration }}</p>
          </div>
        </div>

        <div ref="backRef" class="spell-card card-back" :class="{ overflow: overflowWarning }">
          <h2 ref="titleBackRef">{{ spell.title || "Nova Magia" }}</h2>
          <div class="description-wrapper">
            <div ref="descriptionRef" v-html="renderedMarkdown"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="css">
@import "./cards_1.css";
</style>