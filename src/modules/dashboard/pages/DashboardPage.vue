<script setup lang="ts">
import { useI18n } from "vue-i18n";
import changelog from "../changelog.json";

const { t } = useI18n();
const versions = changelog.versions.reverse();
</script>

<template>
    <h1> Bem-vindo </h1>
    <h2>Changelog</h2>
    <div v-for="v in versions" :key="v.version">
        <h2>{{ v.version }} – {{ v.date }}</h2>

        <ul>
            <li v-for="c in v.changes" :key="c.title">
                {{ t(c.title) }} — {{ t(c.description) }}
            </li>
        </ul>
    </div>
</template>