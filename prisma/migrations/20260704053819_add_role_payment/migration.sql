-- CreateTable
CREATE TABLE "role_payments" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "hourPerDay" INTEGER,
    "hourBudgetPerHour" INTEGER,
    "hourNoOfDays" INTEGER,
    "hourCommission" INTEGER,
    "hourTalentBudget" INTEGER,
    "hourProfit" INTEGER,
    "dayFullDay" INTEGER,
    "dayHalfDay" INTEGER,
    "dayBudgetFullDay" INTEGER,
    "dayBudgetHalfDay" INTEGER,
    "dayTotalBudget" INTEGER,
    "dayCommission" INTEGER,
    "dayTalentFullDay" INTEGER,
    "dayTalentHalfDay" INTEGER,
    "dayTalentTotal" INTEGER,
    "dayTotalProfit" INTEGER,
    "weekNoOfWeek" INTEGER,
    "weekDaysPerWeek" INTEGER,
    "weekBudgetPerWeek" INTEGER,
    "weekCommission" INTEGER,
    "weekTalentBudget" INTEGER,
    "weekProfit" INTEGER,
    "monthNoOfMonth" INTEGER,
    "monthDayPerMonth" INTEGER,
    "monthBudgetPerMonth" INTEGER,
    "monthCommission" INTEGER,
    "monthTalentBudget" INTEGER,
    "monthProfit" INTEGER,
    "packageBudgetFullDay" INTEGER,
    "packageBudgetHalfDay" INTEGER,
    "packageTotalBudget" INTEGER,
    "packageCommission" INTEGER,
    "packageTotalTalent" INTEGER,
    "packageProfit" INTEGER,
    "status" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "role_payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "role_payments_roleId_key" ON "role_payments"("roleId");

-- AddForeignKey
ALTER TABLE "role_payments" ADD CONSTRAINT "role_payments_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
