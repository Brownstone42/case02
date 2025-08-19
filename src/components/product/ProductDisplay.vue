<template>
    <div class="product-display">
        <div class="columns is-multiline">
            <div class="column is-half-desktop is-full-mobile">
                <div class="gallery-layout-inner">
                    <div class="vertical-thumbnails-container" ref="verticalThumbnailsRef">
                        <div
                            v-for="(image, index) in currentProductImages"
                            :key="index"
                            class="thumbnail-item"
                            @click="slideTo(index)"
                            :class="{ 'is-active': currentIndex === index }"
                        >
                            <figure class="image is-square thumbnail-figure">
                                <img
                                    :src="image"
                                    :alt="`Thumbnail ${index + 1}`"
                                    @error="onImageError($event, image)"
                                />
                            </figure>
                        </div>
                    </div>

                    <div class="main-carousel-container">
                        <Carousel
                            :items-to-show="1"
                            :wrap-around="true"
                            ref="carousel"
                            class="main-product-carousel"
                        >
                            <template #slides="{ currentSlide }">
                                {{ updateCarouselActiveSlideIndex(currentSlide) }}
                                <Slide v-for="(image, index) in currentProductImages" :key="index">
                                    <figure class="image main-slide-image-container">
                                        <img
                                            :src="image"
                                            :alt="`Product Image ${index + 1}`"
                                            @error="onImageError($event, image)"
                                        />
                                    </figure>
                                </Slide>
                            </template>

                            <template #addons>
                                <Navigation />
                                <Pagination />
                            </template>
                        </Carousel>
                    </div>
                </div>
            </div>

            <div class="column is-half-desktop is-full-mobile">
                <div class="product-details content">
                    <h1 class="title is-3">{{ product.name }}</h1>

                    <p class="price is-size-4 has-text-weight-bold">
                        {{ formatCurrency(product.price) }}
                    </p>

                    <p class="subtitle is-5">{{ product.tagline }}</p>

                    <div class="field">
                        <label class="label">Model: {{ selectedModel }}</label>
                        <div class="control">
                            <div class="select is-fullwidth">
                                <select v-model="selectedModel">
                                    <option v-for="model in product.models" :key="model">
                                        {{ model }}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="field">
                        <label class="label">Color: {{ selectedColor }}</label>
                        <div class="control grid-items-group">
                            <div
                                v-for="option in colorOptions"
                                :key="option.color"
                                class="color-item"
                                :class="{ 'is-active': selectedColor === option.color }"
                                @click="selectedColor = option.color"
                            >
                                <img :src="option.img" :alt="`${option.color} iPhone Case`" />
                            </div>
                        </div>
                    </div>

                    <div class="field">
                        <label class="label">Zodiac: {{ selectedZodiac }}</label>
                        <div class="control grid-items-group">
                            <div
                                v-for="option in zodiacOptions"
                                :key="option.zodiac"
                                class="zodiac-item"
                                :class="{ 'is-active': selectedZodiac === option.zodiac }"
                                @click="selectedZodiac = option.zodiac"
                            >
                                <img :src="option.img" :alt="`${option.zodiac} Zodiac`" />
                            </div>
                        </div>
                    </div>

                    <div class="field mt-5">
                        <div class="control">
                            <button class="button is-primary is-large is-fullwidth">
                                Add to Cart
                            </button>
                        </div>
                    </div>

                    <div class="field mt-5">
                        <div class="control">
                            <button class="button is-primary is-large is-fullwidth">
                                Purchase
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'

