import { expect } from '@playwright/test';

export async function deleteTaskByName(page, taskName, taskData) {
  await page.goto(taskData.url.list);
  const taskRow = page.locator('table tbody tr', { hasText: taskName });

  const deleteButton = taskRow.getByRole('button', {
    name: taskData.buttons.delete,
  });

  await deleteButton.click();

  await expect(page.locator(`text=${taskName}`)).not.toBeVisible();
}

export async function deleteStatusByName(page, statusName, statusData) {
  await page.goto(statusData.url.list);
  const statusRow = page.locator('table tbody tr', { hasText: statusName });

  const deleteButton = statusRow.getByRole('button', {
    name: statusData.buttons.delete,
  });

  await deleteButton.click();

  await expect(page.locator(`text=${statusName}`)).not.toBeVisible();
}
