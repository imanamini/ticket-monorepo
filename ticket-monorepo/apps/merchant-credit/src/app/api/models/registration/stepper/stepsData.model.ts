export interface StepsData {
    status: string;
    title: string;
    description: Description;
    imageUrl: string;
}

interface Description {
    value: string;
    className?: string;
}

export const stepsData: StepsData[] = [
    {
        description: {
            value:  'لورم ایپسوم هستن ایشون'
        },
        title: 'لورم ایپسوم هستن ایشون',
        imageUrl: 'assets/icons/sample.svg',
        status: 'default'
    },
    {
        description: {
            value:  'لورم ایپسوم هستن ایشون'
        },
        title: 'لورم ایپسوم هستن ایشون',
        imageUrl: 'assets/icons/sample.svg',
        status: 'succeeded'
    },
    {
        description: {
            value:  'لورم ایپسوم هستن ایشون'
        },
        title: 'لورم ایپسوم هستن ایشون',
        imageUrl: 'assets/icons/sample.svg',
        status: 'disabled'
    }
]
