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
        <div>
            <section className='relative flex min-h-screen items-center justify-center overflow-hidden scroll-smooth'>
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

            </section>

            {/* Features */}
            <motion.section
                className="bg-card-foreground"
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
            >
                <motion.div
                    className="w-full text-center pt-12 flex flex-col gap-4"
                    variants={item}
                >
                    <h6 className="text-primary text-base font-medium">FEATURES</h6>
                    <h3 className="text-4xl font-semibold text-foreground">Powerful features for better code</h3>
                    <p className="text-muted-foreground text-base">Everything you need to write clean, secure, and efficient code.</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-10 px-10">
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
                className="flex flex-col items-center text-center my-6"
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.15 }}>
                <motion.div variants={item} className='flex flex-col items-center text-center gap-5 pt-10'>
                    <h6 className="text-secondary text-sm font-medium">POWERED BY AI</h6>
                    <h2 className='text-5xl font-semibold text-center'>Your Code, <span className='bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent'>Smarter <AnnotatedText variant="doubleUnderline" delay={0.16}>with AI</AnnotatedText></span></h2>
                    <p className='mt-4 text-muted-foreground text-base'>Turn your code into cleaner, faster, and more reliable solutions</p>
                </motion.div>

                <motion.div variants={item} className="w-full">
                    <Signal />
                </motion.div>

            </motion.section>

            {/* Footer */}
            <motion.footer initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} className='py-7 px-6 border-t-[0.3px] border-gray-400 dark:border-gray-200 bg-linear-to-b from-primary/200 to-secondary/30'>
                <motion.div variants={item} className='flex justify-between items-start '>
                    <h4>Powered by Google Gemini.</h4>
                    <h4>Developed by <a href='https://www.artfolio.tech/vinitgite' target='_blank' className='text-secondary hover:underline'>Vinit Gite</a></h4>
                </motion.div>

                <motion.div variants={item} className='flex justify-center items-center pt-10 '>
                    <TextHoverEffect text="CODEREV" className="w-full max-w-2xl text-muted-foreground"/>
                </motion.div>
            </motion.footer>
        </div>
    )
}

export default LandingPage
