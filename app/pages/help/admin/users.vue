<template>
    <HelpPage title="Usuarios" role="Admin"
        description="La sección de usuarios permite gestionar todos los usuarios registrados en el sistema. Puedes consultar sus datos, crear nuevos usuarios, cambiar roles, gestionar estaciones asignadas y eliminar usuarios."
        :actions="actions"
        notes="No puedes eliminar tu propio usuario. Los administradores tienen acceso a todas las estaciones por defecto y no necesitan asignación. Al cambiar el rol de un usuario a 'Usuario' se eliminarán automáticamente todas sus estaciones asignadas." />
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const actions = [
    {
        icon: '📋',
        title: 'Consultar usuarios',
        description: 'Visualiza el listado completo de usuarios con su nombre, email, rol y estaciones asignadas. Los administradores muestran "Todas las estaciones" ya que tienen acceso completo por defecto.'
    },
    {
        icon: '➕',
        title: 'Crear nuevo usuario',
        description: 'Haz clic en "Nuevo usuario" para crear un usuario desde el panel de administración. Puedes asignarle cualquier rol: Administrador, Observador o Usuario.'
    },
    {
        icon: '🔍',
        title: 'Ver detalle',
        description: 'Haz clic en "Ver" para abrir un modal con la información completa del usuario, incluyendo las estaciones asignadas y opciones para cambiar rol o asignar estaciones.'
    },
    {
        icon: '🔄',
        title: 'Cambiar rol',
        description: 'Haz clic en "Cambiar rol" para asignar un rol diferente al usuario. Si cambias el rol a Usuario, aparecerá un aviso en rojo indicando que se eliminarán todas las estaciones asignadas.'
    },
    {
        icon: '📡',
        title: 'Asignar estación',
        description: 'Para usuarios con rol Observador, haz clic en "+ Asignar" en la columna de estaciones para asignarle una estación. Solo los observadores pueden tener estaciones asignadas.'
    },
    {
        icon: '❌',
        title: 'Desasignar estación',
        description: 'Haz clic en la "x" junto al nombre de la estación en la columna de estaciones para desasignarla del usuario.'
    },
    {
        icon: '🗑️',
        title: 'Eliminar usuario',
        description: 'Haz clic en "Eliminar" para borrar un usuario del sistema. Se pedirá confirmación antes de proceder. Esta acción no se puede deshacer.'
    },
]
</script>