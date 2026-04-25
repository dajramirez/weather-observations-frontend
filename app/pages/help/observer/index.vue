<template>
    <HelpPage title="Dashboard" role="Observer"
        description="El dashboard es la pantalla principal del panel del observador. Muestra un resumen de tu actividad, las estaciones que tienes asignadas y tus últimas observaciones registradas."
        :actions="actions" />
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const actions = [
    {
        icon: '📡',
        title: 'Estaciones asignadas',
        description: 'Número de estaciones meteorológicas que tienes asignadas y en las que puedes registrar observaciones.'
    },
    {
        icon: '🌡',
        title: 'Temperatura media anual',
        description: 'Media de temperatura de todas tus observaciones registradas en los últimos 365 días.'
    },
    {
        icon: '📊',
        title: 'Últimas observaciones',
        description: 'Contador de las observaciones más recientes mostradas en el panel.'
    },
    {
        icon: '🗺️',
        title: 'Listado de estaciones',
        description: 'Panel con todas tus estaciones asignadas mostrando su nombre, ubicación, altitud y el número total de observaciones registradas en cada una.'
    },
    {
        icon: '📋',
        title: 'Últimas 5 observaciones',
        description: 'Panel con tus 5 registros más recientes mostrando la estación, fecha y todos los valores meteorológicos disponibles: temperatura, humedad, presión, viento y precipitación.'
    },
]
</script>