import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Text, View, ScrollView, Alert } from "react-native";

import { HabitDay, daySize } from "../components/HabitDay";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";

import { api } from "../lib/axios";
import { generateRangeDatesFromYearStart } from "../utils/generate-range-between-dates";

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S',]
const datesFromYearStart = generateRangeDatesFromYearStart()
const minimumSummaryDatesSizes = 18 * 5;
const amountOfDaysToFill = minimumSummaryDatesSizes - datesFromYearStart.length

type SummaryProps = Array<{
    id:string,
    date:string,
    amount:number,
    completed:number
}> 

export function Home() {

    const [loading, setLoading] = useState(true)
    const [summary, setSummary] = useState<SummaryProps | null>(null)
    const { navigate } = useNavigation()

    async function fetchData() {
        try {
            setLoading(true)
            const response = await api.get('/summary')
            setSummary(response.data)
            console.log(response.data)

        } catch (error) {
            Alert.alert('Ops', 'Não foi possivel carregar o sumário de Hábitos')
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    if (loading) {
        return (<Loading />)
    }

    return (
        <View className="flex-1 bg-background px-8 py-16" >
            <Header />
            <View className="flex-row mt-6 mb-2">
                {
                    weekDays.map((weekDay, i) => (
                        <Text key={`${weekDay}-${i}`}
                            className="text-zinc-400 text-xl font-bold text-center mx-1"
                            style={{ width: daySize }}
                        >
                            {weekDay}
                        </Text>
                    ))
                }
            </View>
            <ScrollView showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 80 }}
            >
                {   summary &&
                    <View className="flex-row flex-wrap">
                    {
                        datesFromYearStart.map(date => {
                            const dayWithHabits = summary.find(day=>{
                                return dayjs(date).isSame(day.date,'day')
                            })
                            return (
                                <HabitDay
                                    key={date.toISOString()}
                                    onPress={() => navigate('habit', { date: date.toISOString() })}
                                    amountOfHabits={dayWithHabits?.amount}
                                    amountOfCompleted={dayWithHabits?.completed}
                                    date={date}
                                />
                            )
                        })
                    }
                    {
                        amountOfDaysToFill > 0 && Array.from({ length: amountOfDaysToFill }).map((_, i) => (
                            <View key={i}
                                className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                                style={{ width: daySize, height: daySize }} />
                        ))
                    }
                </View>}
            </ScrollView>
        </View>
    )
}

