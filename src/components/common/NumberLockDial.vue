<template>
    <div
        class="number-lock-dial"
        @mousedown.prevent="startDrag"
        @touchstart.prevent="startDrag"
        :style="{ cursor: isDragging ? 'grabbing' : 'grab' }"
    >
        <div class="dial-window">
            <div class="number-list" :style="{ transform: `translateY(${displayOffset}px)` }">
                <div v-for="(number, index) in numbers" :key="index" class="number-item">
                    {{ number }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'NumberLockDial',
    props: {
        modelValue: {
            type: Number,
            default: 0,
        },
        min: {
            type: Number,
            default: 0,
        },
        max: {
            type: Number,
            default: 9,
        },
    },
    data() {
        const mainNumbers = [...Array(10).keys()] // [0, 1, 2, ..., 9]
        return {
            currentValue: this.modelValue,
            dialHeight: 25,
            isDragging: false,
            startY: 0,
            dragOffset: 0,
            startOffset: 0,
            numbers: [...mainNumbers, ...mainNumbers, ...mainNumbers],
        }
    },
    computed: {
        displayOffset() {
            if (this.isDragging) {
                return this.dragOffset
            }
            const mainListOffset = -(10 * this.dialHeight)
            const valueOffset = -(this.currentValue * this.dialHeight)
            return mainListOffset + valueOffset
        },
    },
    watch: {
        modelValue: {
            handler(newVal) {
                this.currentValue = newVal
            },
            immediate: true,
        },
        currentValue(newVal) {
            this.$emit('update:value', this.currentValue)
        },
    },
    methods: {
        startDrag(e) {
            // --- NEW CODE: Initialize dragOffset BEFORE flipping the flag ---
            this.startOffset = this.displayOffset
            this.dragOffset = this.startOffset
            // Now flip the flag. `displayOffset` will now return `dragOffset`, which is already set to the correct value.
            this.isDragging = true
            // --- END NEW CODE ---

            this.startY = e.clientY || e.touches[0].clientY

            document.addEventListener('mousemove', this.doDrag, { passive: false })
            document.addEventListener('mouseup', this.stopDrag)
            document.addEventListener('touchmove', this.doDrag, { passive: false })
            document.addEventListener('touchend', this.stopDrag)
        },
        doDrag(e) {
            if (!this.isDragging) return
            if (e.type.startsWith('touch')) {
                e.preventDefault()
            }
            const currentY = e.clientY || e.touches[0].clientY
            const deltaY = currentY - this.startY
            this.dragOffset = this.startOffset + deltaY
        },
        stopDrag() {
            this.isDragging = false
            document.removeEventListener('mousemove', this.doDrag)
            document.removeEventListener('mouseup', this.stopDrag)
            document.removeEventListener('touchmove', this.doDrag)
            document.removeEventListener('touchend', this.stopDrag)

            const scrollDistance = this.dragOffset - this.startOffset
            const itemsScrolled = Math.round(scrollDistance / this.dialHeight)

            const newValue = this.currentValue - itemsScrolled

            let finalValue = newValue % 10
            if (finalValue < 0) {
                finalValue += 10
            }
            this.currentValue = finalValue
        },
    },
}
</script>

<style scoped lang="scss">
.number-lock-dial {
    width: 40px;
    height: 50px; /* Updated height based on your change */
    position: relative;
    overflow: hidden;
    border: 1px solid #ccc;
    border-radius: 4px;
    user-select: none;
    cursor: grab;
}

.number-lock-dial:active {
    cursor: grabbing;
}

.dial-window {
    width: 100%;
    height: 100%;
    position: relative;
}

.number-list {
    position: absolute;
    top: 10px; /* Offset the list to center the view */
    left: 0;
    width: 100%;
    transition: transform 0.2s ease-out; /* Add a smooth transition for snapping */
}

.number-lock-dial:active .number-list {
    transition: none; /* Disable transition while dragging for a responsive feel */
}

.number-item {
    height: 25px; /* Must match dialHeight */
    line-height: 25px;
    text-align: center;
    font-size: 1.2rem; /* Adjusted font size for smaller height */
    font-weight: bold;
    color: #333;
}
</style>
