"use client"
import SectionHeader from "@/components/ui/design_system/section/SectionHeader"
import { useTranslations } from "next-intl"
import { MdReplay } from "react-icons/md"
import { IoChevronBack, IoChevronForward } from "react-icons/io5"
import { useRef, useState } from "react"
import { LastStudied } from "@studo/types"
import LastTenItem from "@/components/ui/app/home/jump-back-in/LastTenItem";

interface JumpBackInProps {
    items: LastStudied[]
}

const ARROW_BASE =
    "absolute z-20 top-1/2 -translate-y-1/2 h-7 w-7 flex justify-center items-center " +
    "rounded-full border border-studoborder bg-studogrey/30 cursor-pointer " +
    "active:scale-95 transition-all duration-300 dark:text-white text-studodarkblue"

const FADE_BASE =
    "absolute z-10 h-full w-8 pointer-events-none to-transparent " +
    "dark:from-bg-dark from-bg-white"

const JumpBackIn = ({ items }: JumpBackInProps) => {
    const t = useTranslations("home")
    const scrollRef = useRef<HTMLDivElement>(null)
    const [activeIndex, setActiveIndex] = useState(0)

    if (items.length === 0) return null

    const lastIndex = items.length - 1
    const isAtStart = activeIndex === 0
    const isAtEnd = activeIndex === lastIndex

    const scrollTo = (index: number) => {
        const container = scrollRef.current
        if (!container) return

        const item = container.children[index] as HTMLElement | undefined
        if (!item) return

        setActiveIndex(index)

        const itemStart = item.offsetLeft
        const itemEnd = itemStart + item.offsetWidth
        const viewStart = container.scrollLeft
        const viewEnd = viewStart + container.clientWidth

        let targetScroll: number

        if (itemEnd > viewEnd) {
            // Item valt rechts buiten beeld → rechts uitlijnen
            targetScroll = itemEnd - container.clientWidth
        } else if (itemStart < viewStart) {
            // Item valt links buiten beeld → links uitlijnen
            targetScroll = itemStart
        } else {
            // Forceer scroll naar het item toch, zodat er altijd beweging is
            targetScroll = itemStart
        }

        container.scrollTo({
            left: targetScroll,
            behavior: "smooth",
        })
    }

    const handleForward = () => scrollTo(isAtEnd ? 0 : activeIndex + 1)
    const handleBackward = () => scrollTo(isAtStart ? lastIndex : activeIndex - 1)

    return (
        <section className="flex flex-col gap-5 overflow-visible">
            <SectionHeader sectionIcon={<MdReplay />} title={t("jump-back-in_title")} />

            <div className="relative w-full h-50 flex flex-row gap-2 overflow-visible">
                {!isAtStart && (
                    <>
                        <div className={`${FADE_BASE} left-0 bg-linear-90`} />
                        <button
                            onClick={handleBackward}
                            aria-label={t("jump-back-in_previous")}
                            className={`${ARROW_BASE} left-3`}
                        >
                            <IoChevronBack />
                        </button>
                    </>
                )}

                <div
                    ref={scrollRef}
                    className="relative w-full h-full flex flex-row gap-5 overflow-x-scroll overflow-y-visible scroll-hidden"
                >
                    {items.map((item, i) => (
                        <LastTenItem data={item} key={i}/>
                    ))}
                </div>

                {!isAtEnd && (
                    <>
                        <button
                            onClick={handleForward}
                            aria-label={t("jump-back-in_next")}
                            className={`${ARROW_BASE} right-3`}
                        >
                            <IoChevronForward />
                        </button>
                        <div className={`${FADE_BASE} right-0 bg-linear-270`} />
                    </>
                )}
            </div>

            <div className="w-full flex items-center justify-center gap-3">
                {items.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => scrollTo(i)}
                        aria-label={t("jump-back-in_goto", { index: i + 1 })}
                        className={`w-2.5 h-2.5 rounded-full border border-studoborder cursor-pointer transition-colors ${
                            activeIndex === i ? "bg-studoblue" : ""
                        }`}
                    />
                ))}
            </div>
        </section>
    )
}

export default JumpBackIn