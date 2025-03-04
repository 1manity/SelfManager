import React, { useState } from 'react';

export default function Dashboard() {
    return (
        <>
            <div className="flex gap-2 p-6">
                {[1, 2, 3].map((i) => (
                    <div
                        key={'first' + i}
                        className="h-20 w-full rounded-lg  bg-gray-100 dark:bg-neutral-800 animate-pulse"
                    ></div>
                ))}
            </div>
            <div className="flex gap-2 flex-1  p-6 pt-0">
                {[1, 2].map((i) => (
                    <div
                        key={'second' + i}
                        className="h-full w-full rounded-lg  bg-gray-100 dark:bg-neutral-800 animate-pulse"
                    ></div>
                ))}
            </div>
        </>
    );
}
