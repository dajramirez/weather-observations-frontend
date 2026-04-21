<template>
    <HelpPage title="Observaciones" role="Observer"
        description="La sección de observaciones es donde registras y consultas tus propias observaciones meteorológicas. Solo puedes registrar observaciones en las estaciones que tienes asignadas."
        :actions="actions"
        notes="Al registrar una observación, el sistema comprueba automáticamente si los valores superan los umbrales definidos y genera alertas en caso necesario." />
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const actions = [
    {
        icon: '📋',
        title: 'Consultar observaciones',
        description: 'Visualiza el historial paginado de todas tus observaciones con su estación, fecha y valores meteorológicos. Usa los botones "Anterior" y "Siguiente" para navegar entre páginas.'
    },
    {
        icon: '🔍',
        title: 'Ver detalle',
        description: 'Haz clic en "Ver" para abrir un modal con todos los valores de la observación: temperatura, humedad, presión, viento y precipitación.'
    },
    {
        icon: '➕',
        title: 'Registrar nueva observación',
        description: 'Haz clic en "Nueva observación" para abrir el formulario. Selecciona la estación, la fecha y hora, e introduce los valores meteorológicos. Los campos obligatorios son temperatura, precipitación, humedad y presión.'
    },
    {
        icon: '📡',
        title: 'Selección de estación',
        description: 'El desplegable de estaciones solo muestra las estaciones que tienes asignadas. No podrás registrar observaciones en estaciones que no estén en ese listado.'
    },
]
</script>