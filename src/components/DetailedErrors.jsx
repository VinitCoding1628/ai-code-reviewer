import React from 'react'
import { Bug, AlertTriangle, CheckCircle, ShieldCheck } from 'lucide-react'
import { Modal, ModalTrigger } from './velora/animated-modal'

const DetailedErrors = ({ heading, description }) => {
    const box =
        heading === 'Critical Issues'
            ? 'border rounded border-red-500 bg-red-50/40 dark:border-red-400 dark:bg-red-500/10'
            : heading === 'Warnings'
                ? 'border rounded border-yellow-500 bg-yellow-50 dark:border-yellow-400 dark:bg-yellow-500/10'
                : 'border rounded border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-500/10'

    const text =
        heading === 'Critical Issues'
            ? 'text-red-500 dark:text-red-400'
            : heading === 'Warnings'
                ? 'text-yellow-500 dark:text-yellow-400'
                : 'text-blue-500 dark:text-blue-400'

    const icon =
        heading === 'Critical Issues'
            ? <Bug className="text-red-500 dark:text-red-400 size-5" />
            : heading === 'Warnings'
                ? <AlertTriangle className="text-yellow-500 dark:text-yellow-400 size-5" />
                : heading === 'Security Issues' ? <ShieldCheck className="text-blue-500 dark:text-blue-400 size-5" /> : null

    return (
        <div className={`${box} p-2`}>
            <div className='flex items-center gap-1.5'>
                {icon}
                <h4 className={`text-base font-semibold ${text}`}>
                    {heading}
                </h4>
            </div>
            <div className='flex flex-col gap-2 h-20 overflow-y-auto mt-1'>
                {description?.length > 0 && description?.map((item, index) => (
                    <div key={index} className='border border-muted-foreground/20 rounded p-1'>
                        <p className='text-sm text-muted-foreground flex justify-between items-center'><span className='w-[90%] text-wrap'>{item.description} </span><span className={`${heading === 'Critical Issues' ? 'text-red-500 dark:text-red-400 bg-red-500/10 dark:bg-red-400/10' : heading === 'Warnings' ? 'text-yellow-500 dark:text-yellow-400 bg-yellow-500/10 dark:bg-yellow-400/10' : 'text-blue-500 dark:text-blue-400 bg-blue-500/10 dark:bg-blue-400/10'} border-[0.5px] border-muted-foreground/20 rounded px-2 py-1`}>Line {item.line}</span></p>
                    </div>
                ))}
                {
                    description?.length === 0 && (
                        <div>
                            {
                                heading === 'Critical Issues' && (
                                    <div className='flex items-center justify-center h-18'>
                                        <h4 className='text-lg text-muted-foreground text-center font-medium'>No critical issues found</h4>
                                </div>
                                )
                            }
                            {
                                heading === 'Warnings' && (
                                    <div className='flex items-center justify-center h-18'>
                                        <h4 className='text-lg text-muted-foreground text-center font-medium'>No warnings found</h4>
                                    </div>
                                )
                            }
                            {
                                heading === 'Security Issues' && (
                                    <div className='flex items-center justify-center h-18'>
                                        <h4 className='text-lg text-muted-foreground text-center font-medium'>No security issues found</h4>
                                    </div>
                                )
                            }
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default DetailedErrors