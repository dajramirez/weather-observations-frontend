<template>
    <HelpPage title="Alertas" role="Observer"
        description="La sección de alertas muestra las alertas generadas en las estaciones que tienes asignadas. Las alertas se crean automáticamente cuando registras una observación con valores que superan los umbrales definidos."
        :actions="actions"
        notes="Las alertas se generan automáticamente al registrar observaciones con valores extremos: temperatura superior a 42°C o inferior a -10°C, viento superior a 90 km/h, precipitación superior a 50 mm, presión inferior a 970 hPa o superior a 1040 hPa, y humedad superior al 95%." />
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const actions = [
    {
        icon: '📋',
        title: 'Consultar alertas',
        description: 'Visualiza el listado paginado de alertas de tus estaciones asignadas con su tipo, mensaje, fecha y estado. Usa los botones "Anterior" y "Siguiente" para navegar entre páginas.'
    },
    {
        icon: '🔍',
        title: 'Ver detalle',
        description: 'Haz clic en "Ver" para consultar el detalle completo de la alerta, incluyendo el nivel, estado, mensaje y la observación que la originó con todos sus valores meteorológicos.'
    },
]
</script>