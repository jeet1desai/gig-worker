import { WorkingStepDirectionType, WorkingStepPayload } from '@/types/fe';
import { safeJson } from '@/lib/utils/safeJson';
import prisma from '@/lib/prisma';
import { WORKING_STEPS_MOVE_DIRECTION } from '@/constants';

export const getWorkingSteps = async () => {
  const steps = await prisma.workingSteps.findMany({
    orderBy: { order: 'asc' }
  });

  return safeJson(steps);
};

export const createWorkingStep = async (step_details: WorkingStepPayload) => {
  await prisma.workingSteps.create({
    data: {
      title: step_details.title,
      description: step_details.description,
      order: step_details.order,
      color: step_details.color
    }
  });
  return { success: true, message: 'The working step has been successfully created.' };
};

export const updateWorkingStep = async (step_details: WorkingStepPayload, step_id: string) => {
  await prisma.workingSteps.update({
    where: { id: BigInt(step_id) },
    data: {
      title: step_details.title,
      description: step_details.description,
      color: step_details.color
    }
  });
  return { success: true, message: 'The working step has been successfully updated.' };
};

export const deleteWorkingStep = async (step_id: string) => {
  const stepToDelete = await prisma.workingSteps.findUnique({
    where: { id: BigInt(step_id) }
  });

  if (!stepToDelete) {
    throw new Error('Step not found');
  }

  const deletedOrder = stepToDelete.order;

  await prisma.workingSteps.delete({
    where: { id: BigInt(step_id) }
  });

  await prisma.workingSteps.updateMany({
    where: {
      order: {
        gt: deletedOrder
      }
    },
    data: {
      order: {
        decrement: 1
      }
    }
  });

  return { success: true, message: 'The working step has been successfully deleted.' };
};

export const changeWorkingStepOrder = async (id: string, direction: WorkingStepDirectionType) => {
  const currentStep = await prisma.workingSteps.findUnique({
    where: { id: BigInt(id) }
  });

  if (!currentStep) throw new Error('Step not found');

  const steps = await prisma.workingSteps.findMany({
    orderBy: { order: 'asc' }
  });

  const stepIndex = steps.findIndex((s) => s.id === BigInt(id));

  if (
    (direction === WORKING_STEPS_MOVE_DIRECTION.up && stepIndex === 0) ||
    (direction === WORKING_STEPS_MOVE_DIRECTION.down && stepIndex === steps.length - 1)
  ) {
    return { success: true, message: 'Cannot move step in that direction' };
  }

  const targetIndex = direction === WORKING_STEPS_MOVE_DIRECTION.up ? stepIndex - 1 : stepIndex + 1;
  const targetStep = steps[targetIndex];

  await prisma.$transaction([
    prisma.workingSteps.update({
      where: { id: currentStep.id },
      data: { order: targetStep.order }
    }),
    prisma.workingSteps.update({
      where: { id: targetStep.id },
      data: { order: currentStep.order }
    })
  ]);

  return { success: true, message: 'The working step has been successfully updated.' };
};
