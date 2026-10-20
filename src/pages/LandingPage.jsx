import LetterGlitch from '@/components/LetterGlitch'
import { ShimmerButton } from '@/components/velora/shimmer-button';
import { TextHighlighter } from '@/components/velora/text-highlighter';
import { GiPlainCircle } from "react-icons/gi";
import {CircleCheck} from 'lucide-react'
import { SparklesText } from '@/components/velora/sparkles-text';

const LandingPage = () => {
    const list = [
        '5 Free Credits',
        'No Login Required',
        'Developer Friendly'
    ]
    return (
        <section className='relative flex min-h-screen items-center justify-center overflow-hidden scroll-smooth'>
            <div className="absolute inset-0">
                <LetterGlitch
                    lightMode
                    glitchColors={['#18181b', '#10B981']}
                    glitchAmount={0.5}
                    speed={1}
                    flow={0.5}
                    clickEffect="burst"
                    interactive={false}
                    edgeFade={0.1}
                    centerFade={0.80}
                />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-9 px-6 text-center">
                    {/* <p className='jetbrains-mono bg-background text-primary px-4 py-2 rounded-full shadow shadow-primary text-sm flex justify-center items-center gap-2'><GiPlainCircle className='text-primary animate-ping transition-all duration-300 ease-in-out text-[10px]' /> ⚡ POWERED BY GOOGLE GEMINI • FAST & FREE</p> */}
                    <h1 className="max-w-3xl text-7xl font-semibold tracking-tight leading-24">
                    Write Better Code with <TextHighlighter className='bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent'>AI Review</TextHighlighter>
                    </h1>
                    <p className='max-w-4xl text-lg text-muted-foreground'>Get instant, detailed code reviews, detect bugs, improve performance, and follow best practices — all powered by <SparklesText className='font-semibold'>Gemini AI</SparklesText></p>
                    <ShimmerButton> Start Reviewing  </ShimmerButton>
                   <ul className='flex items-center justify-between w-full px-10'>
                        {
                            list.map((item, index) => (
                                <li key={index} className='flex items-center gap-1'>
                                    <CircleCheck className='text-primary' />
                                    <p className='text-base font-medium text-muted-foreground'>{item}</p>
                                </li>
                            ))
                        }
                   </ul>
                </div>
        </section>
    )
}

export default LandingPage
