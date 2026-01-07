export enum EOnboarding {
    None = 0,
    Categories = 1,         // 000001
    Transactions = 2,       // 000010
    Profile = 4,            // 000100
    SejamInquiry = 8,       // 001000
    Portfolio = 16          // 010000
}


export function getCompletedOnboardings(binaryString: string): string[] {
    
    const value = parseInt(binaryString, 2);
    const completedOnboardings: string[] = [];

    for (const [key, flag] of Object.entries(EOnboarding)) {
        if (typeof flag === "number" && flag !== 0 && (value & flag) === flag) {
            completedOnboardings.push(key);
        }
    }

    return completedOnboardings;
}

export function getNextOnboarding(binaryString: string): string | null {
    const value = parseInt(binaryString, 2);

    const onboardingOrder = [
        EOnboarding.Categories,
        EOnboarding.Transactions,
        EOnboarding.Profile,
        EOnboarding.SejamInquiry,
        EOnboarding.Portfolio
    ];
    
    for (const flag of onboardingOrder) {
        if ((value & flag) === 0) {
            return EOnboarding[flag];
        }
    }
    
    return null;
}
