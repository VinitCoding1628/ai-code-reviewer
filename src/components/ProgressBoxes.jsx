import { BookOpen, CodeXml, Zap } from 'lucide-react';
import React from 'react'

const ProgressBoxes = ({ name, score }) => {
  const box =
    score < 50
      ? "border-red-500 bg-red-50 dark:border-red-400 dark:bg-red-500/10"
      : score < 75
        ? "border-yellow-500 bg-yellow-50 dark:border-yellow-400 dark:bg-yellow-500/10"
        : "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-500/10";
  const text =
    score < 50
      ? "text-red-500 dark:text-red-400"
      : score < 75
        ? "text-yellow-500 dark:text-yellow-600 dark:text-yellow-400"
        : "text-blue-500 dark:text-blue-400";
  const icon =
    score < 50 ? <CodeXml className="text-red-500 dark:text-red-400 size-5" /> : score < 75 ? <BookOpen className="text-yellow-500 dark:text-yellow-400 size-5" /> : <Zap className="text-blue-500 dark:text-blue-400 size-5" />;
  return (
    <div className={`flex gap-1 text-center rounded-md border p-2 w-fit h-20 ${box}`}>
      <p className={`flex items-center justify-center rounded-full p-5 ${box}`}>{icon}</p>
      <div className='flex flex-col gap-1 items-center justify-center'>
        <h4 className={`text-lg font-bold ${text}`}>{score}/100</h4>
        <h6 className={`text-xs font-medium ${text}`}>{name}</h6>
      </div>
    </div>
  )
}

export default ProgressBoxes