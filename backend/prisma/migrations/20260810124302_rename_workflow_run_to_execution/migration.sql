/*
  Warnings:

  - You are about to drop the `WorkflowRun` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ExecutionStatus" AS ENUM ('RUNNING', 'SUCCEEDED', 'FAILED');

-- DropForeignKey
ALTER TABLE "WorkflowRun" DROP CONSTRAINT "WorkflowRun_workflowId_fkey";

-- DropTable
DROP TABLE "WorkflowRun";

-- DropEnum
DROP TYPE "RunStatus";

-- CreateTable
CREATE TABLE "WorkflowExecution" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "status" "ExecutionStatus" NOT NULL DEFAULT 'RUNNING',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "output" JSONB,
    "error" TEXT,

    CONSTRAINT "WorkflowExecution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WorkflowExecution_workflowId_startedAt_idx" ON "WorkflowExecution"("workflowId", "startedAt");

-- AddForeignKey
ALTER TABLE "WorkflowExecution" ADD CONSTRAINT "WorkflowExecution_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;
