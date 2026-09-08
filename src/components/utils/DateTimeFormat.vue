<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps({
	timestamp: {
		type: [Number, String],
		required: true
	},
	format: {
		type: String,
		default: 'DD.MM.YYYY HH:mm'
	}
})

const formattedDate = computed(() => {
	if (!props.timestamp) return ''

	const value = Number(props.timestamp)
	const date = new Date(value < 1e12 ? value * 1000 : value)
	
	if (isNaN(date.getTime())) return 'Incorrect date'

	return new Intl.DateTimeFormat('ru-RU', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	}).format(date)
})
</script>

<template>
	<time :datetime="new Date(timestamp).toISOString()">
		{{ formattedDate }}
	</time>
</template>