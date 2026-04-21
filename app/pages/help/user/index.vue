<template>
    <HelpPage title="Dashboard" role="User"
        description="El dashboard es tu pantalla principal. Muestra un resumen del estado de las estaciones meteorológicas del sistema y las alertas activas. Solo tienes acceso de consulta — no puedes modificar ningún dato."
        :actions="actions" />
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const actions = [
    {
        icon: '📊',
        title: 'Estadísticas del sistema',
        description: 'En la parte superior se muestran el número de estaciones activas, alertas activas, altitud media de las estaciones y número de ubicaciones distintas.'
    },
    {
        icon: '📡',
        title: 'Listado de estaciones',
        description: 'Visualiza todas las estaciones meteorológicas del sistema con su nombre, ubicación y altitud.'
    },
    {
        icon: '🔽',
        title: 'Ver últimas observaciones',
        description: 'Haz clic en cualquier estación para desplegar un panel con sus últimas observaciones registradas, mostrando temperatura, humedad, presión, viento y precipitación.'
    },
    {
        icon: '🚨',
        title: 'Alertas activas',
        description: 'En el panel derecho se muestran las alertas meteorológicas actualmente vigentes en el sistema con su tipo y la estación afectada.'
    },
]
</script>