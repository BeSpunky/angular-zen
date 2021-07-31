import { DurationAnnotation, DurationUnit, TimeBreakdown } from '../abstraction/types/general';

const DurationMultipliers: Record<DurationUnit, number> = { ms: 1, s: 1000, m: 60000 };

export function durationToMs(duration: DurationAnnotation): number
{
    if (typeof duration === 'number') return duration;

    const regex = /(?<value>\d+(.\d+)?)(?<units>\w+)/;
    
    const { value, units } = duration.match(regex)?.groups as { value: string, units: DurationUnit };

    return parseInt(value) * (DurationMultipliers[units] || 1);
}

export function breakdownTime(showingForMs: number)
{
    const dummyDate = new Date(showingForMs);

    const showingFor: TimeBreakdown = {
        m: dummyDate.getMinutes(),
        s: dummyDate.getSeconds(),
        ms: dummyDate.getMilliseconds(),
        totalMinutes: showingForMs / DurationMultipliers.m,
        totalSeconds: showingForMs / DurationMultipliers.s,
        totalMilliseconds: showingForMs,
    };
    return showingFor;
}
