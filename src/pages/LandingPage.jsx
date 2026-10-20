import LetterGlitch from '@/components/LetterGlitch'
import { ShimmerButton } from '@/components/velora/shimmer-button';
import { TextHighlighter } from '@/components/velora/text-highlighter';
import { CircleCheck } from 'lucide-react'
import { SparklesText } from '@/components/velora/sparkles-text';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';

const LIGHT_GLITCH = ['#3f6f5c', '#065f46', '#047857'];
const DARK_GLITCH = ['#091A14', '#61dca3'];

const LandingPage = () => {
    const { theme } = useTheme();
    const isLight = theme === 'light';
    const list = [
        '5 Free Credits',
        'No Login Required',
        'Developer Friendly'
    ]

    const container = {
        hidden: {},
        show: {
            transition: { staggerChildren: 0.15 },
        },
    };
    const item = {
        hidden: { opacity: 0, y: 16 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" },
        },
    };

    return (
        <section className='relative flex min-h-screen items-center justify-center overflow-hidden scroll-smooth'>
            <div className="absolute inset-0">
                <LetterGlitch
                    lightMode={isLight}
                    glitchColors={isLight ? LIGHT_GLITCH : DARK_GLITCH}
                    glitchAmount={0.5}
                    speed={1}
                    flow={0.5}
                    clickEffect="burst"
                    interactive={false}
                    edgeFade={0.1}
                    centerFade={0.80}
                />
            </div>

            <motion.div
                className="relative z-10 flex flex-col items-center gap-9 px-6 text-center"
                variants={container}
                initial="hidden"
                animate="show"
            >
                <motion.h1 variants={item} className="max-w-3xl text-7xl font-semibold tracking-tight leading-24">
                    Write Better Code with{" "}
                    <TextHighlighter  className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                        AI Review
                    </TextHighlighter>
                </motion.h1>
                <motion.p variants={item} className="max-w-4xl text-lg text-muted-foreground">
                    Get instant, detailed code reviews, detect bugs, improve performance, and follow best practices — all powered by{" "}
                    <SparklesText className="font-semibold text-primary">Gemini AI</SparklesText>
                </motion.p>
                <motion.div variants={item}>
                    <ShimmerButton>Start Reviewing</ShimmerButton>
                </motion.div>
                <motion.ul variants={item} className="flex w-full items-center justify-between px-10">
                    {list.map((item, index) => (
                        <li key={index} className="flex items-center gap-1">
                            <CircleCheck className="text-primary" />
                            <p className="text-base font-medium text-muted-foreground">{item}</p>
                        </li>
                    ))}
                </motion.ul>
            </motion.div>
        </section>
    )
}

export default LandingPage
