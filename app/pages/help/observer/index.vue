<template>
    <HelpPage title="Dashboard" role="Observer"
        description="El dashboard es la pantalla principal del panel del observer. Muestra un resumen de tu actividad: las estaciones que tienes asignadas, tus últimas observaciones registradas y la temperatura media del último año."
        :actions="actions" />
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const actions = [
    {
        icon: '📡',
        title: 'Estaciones asignadas',
        description: 'Indica el número de estaciones meteorológicas que tienes asignadas y en las que puedes registrar observaciones.'
    },
    {
        icon: '🌡',
        title: 'Temperatura media anual',
        description: 'Muestra la media de temperatura de todas tus observaciones registradas en los últimos 365 días.'
    },
    {
        icon: '📋',
        title: 'Últimas observaciones',
        description: 'Tabla con las 10 observaciones más recientes que has registrado, mostrando la estación, temperatura, humedad y fecha.'
    },
]
</script>