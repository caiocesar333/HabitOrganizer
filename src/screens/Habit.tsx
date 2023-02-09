import { useFocusEffect, useRoute } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { View, ScrollView, Text, Alert } from "react-native";

import dayjs from "dayjs";
import { api } from "../lib/axios";
import { generateProgressPercentage } from "../utils/generrate-progress-porcentage";

import { BackButton } from "../components/BackButton";
import { ProgressBar } from "../components/ProgressBar";
import { Checkbox } from "../components/Checkbox";
import { Loading } from "../components/Loading";
import { HabitsEmpty } from "../components/HabitsEmpty";
import clsx from "clsx";



interface HabitParams {
    date: string
}

interface DayInfoProps {
    completedHabits: string[],
    possibleHabits: {
        id: string,
        title: string,
    }[]
}

export function Habit() {

    const [loading, setLoading] = useState(true)
    const [dayInfo, setDayInfo] = useState<DayInfoProps | null>(null)
    const [completedHabits, setCompletedHabits] = useState<string[]>([])

    const route = useRoute()
    const { date } = route.params as HabitParams

    const parsedDate = dayjs(date)
    const isDateInPast = parsedDate.endOf('day').isBefore(new Date())
    const daysOfWeek = parsedDate.format('dddd')
    const dayAndMonth = parsedDate.format('DD/MM')

    const habitsProgress = dayInfo?.possibleHabits ? generateProgressPercentage(dayInfo.possibleHabits.length, completedHabits.length) : 0

    async function fetchData() {
        try {
            setLoading(true)
            const response = await api.get('/day', { params: { date: date } })
            setDayInfo(response.data)
            setCompletedHabits(response.data.completedHabits)
        } catch (error) {
            console.log(error)
            Alert.alert('Ops', 'Não foi possivel carregar as informações dos hábitos')
        } finally {
            setLoading(false)
        }
    }

    async function handleToggleHabit(habitId: string) {
        try {
            await api.patch(`/habits/${habitId}/toggle`)

            if (completedHabits.includes(habitId)) {
                setCompletedHabits(prevState => prevState.filter(habit => habit !== habitId))
            } else {
                setCompletedHabits(prevState => [...prevState, habitId])
            }
        } catch (error) {
            console.log("🚀 ~ file: Habit.tsx:68 ~ handleToggleHabit ~ error", error)
            Alert.alert('Ops', "Não foi possivel atualizar o status do hábito")
        }
    }


    useFocusEffect(useCallback(()=>{
        fetchData();
    }, []))

    if (loading) {
        <Loading />
    }

    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 80 }}
            >
                <BackButton />

                <Text
                    className="mt-6 text-zinc-400 font-semibold text-base lowercase"
                >{daysOfWeek}
                </Text>
                <Text
                    className="mt-6 text-white font-extrabold text-3xl"
                >{dayAndMonth}
                </Text>
                <ProgressBar progress={habitsProgress} />

                <View className={clsx("mt-6", {
                    ['opacity-50']: isDateInPast
                })}>
                    {
                        dayInfo?.possibleHabits ?
                            dayInfo?.possibleHabits.map(habit => (

                                <Checkbox
                                    key={habit.id}
                                    title={habit.title}
                                    checked={completedHabits.includes(habit.id)}
                                    onPress={() => handleToggleHabit(habit.id)}
                                    disabled={isDateInPast}
                                />))

                            : <HabitsEmpty />
                    }
                    {
                        isDateInPast && (
                            <Text className="text-white mt-10 text-center opacity-40">
                                Be aware that you can't edit an habit of a date that already passed
                            </Text>
                        )
                    }
                </View>
            </ScrollView>
        </View>
    )
}