<template>
  <div>
    <h1>Criar Magia</h1>

    <!-- Formulário -->
    <form @submit.prevent>
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
        <label>Descrição (Markdown):</label>
        <textarea v-model="spell.description" rows="8"></textarea>
      </div>
    </form>

    <!-- Ações -->
    <div>
      <button @click="handleExportJSON">Exportar JSON</button>
      <button @click="handleImportJSON">Importar JSON</button>
      <button @click="handleDownloadPDF">Baixar PDF</button>
      <button @click="handleDownloadPNG">Baixar PNG</button>
    </div>

    <hr />

    <!-- Preview -->
    <div ref="previewRef">
      <h2>{{ spell.title }}</h2>
      <p><strong>Círculo:</strong> {{ spell.circle }}</p>
      <p><strong>Escola:</strong> {{ spell.school }}</p>
      <p><strong>Tempo de Conjuração:</strong> {{ spell.castingTime }}</p>
      <p><strong>Alcance:</strong> {{ spell.range }}</p>
      <p><strong>Componentes:</strong> {{ spell.components }}</p>
      <p><strong>Duração:</strong> {{ spell.duration }}</p>
      <div v-html="renderedMarkdown"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { exportSpellToJSON, importSpellFromJSON } from "../utils";
import type { Spell } from "../types";
import { marked } from "marked";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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

const previewRef = ref<HTMLElement | null>(null);
const renderedMarkdown = computed(() => marked(spell.value.description || ""));

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

async function handleDownloadPDF() {
  if (!previewRef.value) return;
  const canvas = await html2canvas(previewRef.value);
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  const width = pdf.internal.pageSize.getWidth();
  const height = (canvas.height * width) / canvas.width;
  pdf.addImage(imgData, "PNG", 0, 0, width, height);
  pdf.save(`${spell.value.title || "magia"}.pdf`);
}

async function handleDownloadPNG() {
  if (!previewRef.value) return;
  const canvas = await html2canvas(previewRef.value);
  const link = document.createElement("a");
  link.download = `${spell.value.title || "magia"}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}
</script>
