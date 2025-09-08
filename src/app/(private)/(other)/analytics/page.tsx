'use client';

import { useState, useMemo } from "react";
import TimeFrameSelect from "../components/analytics/TimeFrameSelect";
import SalesSelect from "../components/mail/select/SalesSelect";
import LineBreak from "../../features/userSettings/components/LineBreak";
import { useStore } from "@/store";
import { formatDate, getDaysInMonth } from "../../utils/dateUtils";
import {
    generateExpenseData,
    generatePayrollData,
    generateSalesData,
    SalesGenerationResult,
} from "../utils/generateUtils";
import { Expense, Payroll } from "../../types/formTypes";
import { Loading } from "@/app/components/Loading";
import ProfitGraph from "../components/analytics/ProfitGraph";
import TotalRow from "../components/analytics/TotalSection";

export default function AnalyticsPage() {
    const { storeState } = useStore();
    const today = new Date();
    const [currentStartMonth, setCurrentStartMonth] = useState(today.getMonth());
    const [currentEndMonth, setCurrentEndMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [salesError, setSalesError] = useState<string | null>(null);
    const [selectedStores, setSelectedStores] = useState<number[]>(() => {
        return storeState.stores?.filter(store => store.active).map(store => store.id) || []
    }
    );
    const [loadingGraph, setLoadingGraph] = useState(false);
    const [analysisData, setAnalysisData] = useState<{
        sales: SalesGenerationResult | null;
        expenses: { data: Expense[]; error?: string } | null;
        payroll: { data: Payroll[]; error?: string } | null;
    }>({
        sales: null,
        expenses: null,
        payroll: null,
    });

    const handleStartMonthChange = (month: number) => setCurrentStartMonth(month);
    const handleEndMonthChange = (month: number) => setCurrentEndMonth(month);
    const handleYearChange = (year: number) => setCurrentYear(year);

    const handleStoreSelect = (storeId: string) => {
        const storeIdInt = parseInt(storeId);
        setSelectedStores(prev =>
            prev.includes(storeIdInt)
                ? prev.filter(id => id !== storeIdInt)
                : [...prev, storeIdInt]
        );
    };

    const handleSelectAll = () => {
        const activeStoreIds =
            storeState.stores?.filter(store => store.active).map(store => store.id) || [];
        setSelectedStores(activeStoreIds);
    };

    const generateData = async () => {
        setSalesError(null);
        setLoadingGraph(true);
        if (selectedStores.length === 0) {
            setSalesError("Please select at least one store");
            setLoadingGraph(false);
            return;
        }

        const startDate = formatDate("1", String(currentStartMonth + 1), String(currentYear));
        const endDate = formatDate(
            String(getDaysInMonth(Number(currentEndMonth), Number(currentYear))),
            String(currentEndMonth + 1),
            String(currentYear)
        );

        console.log("startDate, endDate", startDate, endDate);

        try {
            const [salesResult, expenseResult, payrollResult] = await Promise.all([
                generateSalesData(selectedStores, storeState.stores || [], startDate, endDate),
                generateExpenseData(startDate, endDate),
                generatePayrollData(startDate, endDate),
            ]);

            setAnalysisData({
                sales: salesResult,
                expenses: expenseResult,
                payroll: payrollResult,
            });
        } catch (error) {
            console.error("Error generating data:", error);
            setSalesError(
                error instanceof Error ? error.message : "An unexpected error occurred"
            );
        } finally {
            setLoadingGraph(false);
        }
    };

    type CombinedResult = Record<
        string, // "YYYY-MM"
        { expenses: number; payroll: number; sales: number }
    >;

    const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

    const graphData = useMemo(() => {
        if (!analysisData.expenses || !analysisData.payroll || !analysisData.sales) return {};
        function groupByMonthYear(
            expenses: Expense[],
            payrolls: Payroll[],
            salesResult: SalesGenerationResult
        ): CombinedResult {
            const result: CombinedResult = {};
            const getMonthKey = (date: string) => {
                return `${date.substring(0, 4)}-${date.substring(5, 7)}`;
            };

            // Expenses
            expenses.forEach(exp => {
                const key = getMonthKey(exp.date);
                if (!result[key]) result[key] = { expenses: 0, payroll: 0, sales: 0 };
                result[key].expenses = round2(result[key].expenses + exp.amount);
            });

            // Payroll
            payrolls.forEach(pay => {
                const key = getMonthKey(pay.end_date);
                if (!result[key]) result[key] = { expenses: 0, payroll: 0, sales: 0 };
                result[key].payroll = round2(result[key].payroll + pay.total_pay);
            });

            // Sales
            salesResult.data.forEach(store => {
                store.salesData.forEach(sale => {
                    const key = getMonthKey(sale.date);
                    if (!result[key]) result[key] = { expenses: 0, payroll: 0, sales: 0 };
                    result[key].sales = round2(result[key].sales + sale.sales);
                });
            });

            return result;
        }
        return groupByMonthYear(
            analysisData.expenses.data,
            analysisData.payroll.data,
            analysisData.sales
        );
    }, [analysisData.expenses, analysisData.payroll, analysisData.sales]);
    console.log(graphData)
    return (
        <div className="w-full h-full flex flex-col justify-center  px-16 pt-8 gap-y-8">
            <div className="flex items-center justify-between pr-16">
                <TimeFrameSelect
                    onStartMonthChange={handleStartMonthChange}
                    onEndMonthChange={handleEndMonthChange}
                    onYearChange={handleYearChange}
                    currentMonth={currentStartMonth}
                    currentEndMonth={currentEndMonth}
                    currentYear={currentYear}
                />
                <button
                    onClick={generateData}
                    className="px-4 py-4 cursor-pointer text-[14px] text-[#2F2F2F] font-semibold bg-[#B6E8E4] rounded-full hover:bg-[#DFF4F3] transition-colors duration-200"
                >
                    Generate Report
                </button>
            </div>

            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-x-4">
                        <div className="flex justify-between w-full">
                            <h2 className="text-[20px] font-semibold text-[#2F2F2F]">Sales</h2>
                            <button
                                onClick={handleSelectAll}
                                className="px-4 text-[14px] text-[#2A7D7B] font-semibold hover:text-[#48B4A0] transition-colors duration-200"
                            >
                                Select All
                            </button>
                            {salesError && (
                                <span className="text-[#FF0000] text-sm">{salesError}</span>
                            )}
                        </div>
                    </div>
                </div>
                <SalesSelect
                    selectedStores={selectedStores.map(String)}
                    onStoreSelect={handleStoreSelect}
                />
                <LineBreak className="my-6" />
                {/* Debug output */}
                <div className="max-h-[500px] w-full overflow-y-auto flex justify-center items-center">
                    {loadingGraph ? <Loading /> :
                        Object.keys(graphData).length > 0 ?
                            <div className="min-w-[1000px] min-h-[460px]">
                                <ProfitGraph graphData={graphData} />
                                <TotalRow totalSales={Object.keys(graphData).map((key) => graphData[key].sales).reduce((sum, val) => sum + val, 0)}
                                    totalExpenses={Object.keys(graphData).map((key) => graphData[key].expenses).reduce((sum, val) => sum + val, 0)}
                                    totalPayroll={Object.keys(graphData).map((key) => graphData[key].payroll).reduce((sum, val) => sum + val, 0)} />
                            </div> :
                            <div>
                                <p className="text-[#2F2F2F] text-[16px]">Please generate a report</p>
                            </div>
                    }
                </div>
            </div>
        </div>
    );
}
