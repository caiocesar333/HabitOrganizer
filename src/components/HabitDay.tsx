import { TouchableOpacity, Dimensions, TouchableOpacityProps } from "react-native"
import { generateProgressPercentage } from "../utils/generrate-progress-porcentage"
import clsx from "clsx"
import dayjs from "dayjs"

const weekDays = 7
const screenHorizontalPadding = (32 * 2)/5

export const dayMarginBetween = 8
export const daySize = (Dimensions.get('screen').width / weekDays) -( screenHorizontalPadding + 5)

interface HabitDayProps extends TouchableOpacityProps{
    amountOfHabits?: number;
    amountOfCompleted?: number,
    date: Date,
}

export function HabitDay({amountOfHabits = 0, amountOfCompleted = 0, date, ...rest}:HabitDayProps) {

    const percentage = amountOfHabits > 0 ? generateProgressPercentage(amountOfHabits,amountOfCompleted) : 0
    const today = dayjs().startOf('day').toDate()
    const isCurrentDay = dayjs(date).isSame(today)

    return(
        <TouchableOpacity
        className={clsx("rounded-lg border-2 m-1", {
            ["bg-zinc-900 border-zinc-800"] : percentage === 0,
            ["bg-violet-900 border-violet-700"] : percentage > 0 && percentage < 20,
            ["bg-violet-800 border-violet-600"] : percentage >= 20 && percentage < 40,
            ["bg-violet-700 border-violet-500"] : percentage >= 40 && percentage < 60,
            ["bg-violet-600 border-violet-500"] : percentage >= 60 && percentage < 80,
            ["bg-violet-500 border-violet-400"] : percentage >= 80,
            ["border-white border-4"] : isCurrentDay

        })}
        style={{width: daySize, height:daySize}}
        activeOpacity={0.7}
        {...rest}
        />

    )
}