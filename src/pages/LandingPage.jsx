import LetterGlitch from '@/components/LetterGlitch'
import { ShimmerButton } from '@/components/velora/shimmer-button';
import { TextHighlighter } from '@/components/velora/text-highlighter';
import { CircleCheck, BugIcon, Zap, ShieldCheck, FileText, CodeXml, List } from 'lucide-react'
import { SparklesText } from '@/components/velora/sparkles-text';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { SpotlightCard } from '@/components/velora/spotlight-card';
import Signal from '@/components/flows/Signal';
import { AnnotatedText } from '@/components/ui/annotated-text';
import { TextHoverEffect } from '@/components/velora/text-hover-effect';
import { SmoothScroll } from '@/components/velora/smooth-scroll';
import { useNavigate } from 'react-router-dom';


const LIGHT_GLITCH = ['#3f6f5c', '#065f46', '#047857'];
const DARK_GLITCH = ['#091A14', '#61dca3'];

const LandingPage = () => {
    const { theme } = useTheme();
    const isLight = theme === 'light';
    const navigate = useNavigate();
    const list = [
        '5 Free Credits',
        'No Login Required',
        'Developer Friendly'
    ]

    // Animation Container
    const container = {
        hidden: {},
        show: {
            transition: { staggerChildren: 0.15 },
        },
    };

    // Animation Item
    const item = {
        hidden: { opacity: 0, y: 16 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" },
        },
    };

    // Features list
    const featureList = [
        {
            icon: BugIcon,
            title: 'Find Bugs Early',
            description: 'Detect potential bugs and logical issues before they reach production.'
        },
        {
            icon: Zap,
            title: 'Improve Performance',
            description: 'Get suggestions to make your code faster and more efficient.'
        },
        {
            icon: ShieldCheck,
            title: 'Follow Best Practices',
            description: 'Receive recommendations based on industry standards.'
        },
        {
            icon: FileText,
            title: 'Clean & Readable Code',
            description: 'Make your code more readable and easy to maintain.'
        },
        {
            icon: CodeXml,
            title: 'Multiple Languages',
            description: 'Support for popular programming languages like JavaScript, Python, Java, and more.'
        },
        {
            icon: List,
            title: 'Detailed Explanations',
            description: 'Understand the "why" behind each suggestion with clear explanations.'
        },
    ]

    return (
        <SmoothScroll>
        <div>
            <motion.section className='relative flex min-h-screen items-center justify-center overflow-hidden bg-card'>
                {/* Background */}
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

                {/* Hero Section */}
                <motion.div
                    className="relative z-10 flex flex-col items-center gap-9 px-6 text-center"
                    variants={container}
                    initial="hidden"
                    animate="show"
                >
                    <motion.h1 variants={item} className="max-w-3xl text-7xl font-semibold tracking-tight leading-24">
                        Write Better Code with{" "}
                        <TextHighlighter
                            immediate
                            className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent"
                        >
                            AI Review
                        </TextHighlighter>
                    </motion.h1>
                    <motion.p variants={item} className="max-w-4xl text-lg text-muted-foreground">
                        Get instant, detailed code reviews, detect bugs, improve performance, and follow best practices — all powered by{" "}
                        <SparklesText className="font-semibold text-primary">Gemini AI</SparklesText>
                    </motion.p>
                    <motion.div variants={item} onClick={() => navigate('/code-review')}>
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

            </motion.section>

            {/* Features */}
            <motion.section
                className="relative overflow-hidden bg-card"
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
            >
                <div aria-hidden className="pointer-events-none absolute inset-0">
                    <div className="absolute inset-0 bg-linear-to-b from-background via-primary/5 to-background dark:from-card dark:via-primary/8 dark:to-background" />
                    <div className="absolute inset-0 bg-linear-to-tr from-secondary/5 via-transparent to-primary/10 opacity-80 dark:from-secondary/10 dark:to-primary/15" />
                    <div className="absolute -left-32 top-1/4 h-80 w-80 rounded-full bg-primary/20 blur-[100px] dark:bg-primary/30" />
                    <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-secondary/15 blur-[100px] dark:bg-secondary/25" />
                    <div className="absolute left-1/2 top-0 h-px w-[min(100%,48rem)] -translate-x-1/2 bg-linear-to-r from-transparent via-primary/40 to-transparent dark:via-primary/55" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_0%,color-mix(in_oklch,var(--primary)_18%,transparent),transparent_55%)] dark:bg-[radial-gradient(ellipse_90%_60%_at_50%_0%,color-mix(in_oklch,var(--primary)_28%,transparent),transparent_50%)]" />
                    <div className="absolute inset-0 opacity-40 dark:opacity-50 bg-[linear-gradient(to_right,color-mix(in_oklch,var(--foreground)_6%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--foreground)_6%,transparent)_1px,transparent_1px)] bg-size-[3rem_3rem] mask-[radial-gradient(ellipse_at_center,black_20%,transparent_75%)] dark:bg-[linear-gradient(to_right,color-mix(in_oklch,var(--border)_40%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--border)_40%,transparent)_1px,transparent_1px)]" />
                </div>

                <motion.div
                    className="relative z-10 w-full pt-12 flex flex-col gap-4 text-center"
                    variants={item}
                >
                    <h6 className="text-primary text-base font-medium">FEATURES</h6>
                    <h3 className="text-4xl font-semibold text-foreground">Powerful features for better code</h3>
                    <p className="text-muted-foreground text-base">Everything you need to write clean, secure, and efficient code.</p>
                </motion.div>

                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-10 px-10">
                    {featureList.map((items, index) => (
                        <motion.div key={index} variants={item}>
                            <SpotlightCard color="var(--color-card-hover)" className="p-4 shadow h-full">
                                <div className="flex flex-col items-start justify-center gap-4">
                                    <div className="p-3.5 bg-primary/20 rounded-lg w-fit">
                                        <items.icon className="text-primary" />
                                    </div>
                                    <h4 className="text-2xl font-semibold text-foreground">{items.title}</h4>
                                    <p className="text-muted-foreground text-base">{items.description}</p>
                                </div>
                            </SpotlightCard>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Process Flow */}
            <motion.section
                className="relative overflow-hidden bg-card/40"
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.15 }}
            >
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_oklch,var(--foreground)_8%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--foreground)_8%,transparent)_1px,transparent_1px)] bg-size-[2.75rem_2.75rem] mask-[radial-gradient(ellipse_at_center,black_25%,transparent_88%)] dark:bg-[linear-gradient(to_right,color-mix(in_oklch,var(--border)_35%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--border)_35%,transparent)_1px,transparent_1px)] dark:mask-[radial-gradient(ellipse_at_center,black_15%,transparent_85%)]"
                />

                <div className="relative z-10 flex flex-col items-center px-4 py-10 text-center sm:px-8 md:py-14">
                    <motion.div variants={item} className="flex max-w-3xl flex-col items-center gap-5">
                        <h6 className="text-sm font-medium text-secondary">POWERED BY AI</h6>
                        <h2 className="text-center text-4xl font-semibold sm:text-5xl">
                            Your Code,{" "}
                            <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                                Smarter{" "}
                                <AnnotatedText variant="doubleUnderline" delay={0.16}>
                                    with AI
                                </AnnotatedText>
                            </span>
                        </h2>
                        <p className="text-base text-muted-foreground">
                            Turn your code into cleaner, faster, and more reliable solutions
                        </p>
                    </motion.div>

                    <motion.div variants={item} className="mt-8 w-full">
                        <Signal />
                    </motion.div>
                </div>
            </motion.section>

            {/* Footer */}
            <motion.footer initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} className='py-7 px-6 border-t-[0.3px] border-gray-400 dark:border-gray-200 bg-linear-to-b from-primary/200 to-secondary/30 bg-white dark:bg-card'>
                <motion.div variants={item} className='flex justify-between items-start '>
                    <h4>Powered by Google Gemini.</h4>
                    <h4>Developed by <a href='https://www.artfolio.tech/vinitgite' target='_blank' className='text-secondary hover:underline'>Vinit Gite</a></h4>
                </motion.div>

                <motion.div variants={item} className='flex justify-center items-center pt-10 '>
                    <TextHoverEffect
                        text="CODEREV"
                        animateOnView
                        viewAmount={0.35}
                        className="w-full max-w-2xl text-muted-foreground"
                    />
                </motion.div>
            </motion.footer>
        </div>
        </SmoothScroll>
    )
}

export default LandingPage
