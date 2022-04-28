import { useSpring, easings, animated, config } from "react-spring";

// glow animation for 3-5 star cards stars
export function glow(start: number, end: number, color: string, flip: boolean, setFlip: Function) {

    const { textShadowColor, shadowOpacity, textShadowRadius, textShadowOffset } = useSpring({
        from: {
            textShadowColor: color,
            shadowOpacity: 0.8,
            textShadowRadius: start,
            textShadowOffset: { width: 0, height: 1 }
        },
        to: {
            textShadowColor: color,
            shadowOpacity: 0.8,
            textShadowRadius: end,
            textShadowOffset: { width: 0, height: 1 }
        },
        config: {
            duration: 2000,
            easing: easings.easeInOutQuart,
        },
        delay: 200,
        reset: true,
        reverse: flip,
        onRest: () => setFlip(!flip),
    })
    return { textShadowColor, shadowOpacity, textShadowRadius, textShadowOffset };
}