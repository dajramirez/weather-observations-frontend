<template>
    <HelpPage title="Reportes" role="User"
        description="La sección de reportes te permite consultar los informes meteorológicos que han sido marcados como públicos por los administradores y observadores del sistema."
        :actions="actions" />
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const actions = [
    {
        icon: '📋',
        title: 'Listado de reportes públicos',
        description: 'Visualiza todos los reportes que han sido publicados, con información sobre la estación, el período que cubren, el usuario que los generó y la fecha de creación.'
    },
    {
        icon: '🔍',
        title: 'Ver detalle del reporte',
        description: 'Haz clic en "Ver" para consultar las observaciones incluidas en el reporte: fecha, temperatura, humedad, presión, viento y precipitación de cada registro.'
    },
]
</script>