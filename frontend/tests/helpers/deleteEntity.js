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

export async function cleanUpEntity(request, entity, name) {
  const response = await request.get(`/api/${entity}`);
  if (!response.ok()) {
    console.warn(`could not get list of ${entity}`);
    return;
  }

  const items = await response.json();
  const toDelete = items.filter(item => item.name === name);

  for (const item of toDelete) {
    const delRes = await request.delete(`/api/${entity}/${item.id}`);
    if (!delRes.ok()) {
      console.warn(`Could not delete ${entity}/${item.id}`);
    }
  }
}