export default {
    name: 'ProductDisplay',
    components: {
        Carousel,
        Slide,
        Pagination,
        Navigation,
    },
    data() {
        return {
            currentIndex: 0,
            carouselActiveSlideIndex: 0,
            selectedModel: 'iPhone 16 Pro Max',
            selectedColor: '',
            selectedZodiac: '',
            product: {
                name: 'Ultra Impact Liquid Silicone iPhone Case',
                tagline: 'Premium protection with a vibrant look',
                price: 1800,
                models: ['iPhone 16 Pro Max', 'iPhone 16 Pro', 'iPhone 16 Plus', 'iPhone 16'],
            },
            colorOptions: [
                { color: 'Black', img: '/images/iphone-black.jpg' },
                { color: 'White', img: '/images/iphone-white.jpg' },
            ],
            zodiacOptions: [
                { zodiac: 'Rat', img: '/images/rat.jpg' },
                { zodiac: 'Ox', img: '/images/ox.jpg' },
            ],
            productOptions: [
                {
                    color: 'Black',
                    zodiac: 'Rat',
                    images: [
                        '/images/iphone-black.jpg',
                        '/images/iphone-white.jpg',
                        '/images/iphone-black.jpg',
                    ],
                },
                {
                    color: 'White',
                    zodiac: 'Rat',
                    images: [
                        '/images/iphone-white.jpg',
                        '/images/iphone-black.jpg',
                        '/images/iphone-white.jpg',
                    ],
                },
                {
                    color: 'Black',
                    zodiac: 'Ox',
                    images: [
                        '/images/iphone-black2.jpg',
                        '/images/iphone-white2.jpg',
                        '/images/iphone-black2.jpg',
                    ],
                },
                {
                    color: 'White',
                    zodiac: 'Ox',
                    images: [
                        '/images/iphone-white2.jpg',
                        '/images/iphone-black2.jpg',
                        '/images/iphone-white2.jpg',
                    ],
                },
            ],
        }
    },
    mounted() {
        if (this.productOptions && this.productOptions.length > 0) {
            this.selectedColor = this.productOptions[0].color
            this.selectedZodiac = this.productOptions[0].zodiac
        }

        this.$nextTick(() => {
            console.log('Inside nextTick.')
            console.log('this.$refs.carousel:', this.$refs.carousel)

            if (this.$refs.carousel) {
                console.log('Carousel ref is available.')
            } else {
                console.error('Error: this.$refs.carousel is not available.')
            }
        })
    },
    computed: {
        currentProductImages() {
            const selectedOption = this.productOptions.find(
                (option) =>
                    option.color === this.selectedColor && option.zodiac === this.selectedZodiac,
            )
            return selectedOption ? selectedOption.images : []
        },
    },
    watch: {
        carouselActiveSlideIndex(newSlide, oldSlide) {
            if (newSlide !== oldSlide) {
                console.log('carouselActiveSlideIndex changed from', oldSlide, 'to', newSlide)
                this.currentIndex = newSlide
                this.slideTo(newSlide)
            }
        },
    },
    methods: {
        formatCurrency(value) {
            const formattedValue = new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(value)

            return `${formattedValue} ฿ THB`
        },
        updateCarouselActiveSlideIndex(newIndex) {
            if (this.carouselActiveSlideIndex !== newIndex) {
                this.carouselActiveSlideIndex = newIndex
            }
            return ''
        },
        slideTo(index) {
            if (this.$refs.carousel) {
                this.$refs.carousel.slideTo(index)
            }

            const thumbnailContainer = this.$refs.verticalThumbnailsRef

            if (thumbnailContainer) {
                const computedContainerStyle = window.getComputedStyle(thumbnailContainer)
                const flexDirection = computedContainerStyle.flexDirection

                const firstThumbnailItem = thumbnailContainer.querySelector('.thumbnail-item')

                if (firstThumbnailItem) {
                    const gapValue = parseFloat(
                        computedContainerStyle.gap ||
                            computedContainerStyle.rowGap ||
                            computedContainerStyle.columnGap,
                    )
                    const actualGap = isNaN(gapValue) ? 0 : gapValue

                    let targetScrollIndex
                    if (index === 0 || index === 1) {
                        targetScrollIndex = 0
                    } else {
                        targetScrollIndex = index - 1
                    }

                    if (flexDirection === 'column') {
                        const thumbnailTotalHeight = firstThumbnailItem.offsetHeight + actualGap
                        const targetScrollTop = targetScrollIndex * thumbnailTotalHeight

                        thumbnailContainer.scrollTo({
                            top: targetScrollTop,
                            behavior: 'smooth',
                        })
                    } else if (flexDirection === 'row') {
                        const thumbnailTotalWidth = firstThumbnailItem.offsetWidth + actualGap
                        const targetScrollLeft = targetScrollIndex * thumbnailTotalWidth

                        thumbnailContainer.scrollTo({
                            left: targetScrollLeft,
                            behavior: 'smooth',
                        })
                    }
                }
            }
        },
        onImageError(event, originalSrc) {
            console.error(`Failed to load image: ${originalSrc}`)
            event.target.src = 'https://placehold.co/600x600/CCCCCC/000000?text=Image+Load+Error'
        },
    },
}
</script>

<style scoped lang="scss">
.grid-items-group {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}
.color-item,
.zodiac-item {
    width: 100px;
    height: 100px;
    border: 1px solid #ccc;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    cursor: pointer;
    position: relative;
}
.color-item.is-active,
.zodiac-item.is-active {
    border: 3px solid black;
}
.color-item:not(.is-active):hover,
.zodiac-item:not(.is-active):hover {
    border: 2px solid black;
}
.zodiac-item > img {
    width: 100%;
}

.product-gallery-wrapper {
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
.gallery-layout-inner {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    flex-grow: 1;
    max-height: 550px;

    @media screen and (max-width: 768px) {
        flex-direction: column;
        gap: 0.5rem;
        max-height: none;
    }
}
.vertical-thumbnails-container {
    gap: 0.3rem;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    width: 100px;
    max-height: 100%;
    overflow-y: auto;
    overflow-x: hidden;

    &::-webkit-scrollbar {
        display: none;
    }
    scrollbar-width: none;
    -ms-overflow-style: none;

    @media screen and (max-width: 768px) {
        flex-direction: row;
        width: 100%;
        height: 100px;
        max-height: 100px;
        overflow-y: hidden;
        overflow-x: auto;
        padding-right: 0;
        padding-top: 0.5rem;
        justify-content: flex-start;
        align-items: center;
        order: 2;
    }
}
.thumbnail-item {
    cursor: pointer;
    transition: border-color 0.2s ease;
    flex-shrink: 0;
    width: 100%;
    @media screen and (max-width: 768px) {
        margin-bottom: 0;
        margin-right: 0;
        width: 100px;
        height: 100px;
    }
}
.thumbnail-item:last-child {
    margin-bottom: 0;
    @media screen and (max-width: 768px) {
        margin-right: 0;
    }
}
.thumbnail-item:not(.is-active):hover {
    border: 1px solid black;
}
.thumbnail-item.is-active {
    border: 2px solid black;
}
.thumbnail-figure {
    width: 100%;
    height: auto;
}
.main-carousel-container {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;

    @media screen and (max-width: 768px) {
        width: 100%;
        height: auto;
        order: 1;
    }
}
.main-product-carousel {
    background-color: #f8f8f8;
    border-radius: 8px;
    overflow: hidden;
    width: 100%;
    aspect-ratio: 1 / 1;
    position: relative;
}
.carousel__slide {
    width: 100% !important;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.main-slide-image-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #e0e0e0;
}
.image img {
    object-fit: cover;
    height: 100%;
    width: 100%;
    max-width: 100%;
    max-height: 100%;
}
</style>
